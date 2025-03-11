declare module "node-record-lpcm16" {
  export function record(options: {
    sampleRate?: number;
    channels?: number;
    verbose?: boolean;
  }): {
    stream(): NodeJS.ReadableStream;
    stop(): void;
  };
}
