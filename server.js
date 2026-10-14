
require("dotenv").config();

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openapi = require("./openapi.json");
const { db, initializeDatabase } = require("./db");
const taskRepository = require("./repositories/postgresTaskRepository");
const supabase = require("./supabase");

const app = express();

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));

const PORT = process.env.PORT || 3000;

// AUTH MIDDLEWARE
async function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Access token required"
            });
        }

        const token = authHeader.slice(7).trim();

        if (!token) {
            return res.status(401).json({
                error: "Access token required"
            });
        }

        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({
                error: "Invalid or expired token"
            });
        }

        req.user = data.user;
        req.accessToken = token;

        next();
    } catch (error) {
        console.error("Authentication error:", error.message);

        return res.status(500).json({
            error: "Internal server error."
        });
    }
}

// SIGN UP
app.post("/auth/signup", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required."
            });
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            return res.status(400).json({
                error: error.message
            });
        }

        return res.status(201).json({
            message: "User registered successfully.",
            user: data.user
        });
    } catch (error) {
        console.error("Signup error:", error.message);

        return res.status(500).json({
            error: "Internal server error."
        });
    }
});

// LOG IN
app.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required."
            });
        }

        const { data, error } =
            await supabase.auth.signInWithPassword({
                email,
                password
            });

        if (error || !data.session || !data.user) {
            return res.status(401).json({
                error: "Invalid login credentials"
            });
        }

        return res.status(200).json({
            message: "Login successful.",
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: {
                id: data.user.id,
                email: data.user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            error: "Internal server error."
        });
    }
});


// LOG OUT
app.post("/auth/logout", authenticateToken, async (req, res) => {
    try {
        const response = await fetch(
            `${process.env.SUPABASE_URL}/auth/v1/logout?scope=global`,
            {
                method: "POST",
                headers: {
                    apikey: process.env.SUPABASE_KEY,
                    Authorization: `Bearer ${req.accessToken}`
                }
            }
        );

        if (!response.ok) {
            return res.status(401).json({
                error: "Unable to log out."
            });
        }

        return res.status(204).send();
    } catch (error) {
        console.error("Logout error:", error.message);

        return res.status(500).json({
            error: "Internal server error."
        });
    }
});


// PUBLIC INFO
app.get("/public/info", (req, res) => {
    res.status(200).json({
        message: "Welcome stranger! This info is public."
    });
});

// PROTECTED PROFILE
app.get("/protected/profile", authenticateToken, (req, res) => {
    return res.status(200).json({
        id: req.user.id,
        email: req.user.email,
        created_at: req.user.created_at
    });
});

// PROTECTED DASHBOARD
app.get("/protected/dashboard", authenticateToken, (req, res) => {
    return res.status(200).json({
        message: "Welcome to your protected dashboard.",
        user: {
            id: req.user.id,
            email: req.user.email
        }
    });
});

// FORMAT TASK
function formatTask(task) {
    return {
        id: task.id,
        title: task.title,
        done: task.done
    };
}

// HOME
app.get("/", (req, res) => {
    res.json({
        name: "Task API",
        version: "1.0",
        endpoints: [
            "/tasks",
            "/auth/signup",
            "/auth/login",
            "/auth/logout",
            "/public/info",
            "/protected/profile",
            "/protected/dashboard"
        ]
    });
});

// HEALTH
app.get("/health", async (req, res) => {
    try {
        await db.query("SELECT 1");
        res.json({ status: "ok" });
    } catch (error) {
        res.status(500).json({ status: "error" });
    }
});

// GET /tasks
app.get("/tasks", async (req, res, next) => {
    try {
        const tasks = await taskRepository.findAll();
        res.json(tasks.map(formatTask));
    } catch (error) {
        next(error);
    }
});

// GET /tasks/:id
app.get("/tasks/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid task ID."
            });
        }

        const task = await taskRepository.findById(id);

        if (!task) {
            return res.status(404).json({
                error: `Task ${id} not found`
            });
        }

        res.json(formatTask(task));
    } catch (error) {
        next(error);
    }
});

// POST /tasks
app.post("/tasks", async (req, res, next) => {
    try {
        const { title } = req.body;

        if (typeof title !== "string" || title.trim().length === 0) {
            return res.status(400).json({
                error: "Title is required."
            });
        }

        const task = await taskRepository.create({
            title: title.trim(),
            done: false
        });

        res.status(201).json(formatTask(task));
    } catch (error) {
        next(error);
    }
});

// PUT /tasks/:id
app.put("/tasks/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid task ID."
            });
        }

        const { title, done } = req.body;

        if (
            (title !== undefined &&
                (typeof title !== "string" || title.trim().length === 0)) ||
            (done !== undefined && typeof done !== "boolean")
        ) {
            return res.status(400).json({
                error: "Invalid task data."
            });
        }

        const existing = await taskRepository.findById(id);

        if (!existing) {
            return res.status(404).json({
                error: `Task ${id} not found`
            });
        }

        const updatedTask = await taskRepository.update(id, {
            title: title !== undefined ? title.trim() : existing.title,
            done: done !== undefined ? done : existing.done
        });

        res.status(200).json(formatTask(updatedTask));
    } catch (error) {
        next(error);
    }
});

// DELETE /tasks/:id
app.delete("/tasks/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid task ID."
            });
        }

        const deleted = await taskRepository.remove(id);

        if (!deleted) {
            return res.status(404).json({
                error: `Task ${id} not found`
            });
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

// ERROR HANDLER
app.use((error, req, res, next) => {
    console.error(error);

    res.status(500).json({
        error: "Internal server error."
    });
});

// START SERVER
async function startServer() {
    try {
        await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start application:", error);
        await db.end();
        process.exit(1);
    }
}

startServer();
