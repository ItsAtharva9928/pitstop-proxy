const signalR = require('@microsoft/signalr');
const pako = require('pako');

// Setup connection
const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://livetiming.formula1.com/signalrcore", {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  })
  .withAutomaticReconnect()
  .build();

// Base64 helper
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const lookup = new Uint8Array(256);
for (let i = 0; i < chars.length; i++) {
  lookup[chars.charCodeAt(i)] = i;
}

const decodeBase64 = (base64) => {
  let bufferLength = base64.length * 0.75;
  if (base64[base64.length - 1] === '=') bufferLength--;
  if (base64[base64.length - 2] === '=') bufferLength--;
  const bytes = new Uint8Array(bufferLength);
  let p = 0;
  for (let i = 0; i < base64.length; i += 4) {
    const encoded1 = lookup[base64.charCodeAt(i)];
    const encoded2 = lookup[base64.charCodeAt(i + 1)];
    const encoded3 = lookup[base64.charCodeAt(i + 2)];
    const encoded4 = lookup[base64.charCodeAt(i + 3)];
    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
  }
  return bytes;
};

// Decompression helper (F1 payload is zipped base64)
const decode = (val) => {
  try {
    const bytes = decodeBase64(val);
    const decompressed = pako.inflateRaw(bytes, { to: 'string' });
    return JSON.parse(decompressed);
  } catch (e) {
    try {
      return JSON.parse(val);
    } catch {
      return null;
    }
  }
};

// Handle incoming stream updates
connection.on("feed", (hubName, data) => {
  const payload = data !== undefined ? data : hubName;
  console.log(`\n=== Stream Update [${hubName || 'Raw'}] ===`);
  
  if (typeof payload === 'string') {
    console.log(JSON.stringify(decode(payload), null, 2));
  } else {
    const decodedPayload = {};
    for (const key of Object.keys(payload)) {
      const value = payload[key];
      decodedPayload[key] = typeof value === 'string' ? decode(value) : value;
    }
    console.log(JSON.stringify(decodedPayload, null, 2));
  }
});

async function start() {
  try {
    console.log("Connecting to F1 SignalR...");
    await connection.start();
    console.log("Connected! Subscribing to feeds...");
    
    // Subscribe to free F1 timing feeds
    await connection.invoke("Subscribe", [
      "TimingData", 
      "TrackStatus", 
      "WeatherData",
      "SessionInfo",
      "RaceControlMessages"
    ]);
    console.log("Subscribed successfully. Waiting for real-time updates...");
  } catch (err) {
    console.error("Error:", err);
  }
}

start();
