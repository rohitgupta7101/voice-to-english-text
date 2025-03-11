import WebSocket from "ws";
import * as fs from "fs";

const SERVER_URL = "ws://localhost:3000";

console.log("🎤 Audio client started...");

const ws = new WebSocket(SERVER_URL);

ws.on("open", () => {
  console.log("✅ Connected to WebSocket server");

  const audioStream = fs.createReadStream("test.wav");
  audioStream.on("data", (chunk) => {
    console.log("📤 Sending chunk of size:", chunk.length);
    ws.send(chunk);
  });

  audioStream.on("end", () => {
    console.log("✅ Audio file sent, waiting for result...");
    setTimeout(() => ws.close(), 2000);
  });

  audioStream.on("error", (err) => {
    console.error("❌ Error reading audio file:", err);
  });
});

ws.on("message", (message) => {
  console.log("📝 Received from server:", message.toString());
});

ws.on("close", () => {
  console.log("🔴 Disconnected from server");
});

ws.on("error", (err) => {
  console.error("❌ WebSocket Error:", err);
});
