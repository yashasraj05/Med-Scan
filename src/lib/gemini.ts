import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY || "";

// We don't throw immediately to allow build to pass. 
// The check will happen when genAI is used.

// Initialize lazily or check inside function to avoid build-time errors
const genAI = new GoogleGenerativeAI(apiKey || "DUMMY_KEY_FOR_BUILD");
// Note: "DUMMY_KEY_FOR_BUILD" allows new GoogleGenerativeAI() to succeed during build time
// but will fail at runtime if the real key is missing.

export const modelNames = [
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "gemini-pro-vision",
];

export async function processWithGemini(prompt: string, imageBase64?: string) {
    let lastError: any = null;

    // Use the latest 2026 models
    const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
    console.log(`Processing with model: ${models[0]}`);

    for (const modelName of models) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const content: (string | { inlineData: { data: string; mimeType: string } })[] = [prompt];

            if (imageBase64) {
                content.push({
                    inlineData: {
                        data: imageBase64,
                        mimeType: "image/jpeg", // Matches the sharp conversion in route.ts
                    },
                });
            }

            console.log(`Attempting model: ${modelName}`);
            const result = await model.generateContent(content);
            const response = await result.response;

            // Check for safety blocks explicitly
            if (response.promptFeedback && response.promptFeedback.blockReason) {
                console.warn(`Model blocked prompt: ${response.promptFeedback.blockReason}`);
                throw new Error(`AI blocked request: ${response.promptFeedback.blockReason}`);
            }

            const text = response.text();
            if (!text) throw new Error("Empty response from AI (possibly safety block)");

            return response;
        } catch (err) {
            lastError = err;
            console.error(`Model ${modelName} failed:`, err instanceof Error ? err.message : String(err));
            // Should we add a delay before retrying? Maybe not for user latency.
        }
    }

    throw lastError || new Error("AI processing failed on all models");
}

// Helper to clean and extract JSON from potential markdown wrapping
export function extractJSON(text: string) {
    try {
        // First, try to parse the text directly if it's pure JSON
        return JSON.parse(text);
    } catch (e) {
        // If that fails, look for markdown code blocks (```json ... ```)
        const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch) {
            try {
                return JSON.parse(codeBlockMatch[1]);
            } catch (e2) {
                // Formatting inside code block might be wrong
            }
        }

        // Fallback: Find the first { and the last }
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const potentialJson = text.substring(firstBrace, lastBrace + 1);
            try {
                return JSON.parse(potentialJson);
            } catch (e3) {
                throw new Error(`JSON extraction failed: ${e3 instanceof Error ? e3.message : String(e3)}`);
            }
        }

        throw new Error("Could not find valid JSON in AI response");
    }
}
