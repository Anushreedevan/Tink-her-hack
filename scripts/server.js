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
app.use(express.static(path.join(__dirname)));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// --- Gmail Configuration ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'anushreeofficial1608@gmail.com',
    pass: 'brdz lekw dfgd fjyo' 
  }
});

let isAlertActive = false; 

// sample data for autonomous simulation
const sampleQuakes = [
    { magnitude: "1.8", locationName: "Kothamangalam" },
    { magnitude: "2.4", locationName: "Ernakulam" },
    { magnitude: "3.1", locationName: "Aluva" },
    { magnitude: "4.6", locationName: "Thrissur" },
    { magnitude: "5.3", locationName: "Kochi" },
    { magnitude: "6.0", locationName: "Angamaly" },
    { magnitude: "7.1", locationName: "Mattancherry" },
    { magnitude: "7.5", locationName: "Fort Kochi" }
];

// helper to simulate random quake pick
function randomQuake() {
    return sampleQuakes[Math.floor(Math.random() * sampleQuakes.length)];
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

// centralized quake processing (used by API and simulator)
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
      console.log('🔒 Critical Guard Active.');
    }
  } else {
    if (isAlertActive) {
      isAlertActive = false;
      console.log('🔓 System Reset.');
    }
  }
}

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

// --- Simulation endpoint / periodic generator ---
app.post('/api/quake/simulate', (req, res) => {
  // manually trigger one random quake (for testing from frontend)
  const quake = randomQuake();
  handleQuake(quake);
  res.json({ status: 'simulated', quake });
});

// fire off an autonomous random quake every 15 seconds
setInterval(() => {
  const quake = randomQuake();
  handleQuake(quake);
}, 15000);


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`🚀 Engine live at http://localhost:${PORT}`));