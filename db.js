
require("dotenv").config();

const db = require("./db/pool");

async function initializeDatabase() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            done BOOLEAN NOT NULL DEFAULT FALSE
        )
    `);

    const result = await db.query(
        "SELECT COUNT(*) AS count FROM tasks"
    );

    if (Number(result.rows[0].count) === 0) {
        await db.query(`
            INSERT INTO tasks (title, done)
            VALUES
                ('Learn REST APIs', FALSE),
                ('Build CRUD API', FALSE),
                ('Test API endpoints', TRUE)
        `);
    }

    console.log("PostgreSQL database is ready.");
}

module.exports = {
    db,
    initializeDatabase,
};
