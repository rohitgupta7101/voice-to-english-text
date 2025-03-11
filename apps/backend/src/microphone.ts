import { WebSocket } from "ws";
import { spawn } from "child_process";

export function startMicStream(ws: WebSocket) {
  const rec = spawn("arecord", [
    "-f",
    "S16_LE",
    "-r",
    "16000",
    "-c",
    "1",
    "-t",
    "raw",
  ]);

  rec.stdout.on("data", (data) => {
    ws.send(data);
  });

  rec.stderr.on("data", (data) => {
    console.error("Mic Error:", data.toString());
  });

  rec.on("exit", () => {
    console.log("Mic Stream Stopped");
  });
}
