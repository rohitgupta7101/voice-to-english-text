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
  let lastPartial = ""; // डुप्लिकेट partial को रोकने के लिए

  ws.on("message", async (message: Buffer) => {
    console.log("🎤 Audio Receiving... Chunk size:", message.length);

    const processed = recognizer.acceptWaveform(message);
    if (!processed) {
      // अगर प्रोसेसिंग पूरी नहीं हुई, तो partial चेक करें
      const partial = recognizer.partialResult();
      if (partial.partial && partial.partial !== lastPartial) {
        lastPartial = partial.partial;
        console.log("Partial:", partial);
        const englishText = await translateText(partial.partial);
        console.log("Sending partial to client:", {
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
      // अगर प्रोसेसिंग पूरी हुई, तो final भेजें
      const final = recognizer.result();
      console.log("Processed Final:", final);
      if (final.text) {
        const englishFinal = await translateText(final.text);
        console.log("Sending final to client:", {
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

  ws.on("close", async () => {
    console.log("🔴 Client Disconnected");
    const final = recognizer.result();
    console.log("Final on close:", final);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server Running on ws://localhost:${PORT}`);
});
