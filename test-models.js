const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    const key = process.env.GOOGLE_API_KEY;
    if (!key) {
        console.error("No API Key found!");
        return;
    }

    console.log("Fetching available models from API...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", JSON.stringify(data.error, null, 2));
            return;
        }

        if (data.models) {
            console.log("MODELS_START");
            data.models.forEach(m => {
                console.log(m.name.replace('models/', ''));
            });
            console.log("MODELS_END");
        } else {
            console.log("No models returned?", data);
        }

    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

listModels();
