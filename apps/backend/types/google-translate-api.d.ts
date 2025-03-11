declare module "@vitalets/google-translate-api" {
  export default function translate(
    text: string,
    options: { from: string; to: string }
  ): Promise<{ text: string }>;

  export interface TooManyRequestsError extends Error {
    name: "TooManyRequestsError";
    message: string;
  }
}
