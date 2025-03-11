import * as vosk from "vosk";
import fs from "fs";
import path from "path";

const MODEL_PATH = path.resolve(
  __dirname,
  "../models/vosk-model-small-hi-0.22"
);

let model: vosk.Model;
let recognizer: vosk.Recognizer;

export const loadModels = async () => {
  if (!fs.existsSync(MODEL_PATH)) {
    console.error("❌ Model not found at", MODEL_PATH);
    process.exit(1);
  }

  (vosk as any).setLogLevel(0);

  model = new (vosk as any).Model(MODEL_PATH);
  recognizer = new (vosk as any).Recognizer({ model, sampleRate: 16000 });
  recognizer.setMaxAlternatives(1);
  recognizer.setWords(true);

  console.log("✅ Vosk Model Loaded Successfully");
};

export const getRecognizer = () => recognizer;
