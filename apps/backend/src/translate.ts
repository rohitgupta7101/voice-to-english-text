import translate from "@vitalets/google-translate-api";

export async function translateText(text: string) {
  try {
    if (!text.trim()) return ""; // Empty check
    console.log("🌍 Translating:", text);

    const result = await translate(text, { from: "hi", to: "en" });
    console.log("✅ Translation Success:", result.text);
    return result.text;
  } catch (error) {
    console.error("❌ Translation Error:", error);
    return "[Translation Failed]"; // Return a safe fallback message
  }
}
