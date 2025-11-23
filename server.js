// server.js
const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get('/sessions', async (req, res) => {
    const { date, month, year } = req.query;
    let query = 'SELECT * FROM agent_sessions WHERE 1=1';
    const params = [];

    if (date) { params.push(date); query += ` AND day = $${params.length}`; }
    if (month) { params.push(month); query += ` AND month = $${params.length}`; }
    if (year) { params.push(year); query += ` AND year = $${params.length}`; }

    const result = await pool.query(query, params);
    res.json(result.rows);
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
