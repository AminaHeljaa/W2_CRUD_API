const pool = require("../db/pool");

async function findAll() {
    const result = await pool.query(
        "SELECT id, title, done FROM tasks ORDER BY id"
    );
    return result.rows;
}

async function findById(id) {
    const result = await pool.query(
        "SELECT id, title, done FROM tasks WHERE id = $1",
        [id]
    );
    return result.rows[0] || null;
}

async function create(task) {
    const result = await pool.query(
        `INSERT INTO tasks (title, done)
     VALUES ($1, $2)
     RETURNING id, title, done`,
        [task.title, task.done ?? false]
    );
    return result.rows[0];
}

async function update(id, task) {
    const result = await pool.query(
        `UPDATE tasks
     SET title = $1, done = $2
     WHERE id = $3
     RETURNING id, title, done`,
        [task.title, task.done, id]
    );
    return result.rows[0] || null;
}

async function remove(id) {
    const result = await pool.query(
        "DELETE FROM tasks WHERE id = $1 RETURNING id",
        [id]
    );
    return result.rowCount > 0;
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
};