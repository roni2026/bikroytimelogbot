require('dotenv').config();
const express = require('express');
const { BotFrameworkAdapter } = require('botbuilder');
const { logLogin, logLogout, getSessionsByDate } = require('./logger');
const { handleTeamsMessage } = require('./bot');

const app = express();
app.use(express.json());

// Teams bot setup
const adapter = new BotFrameworkAdapter({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword
});

app.post('/api/messages', (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    await handleTeamsMessage(context);
  });
});

// Web query endpoint
app.get('/sessions', async (req, res) => {
  const { date, month, year } = req.query;
  try {
    const sessions = await getSessionsByDate(date, month, year);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.WEB_PORT || 3000;
app.listen(PORT, () => console.log(`Bikroy bot listening on port ${PORT}`));
