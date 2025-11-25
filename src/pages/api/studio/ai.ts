import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt, context, history } = req.body;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'GOOGLE_API_KEY not configured' });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        // Prioritize better models
        const modelsToTry = ["gemini-2.5-pro", "gemini-2.0-pro-exp-02-05", "gemini-2.0-flash-thinking-exp-01-21", "gemini-2.0-flash", "gemini-pro"];

        let text = "";

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });

                let result;
                if (history && history.length > 0) {
                    const chat = model.startChat({
                        history: history,
                    });
                    result = await chat.sendMessage(prompt);
                } else {
                    const fullPrompt = context ? `Context:\n${context}\n\nInstruction: ${prompt}` : prompt;
                    result = await model.generateContent(fullPrompt);
                }

                const response = await result.response;
                text = response.text();
                break;
            } catch (e: any) {
                if (e.message.includes("404") || e.message.includes("not found")) {
                    continue;
                }
                throw e;
            }
        }

        if (!text) {
            return res.status(500).json({ error: 'All models failed' });
        }

        res.status(200).json({ response: text });
    } catch (error: any) {
        console.error("AI Error:", error);
        res.status(500).json({ error: error.message });
    }
}
