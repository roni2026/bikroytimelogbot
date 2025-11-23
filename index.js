// index.js
const restify = require('restify');
const { TeamsBot } = require('./bot');
const { BotFrameworkAdapter } = require('botbuilder');

// Adapter with Microsoft App credentials
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

const bot = new TeamsBot();

// Create server
const server = restify.createServer();
server.listen(process.env.port || 3978, () => {
    console.log(`\nBot listening to ${server.url}`);
});

// Listen for incoming requests
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await bot.run(context);
    });
});
