const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static assets from the same folder as this server file
// Ensure this is at the top of server.js

// 1. Static files (CSS/JS)
app.use(express.static(path.join(__dirname, 'scripts')));

// 2. The Root Route (Fixes "Cannot GET /")
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'scripts', 'Index.html'));
});

// 3. The Monitor Route (Fixes "Cannot GET /monitor")
app.get('/monitor', (req, res) => {
    res.sendFile(path.join(__dirname, 'scripts', 'monitor.html'));
});

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

// --- Gmail Configuration ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: 'anushreeofficial1608@gmail.com', // Your Gmail
    pass: 'brdz lekw dfgd fjyo' // Your NEW 16-char App Password
  }
});

let isAlertActive = false; 

// simulation helpers (optional, controlled by environment)
const sampleQuakes = [
    { magnitude: "1.8", locationName: "Kothamangalam" },
    { magnitude: "2.4", locationName: "Ernakulam" },
    { magnitude: "3.1", locationName: "Aluva" },
    { magnitude: "4.6", locationName: "Thrissur" },
    { magnitude: "5.3", locationName: "Kochi" },
    { magnitude: "5.9", locationName: "Angamaly" },
    { magnitude: "7.1", locationName: "Mattancherry" },
    { magnitude: "7.5", locationName: "Fort Kochi" }
];
function randomQuake() {
    return sampleQuakes[Math.floor(Math.random() * sampleQuakes.length)];
}

function handleQuake({ magnitude, locationName }) {
    const magValue = parseFloat(magnitude);
    const payload = { magnitude, locationName };
    console.log('🔷 Processing quake:', payload);
    io.emit('MONITOR_UPDATE', payload);

    if (magValue >= 7.0) {
        if (!isAlertActive) {
            const emailData = generateEmail(magnitude, locationName, 'AUTOMATIC');
            sendAlertEmail(emailData.subject, emailData.body, 'AUTOMATIC', locationName);
            isAlertActive = true;
            console.log("🔒 Critical Guard Active.");
        }
    } else {
        if (isAlertActive) {
            isAlertActive = false;
            console.log("🔓 System Reset.");
        }
    }
}

// expose simulation endpoint and optional interval
if (process.env.SIMULATE === 'true') {
    app.post('/api/quake/simulate', (req, res) => {
        const quake = randomQuake();
        handleQuake(quake);
        res.json({ status: 'simulated', quake });
    });
    setInterval(() => handleQuake(randomQuake()), 15000);
}

// --- RESTORED: Dynamic Email Template Function ---
const generateEmail = (magnitude, locationName, type) => {
    const isCritical = parseFloat(magnitude) >= 7.0;
    
    const subject = isCritical 
        ? `🚨 CRITICAL ALERT: M ${magnitude} - ${locationName}` 
        : `📢 Mobilization Request: ${locationName} Area`;

    const body = `
DISASTER DEPARTMENT | EMERGENCY RESPONSE UNIT
-------------------------------------------
TYPE: ${isCritical ? 'CRITICAL (AUTOMATIC)' : 'VOLUNTEER REQUEST (MANUAL)'}
LOCATION: ${locationName}
MAGNITUDE: M ${magnitude}

MESSAGE:
${isCritical 
    ? "A catastrophic earthquake has been detected. You are within the 10km high-impact zone. Please evacuate weak structures and report to the Assembly Point immediately." 
    : `A significant tremor has occurred. If you are within 10km of ${locationName} and are safe, please report to your designated station for assistance.`}

INSTRUCTIONS:
- Wear your standard-issue safety gear.
- Bring your communication devices.
- Confirm your response status on the Admin Monitor.

Official dispatch from the Disaster Dept Engine.
-------------------------------------------`;
    return { subject, body };
};

const sendAlertEmail = (subject, message, type, location) => {
  const mailOptions = {
    from: '"Disaster Dept" <anushreeofficial1608@gmail.com>',
    to: 'anushreeofficial1608@gmail.com',
    subject: subject,
    text: message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('❌ Email Error:', error);
    } else {
        console.log('✅ Email Sent:', info.response);
        io.emit('LOG_UPDATE', { type, location, method: 'GMAIL' });
    }
  });
};

// --- FIXED NAVIGATION ROUTES ---
// Also expose explicit routes at root for convenience
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/scripts/monitor.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'scripts', 'monitor.html'));
});

// --- API Routes ---
app.post('/api/quake', (req, res) => {
  handleQuake(req.body);
  res.sendStatus(200);
});

app.post('/api/notify-manual', (req, res) => {
  const { locationName, magnitude } = req.body;
  const emailData = generateEmail(magnitude, locationName, 'MANUAL');
  sendAlertEmail(emailData.subject, emailData.body, 'MANUAL', locationName);
  res.sendStatus(200);
});

// This line allows Render to tell your app which port to use
const PORT = process.env.PORT || 3001; 
server.listen(PORT, () => console.log(`🚀 Engine live on port ${PORT}`));
