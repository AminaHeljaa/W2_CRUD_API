
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openapi = require("./openapi.json");
const { db, initializeDatabase } = require("./db");
const taskRepository = require("./repositories/postgresTaskRepository");

const app = express();

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));

const PORT = process.env.PORT || 3000;

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
        endpoints: ["/tasks"]
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
            return res.status(400).json({ error: "Invalid task ID." });
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
            return res.status(400).json({ error: "Invalid task ID." });
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
            return res.status(400).json({ error: "Invalid task ID." });
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
    res.status(500).json({ error: "Internal server error." });
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
