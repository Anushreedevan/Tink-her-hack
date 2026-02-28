const axios = require('axios');

const sendData = async () => {
  const mags = [2.1, 5.8, 8.2, 3.5, 7.1]; 
  const currentMag = mags[Math.floor(Math.random() * mags.length)];
  
  try {
    await axios.post('http://localhost:3001/api/quake', {
      magnitude: currentMag,
      locationName: "Kothamangalam",
      intensity: currentMag >= 7 ? "Extreme" : currentMag >= 5 ? "Moderate" : "Low",
      locationCoords: { lat: 10.05, lng: 76.62 }
    });
    console.log(`✅ Sensor Broadcast: M ${currentMag}`);
  } catch (err) {
    console.error("❌ Link Failed. Is server.js running?");
  }
};

setInterval(sendData, 4000);