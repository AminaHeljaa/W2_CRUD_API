const express = require("express");

const app = express();

app.use(express.json());

const PORT = 3000;

let tasks = [
    {
        id: 1,
        title: "Learn REST APIs",
        completed: false
    },
    {
        id: 2,
        title: "Build CRUD API",
        completed: false
    },
    {
        id: 3,
        title: "Test API endpoints",
        completed: true
    }
];

app.get("/", (req, res) => {
    res.json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks"]
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

app.get("/tasks", (req, res) => {
    res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    res.json(task);
});

app.post("/tasks", (req, res) => {
    const { title, completed = false } = req.body;

    if (
        typeof title !== "string" ||
        title.trim().length < 3 ||
        title.trim().length > 120
    ) {
        return res.status(400).json({
            error: "Title must be between 3 and 120 characters."
        });
    }

    const newTask = {
        id: tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1,
        title: title.trim(),
        completed: Boolean(completed)
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    const { title, completed } = req.body;

    if (
        typeof title !== "string" ||
        title.trim().length < 3 ||
        title.trim().length > 120
    ) {
        return res.status(400).json({
            error: "Title must be between 3 and 120 characters."
        });
    }

    if (typeof completed !== "boolean") {
        return res.status(400).json({
            error: "Completed must be a boolean."
        });
    }

    task.title = title.trim();
    task.completed = completed;

    res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    const deletedTask = tasks.splice(taskIndex, 1);

    res.json({
        message: "Task deleted successfully",
        task: deletedTask[0]
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});