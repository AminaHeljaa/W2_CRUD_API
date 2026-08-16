const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openapi = require("./openapi.json");
const db = require("./db");

const app = express();

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));

const PORT = 3000;

// Pretvara SQLite 0/1 u JavaScript false/true
function formatTask(task) {
    return {
        id: task.id,
        title: task.title,
        done: Boolean(task.done)
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
app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

// GET /tasks
app.get("/tasks", (req, res) => {
    const tasks = db.prepare(`
        SELECT id, title, done
        FROM tasks
        ORDER BY id
    `).all();

    res.json(tasks.map(formatTask));
});

// GET /tasks/:id
app.get("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = db.prepare(`
        SELECT id, title, done
        FROM tasks
        WHERE id = ?
    `).get(id);

    if (!task) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    res.json(formatTask(task));
});

// POST /tasks
app.post("/tasks", (req, res) => {
    const { title } = req.body;

    if (
        typeof title !== "string" ||
        title.trim().length === 0
    ) {
        return res.status(400).json({
            error: "Title is required."
        });
    }

    const result = db.prepare(`
        INSERT INTO tasks (title, done)
        VALUES (?, ?)
    `).run(title.trim(), 0);

    const newTask = db.prepare(`
        SELECT id, title, done
        FROM tasks
        WHERE id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json(formatTask(newTask));
});

// PUT /tasks/:id
app.put("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = db.prepare(`
        SELECT id, title, done
        FROM tasks
        WHERE id = ?
    `).get(id);

    if (!task) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    const { title, done } = req.body;

    if (
        (title !== undefined &&
            (typeof title !== "string" ||
                title.trim().length === 0)) ||
        (done !== undefined && typeof done !== "boolean")
    ) {
        return res.status(400).json({
            error: "Invalid task data."
        });
    }

    const newTitle =
        title !== undefined ? title.trim() : task.title;

    const newDone =
        done !== undefined ? done : Boolean(task.done);

    db.prepare(`
        UPDATE tasks
        SET title = ?, done = ?
        WHERE id = ?
    `).run(newTitle, newDone ? 1 : 0, id);

    const updatedTask = db.prepare(`
        SELECT id, title, done
        FROM tasks
        WHERE id = ?
    `).get(id);

    res.status(200).json(formatTask(updatedTask));
});

// DELETE /tasks/:id
app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = db.prepare(`
        SELECT id
        FROM tasks
        WHERE id = ?
    `).get(id);

    if (!task) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    db.prepare(`
        DELETE FROM tasks
        WHERE id = ?
    `).run(id);

    res.status(204).send();
});

// START SERVER
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});