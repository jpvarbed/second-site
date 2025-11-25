import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function main() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error("❌ No GOOGLE_API_KEY found.");
        process.exit(1);
    }

    console.log(`🔑 Found API Key (length: ${apiKey.length})`);
    console.log("📡 Fetching available models via HTTP...");

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            console.error(`\n❌ HTTP Error: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.error("Response Body:", errorText);
            return;
        }

        const data = await response.json();
        console.log("\n✅ Success! Available Models:");
        if (data.models) {
            data.models.forEach((m: any) => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name.replace("models/", "")} (${m.displayName})`);
                }
            });
        } else {
            console.log("No models found in response.");
            console.log(JSON.stringify(data, null, 2));
        }

    } catch (error: any) {
        console.error("\n❌ Fetch Failed:", error.message);
    }
}

main();
