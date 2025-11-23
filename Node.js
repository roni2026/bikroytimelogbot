const { ActivityHandler } = require('botbuilder');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Patterns
const loginPatterns = ['D Login', 'D - Login', 'M', 'D', 'E', 'SE', 'N', 'M1', 'D1', 'E1', 'SE1', 'N1'];
const logoutPatterns = loginPatterns.map(p => p.replace(/Login$/, 'Logout').replace(/- Login$/, '- Logout'));

// Functions to log
async function logLogin(agentName, timestamp) {
    await pool.query(
        `INSERT INTO agent_sessions (agent_name, login_time) VALUES ($1, $2)`,
        [agentName, timestamp]
    );
}

async function logLogout(agentName, timestamp) {
    await pool.query(
        `UPDATE agent_sessions
         SET logout_time = $2, logout_date = DATE($2), logout_day_name = TO_CHAR($2, 'FMDay')
         WHERE agent_name = $1 AND logout_time IS NULL
         ORDER BY login_time DESC
         LIMIT 1`,
        [agentName, timestamp]
    );
}

// Bot
class TeamsBot extends ActivityHandler {
    constructor() {
        super();

        this.onMessage(async (context, next) => {
            const text = (context.activity.text || '').trim();
            const userName = context.activity.from.name;
            const timestamp = new Date();

            if (loginPatterns.includes(text)) {
                await logLogin(userName, timestamp);
                await context.sendActivity(`Login recorded for ${userName} at ${timestamp.toLocaleString()}`);
            } else if (logoutPatterns.includes(text)) {
                await logLogout(userName, timestamp);
                await context.sendActivity(`Logout recorded for ${userName} at ${timestamp.toLocaleString()}`);
            }

            await next();
        });
    }
}

module.exports.TeamsBot = TeamsBot;
