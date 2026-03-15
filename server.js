const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8081;

// Middlewares
app.use(cors());
app.use(express.static(path.join(__dirname, '/')));

// API route to scan local folders (Mock fallback if browser fails)
app.get('/api/scan', (req, res) => {
    // In a full environment, we would use fs.readdirSync to map the local repo.
    // However, since we are focused purely on the frontend BA tooling right now,
    // this endpoint serves as a health-check placeholder for the Node API.
    res.json({ status: 'ok', message: 'Node.js backend is active and ready for folder scanning.' });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n\x1b[36m🐨 AuPromptKit Node.js Fallback Server running!\x1b[0m`);
    console.log(`\x1b[32m🚀 App is active at:\x1b[0m http://localhost:${PORT}`);
    console.log(`\x1b[90m(Local folder: ${__dirname})\x1b[0m`);
    console.log(`\x1b[33m💡 Use this if PowerShell is blocked for regular serving.\x1b[0m\n`);
});
