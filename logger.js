const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function logLogin(agentName, timestamp) {
    const loginDate = timestamp.toISOString().split("T")[0];
    const dayName = timestamp.toLocaleDateString("en-US", { weekday: "long" });
    await pool.query(
        `INSERT INTO agent_sessions (agent_name, login_time, login_date, login_day_name, year, month, day)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [agentName, timestamp, loginDate, dayName, timestamp.getFullYear(), timestamp.getMonth() + 1, timestamp.getDate()]
    );
}

async function logLogout(agentName, timestamp) {
    const res = await pool.query(
        `SELECT * FROM agent_sessions 
         WHERE agent_name = $1 AND logout_time IS NULL
         ORDER BY login_time DESC LIMIT 1`,
        [agentName]
    );

    if (res.rows.length > 0) {
        const session = res.rows[0];
        await pool.query(
            `UPDATE agent_sessions
             SET logout_time = $2, logout_date = $3, logout_day_name = $4
             WHERE id = $1`,
            [session.id, timestamp, timestamp.toISOString().split("T")[0], timestamp.toLocaleDateString("en-US", { weekday: "long" })]
        );
    }
}

module.exports = { logLogin, logLogout };
