Seismic Guard 🎯
Basic Details
Team Name: Maaza
Team Members
Member 1: Anushree - Mar Athanasius College of Engineering (MACE)

Member 2: Aparna-MACE

Hosted Project Link
https://tink-her-hack-q5dc.onrender.com

Project Description
Seismic Guard is a real-time disaster management and notification engine that monitors seismic activity and automates emergency response. It bridges the gap between sensor data and community mobilization by instantly notifying registered volunteers within a 10km radius of an epicenter.

The Problem statement
During earthquakes, delays in communication and lack of localized coordination lead to higher casualty rates. Traditional alert systems are often too broad, leading to "alert fatigue" or missing the critical responders closest to the impact zone.

The Solution
We built an automated Node.js engine that processes live seismic data. If a high-magnitude event is detected (M 7.0+), the system triggers an "Automatic Critical Alert" via Gmail to nearby responders. For moderate tremors, it provides an Admin Dashboard where authorities can manually mobilize help with a single click.

Technical Details
Technologies/Components Used
For Software:

Languages used: JavaScript (ES6+), HTML5, CSS3

Frameworks used: Express.js (Backend), Tailwind CSS (UI)

Libraries used: Socket.io (Real-time data), Nodemailer (Gmail Integration), Cors

Tools used: VS Code, Git, GitHub, Render (Hosting)

Features
List the key features of your project:

Real-time Seismic Feed: Uses WebSockets (Socket.io) to push live sensor data to the dashboard without refreshing the page.

10km Proximity Logic: Automated filtering to ensure only volunteers within the high-impact zone are notified, optimizing resource deployment.

State-Guard Anti-Spam: Intelligent logic that prevents multiple emails from being sent for a single consecutive seismic event.

Dynamic Email Templates: Context-aware email generation that changes instructions based on the severity of the quake.

Admin Transmission Log: A live visual log that confirms to authorities when and where emergency emails have been successfully dispatched.

Implementation
For Software:
Installation
Bash
npm install express socket.io nodemailer cors
Run
Bash
node server.js
Project Documentation
For Software:
Screenshots
Admin Command Center showing live seismic readings and the Gmail transmission log.

The Public Portal automatically switching to a Red 'EVACUATE' state during high-magnitude events.

Sample of the dynamic Gmail alert received by volunteers.

Diagrams
System Architecture:

The system uses a Node.js backend acting as a central hub. Data flows from a simulation script to the server via POST requests. The server then broadcasts data to all connected UIs via WebSockets and dispatches emails via the SMTP protocol.

Application Workflow:

Workflow: Sensor Data -> Magnitude Check -> State Guard (Check if already notified) -> If Magnitude >= 7.0 & Not Notified -> Dispatch Critical Gmail & Update Admin Log.

Additional Documentation
For Web Projects with Backend:
API Documentation
Base URL: https://disaster-engine.onrender.com

Endpoints
POST /api/quake

Description: Receives live seismic data from sensors.

Request Body:

JSON
{
  "magnitude": 7.4,
  "locationName": "Kothamangalam",
  "intensity": "Extreme"
}
POST /api/notify-manual

Description: Triggers a manual volunteer mobilization from the Admin panel.

Request Body:

JSON
{
  "locationName": "Kothamangalam",
  "magnitude": 5.8
}
Project Demo
Video
[Link to YouTube/Drive Demo]

The video demonstrates the end-to-end flow: from a seismic event being simulated to the Admin Monitor updating in real-time, and finally showing the automated Gmail arriving in the volunteer's inbox.

AI Tools Used
Tool Used: Gemini

Purpose: - Debugging asynchronous Socket.io connections.

Optimizing the 10km proximity logic for the backend.

Refactoring the UI with Tailwind CSS for a Command Center aesthetic.

Percentage of AI-generated code: 40%

Human Contributions:

Logic design for the "State Guard" anti-spam feature.

Integration of Nodemailer with Google App Passwords.

UI/UX layout and routing architecture.

Team Contributions
Anushree: Backend development, Gmail API integration, and State Guard logic.

[Member 2]: Frontend development, UI design using Tailwind CSS, and Documentation.

License
This project is licensed under the MIT License.

Made with ❤️ at TinkerHub
