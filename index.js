require('dotenv').config();
const express = require('express');
const { BotFrameworkAdapter } = require('botbuilder');
const { handleTeamsMessage } = require('./bot');
const { getSessionsByDate } = require('./logger');

const app = express();
app.use(express.json());

// Health check for Render root URL
app.get('/', (req, res) => {
  res.send('Bikroy Bot is Running');
});

// Adapter for Teams messages
const adapter = new BotFrameworkAdapter({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword
});

// Teams endpoint
app.post('/api/messages', (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    await handleTeamsMessage(context);
  });
});

// Web query for logs
app.get('/sessions', async (req, res) => {
  const { date, month, year } = req.query;
  try {
    const data = await getSessionsByDate(date, month, year);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bikroy Bot running on port ${PORT}`));
