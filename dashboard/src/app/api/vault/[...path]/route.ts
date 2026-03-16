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
        const projectId = "agentguard-1b9e9";
        const functionName = "vaultApi";
        
        // Reconstruct path for the API
        // Incoming is typically /api/vault/api/v1/vault/secrets
        // We want to pass /api/v1/vault/secrets to the function
        const subPath = "/" + path.join("/");
        
        // The vaultApi onRequest function sees the path AFTER the function name.
        // If we call https://.../vaultApi/api/v1/vault/secrets, req.path is /api/v1/vault/secrets
        const functionUrl = `https://${region}-${projectId}.cloudfunctions.net/${functionName}${subPath}`;

        // 3. Forward the request to the Cloud Function
        const method = req.method;
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "x-tenant-id": tenantId, // Injected from server-side auth
        };

        const fetchOptions: RequestInit = {
            method,
            headers,
        };

        if (method !== "GET" && method !== "HEAD") {
            fetchOptions.body = await req.text();
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

        return NextResponse.json(data, { status: response.status });

    } catch (e: any) {
        console.error("[Vault Proxy Error]", e);
        return NextResponse.json({ 
            error: "Vault Proxy failed", 
            message: e.message 
        }, { status: 500 });
    }
}
