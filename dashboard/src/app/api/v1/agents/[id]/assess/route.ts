import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/genai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { description } = await request.json();

    if (!description) {
      return NextResponse.json({ error: "Missing agent description" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not found in environment. Returning fallback assessment.");
      // Provide a smart fallback for demo purposes if key is missing, 
      // though in real world we'd want to fail or use a default.
    }

    const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
            responseMimeType: 'application/json'
        }
    });

    const prompt = `
Act as a Senior AI Security Architect for SupraWall. 
Given the following description of an AI agent's functionality, suggest the most appropriate security guardrails and policies to apply.

Agent Functionality: "${description}"

SupraWall supports the following guardrail configuration:
- budget: { limitUsd: number, resetPeriod: "daily" | "weekly" | "monthly" | "never" }
- allowedTools: string[] (names of tools the agent IS allowed to call)
- blockedTools: string[] (names of tools the agent IS NOT allowed to call)
- piiScrubbing: { enabled: boolean, patterns: ("email" | "phone" | "ssn" | "credit_card" | "ip")[] }

Also suggest 2-3 specific tool-level policies (Rules) for precise control.
Example: { toolName: "send_email", ruleType: "ALLOW", condition: "Only if recipient domain is company.com" }

Respond ONLY with a JSON object in this format:
{
  "assessment": "Short 1-2 sentence security strategy summary",
  "guardrails": {
    "budget": { "limitUsd": 1.00, "resetPeriod": "monthly" },
    "allowedTools": ["tool1", "tool2"],
    "blockedTools": ["tool3"],
    "piiScrubbing": { "enabled": true, "patterns": ["email"] }
  },
  "suggestedPolicies": [
    { "toolName": "tool_name", "ruleType": "ALLOW|DENY", "condition": "human readable condition" }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json(JSON.parse(text));

  } catch (err: any) {
    console.error("[API Agent Assess] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
