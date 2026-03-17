import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";

export async function GET(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
    const params = await props.params;
    return handleProxy(req, params.path);
}

export async function POST(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
    const params = await props.params;
    return handleProxy(req, params.path);
}

export async function PUT(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
    const params = await props.params;
    return handleProxy(req, params.path);
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
    const params = await props.params;
    return handleProxy(req, params.path);
}

async function handleProxy(req: NextRequest, path: string[]) {
    try {
        // 1. Authenticate the user calling from the Dashboard
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized. Missing ID Token." }, { status: 401 });
        }
        
        const idToken = authHeader.split(" ")[1];
        const auth = getAdminAuth();
        const decodedToken = await auth.verifyIdToken(idToken);
        const tenantId = decodedToken.uid;

        // 2. Prepare the Cloud Function URL
        // Regional mapping for Firebase Functions
        const region = "us-central1"; 
        const projectId = process.env.FIREBASE_PROJECT_ID || "suprawall-1b9e9";
        const functionName = "vaultApi";
        
        // Reconstruct path for the API
        // If the incoming path is just "secrets", we should probably prefix it
        // but let's be flexible. The frontend should really send the full path.
        let subPath = "/" + path.join("/");
        if (!subPath.startsWith("/api/v1/vault") && !subPath.startsWith("/v1/vault")) {
            // Auto-prefix if missing to match Cloud Function expectations
            subPath = "/api/v1/vault" + (subPath.startsWith("/") ? "" : "/") + subPath;
        }
        
        const functionUrl = `https://${region}-${projectId}.cloudfunctions.net/${functionName}${subPath}`;

        // 3. Forward the request to the Cloud Function
        const method = req.method;
        console.log(`[Vault Proxy] Forwarding ${method} to ${functionUrl}`);

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "x-tenant-id": tenantId,
        };

        const fetchOptions: RequestInit = {
            method,
            headers,
        };

        if (method !== "GET" && method !== "HEAD") {
            const bodyText = await req.text();
            if (bodyText) fetchOptions.body = bodyText;
        }

        const response = await fetch(functionUrl, fetchOptions);
        
        // Forward the response
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = { message: await response.text() };
        }

        if (!response.ok) {
            console.error(`[Vault Proxy] Backend returned ${response.status}:`, data);
        }

        return NextResponse.json(data, { status: response.status });

    } catch (e: any) {
        console.error("[Vault Proxy Error]", e);
        return NextResponse.json({ 
            error: "Vault Proxy failed", 
            message: e.message,
            stack: process.env.NODE_ENV === 'development' ? e.stack : undefined
        }, { status: 500 });
    }
}
