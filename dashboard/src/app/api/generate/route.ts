import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { prompt, toolName } = body;

        if (!prompt || !toolName) {
            return NextResponse.json({ error: "Missing required fields: prompt, toolName" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Missing GEMINI_API_KEY in environment variables.");
            return NextResponse.json({ error: "Server misconfiguration. Missing AI keys." }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `You are an expert cybersecurity engineer. The user wants to restrict an AI agent using the tool '${toolName}'. They will describe the restriction in plain English: '${prompt}'. Return ONLY a raw Regular Expression string that matches the user's intent. Do not include markdown formatting, backticks, or explanations. If they want to BLOCK something, write a regex that matches the blocked pattern. If they want to ONLY ALLOW something, write a regex that matches the allowed pattern.`;

        const aiResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: systemPrompt,
        });

        let regexString = aiResponse.text?.trim() || ".*";

        // Remove markdown formatting if the model slipped it in
        if (regexString.startsWith("\`\`\`")) {
            regexString = regexString.replace(/\`\`\`(regex)?/gi, "").trim();
        }

        return NextResponse.json({ regex: regexString });
    } catch (error) {
        console.error("Error generating regex via Gemini:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
