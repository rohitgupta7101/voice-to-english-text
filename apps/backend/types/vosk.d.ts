declare module "vosk" {
  export function setLogLevel(level: number): void;

  export class Model {
    constructor(modelPath: string);
    free(): void;
  }

  export class Recognizer {
    constructor(config: { model: Model; sampleRate: number });
    acceptWaveform(buffer: Buffer): boolean;
    result(): { text: string };
    partialResult(): { partial: string };
    setMaxAlternatives(count: number): void;
    setWords(flag: boolean): void;
    free(): void;
  }
}
