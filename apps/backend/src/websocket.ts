import { createServer } from "http";
import { WebSocketServer } from "ws";
import { Model, Recognizer } from "vosk";
import { translateText } from "./translate";

const PORT = 3000;
const MODEL_PATH = "./models/vosk-model-small-hi-0.22";
const SAMPLE_RATE = 16000;

const model = new Model(MODEL_PATH);
console.log("✅ Vosk Model Loaded");

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🟢 Client Connected");

  const recognizer = new Recognizer({ model: model, sampleRate: SAMPLE_RATE });
  recognizer.setWords(true);
  let lastPartial = ""; // To avoid duplicate partial results

  ws.on("message", async (message: Buffer) => {
    console.log("🎤 Receiving Audio... Chunk size:", message.length);

    const processed = recognizer.acceptWaveform(message);
    if (!processed) {
      const partial = recognizer.partialResult();
      if (partial.partial && partial.partial !== lastPartial) {
        lastPartial = partial.partial;
        const englishText = await translateText(partial.partial);
        console.log("Sending partial:", {
          hindi: partial.partial,
          english: englishText,
        });
        ws.send(
          JSON.stringify({
            type: "partial",
            hindi: partial.partial,
            english: englishText,
          })
        );
      }
    } else {
      const final = recognizer.result();
      if (final.text) {
        const englishFinal = await translateText(final.text);
        console.log("Sending final:", {
          hindi: final.text,
          english: englishFinal,
        });
        ws.send(
          JSON.stringify({
            type: "final",
            hindi: final.text,
            english: englishFinal,
          })
        );
      }
    }
  });

  ws.on("close", () => {
    console.log("🔴 Client Disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server Running on ws://localhost:${PORT}`);
});
