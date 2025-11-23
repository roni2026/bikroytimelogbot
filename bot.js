// bot.js
const { ActivityHandler } = require('botbuilder');
const { logLogin, logLogout } = require('./logger');

const loginPatterns = ['D Login', 'D - Login', 'M', 'D', 'E', 'SE', 'N', 'M1', 'D1', 'E1', 'SE1', 'N1'];
const logoutPatterns = loginPatterns.map(p => p.replace(/Login$/, 'Logout').replace(/- Login$/, '- Logout'));

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
