import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    const key = process.env.STRIPE_SECRET_KEY || "NOT_SET";
    const masked = key.length > 10 ? `${key.slice(0, 7)}...${key.slice(-4)}` : key;
    
    const fbEmail = process.env.FIREBASE_CLIENT_EMAIL || "NOT_SET";
    const fbProjectId = process.env.FIREBASE_PROJECT_ID || "NOT_SET";
    
    return NextResponse.json({
        stripe_key_masked: masked,
        firebase_email: fbEmail,
        firebase_project_id: fbProjectId,
        env_keys: Object.keys(process.env).filter(k => k.includes("STRIPE") || k.includes("FIREBASE")),
    });
}
