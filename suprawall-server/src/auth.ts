import { Request, Response, NextFunction } from "express";
import { db } from "./firebase";
import { pool } from "./db";

export interface AuthenticatedRequest extends Request {
    agent?: {
        id: string;
        tenantId: string;
        name: string;
        scopes: string[];
        max_cost_usd?: number;
    };
    tenantId?: string;
}

export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: Missing or invalid Authorization header. Use Bearer sw_admin_xxxx" });
    }

    const masterKey = authHeader.split(" ")[1];

    try {
        const result = await pool.query(
            "SELECT id FROM tenants WHERE master_api_key = $1",
            [masterKey]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Unauthorized: Invalid Master API Key." });
        }

        (req as AuthenticatedRequest).tenantId = result.rows[0].id;
        next();
    } catch (error) {
        console.error("[AdminAuth] Error:", error);
        res.status(500).json({ error: "Internal authentication error" });
    }
};

export const gatekeeperAuth = async (req: Request, res: Response, next: NextFunction) => {
    // 1. Extract API Key
    const apiKey = (req.headers["x-api-key"] as string) || req.body.apiKey;

    if (!apiKey) {
        return res.status(401).json({ 
            decision: "DENY", 
            reason: "Unauthorized: Missing API Key. Get your key at https://supra-wall.com" 
        });
    }

    if (!db) {
        console.warn("[Gatekeeper] Firebase DB not connected. Using test agent auth.");
        (req as AuthenticatedRequest).agent = {
            id: "00000000-0000-0000-0000-000000000002",
            tenantId: "00000000-0000-0000-0000-000000000001",
            name: "Test Simulation Agent",
            scopes: ["*:*"]
        };
        return next();
    }

    try {
        // 2. Query Firestore for the agent with this API Key
        // Note: In production, we should hash keys and query by hash.
        const agentsRef = db.collection("agents");
        const snapshot = await agentsRef.where("apiKey", "==", apiKey).limit(1).get();

        if (snapshot.empty) {
            return res.status(401).json({ 
                decision: "DENY", 
                reason: "Unauthorized: Invalid API Key." 
            });
        }

        const agentData = snapshot.docs[0].data();
        
        if (agentData.status === "inactive") {
            return res.status(403).json({ 
                decision: "DENY", 
                reason: "Unauthorized: Agent is inactive." 
            });
        }

        // 3. Attach agent info to request
        (req as AuthenticatedRequest).agent = {
            id: snapshot.docs[0].id,
            tenantId: agentData.tenantId || "default-tenant",
            name: agentData.name,
            scopes: agentData.scopes || [],
            max_cost_usd: agentData.max_cost_usd || 10,
        };

        next();
    } catch (error) {
        console.error("[Gatekeeper] Auth error:", error);
        res.status(500).json({ decision: "DENY", reason: "Internal authentication error" });
    }
};

export const getAgentById = async (agentId: string) => {
    if (!db) return null;
    const doc = await db.collection("agents").doc(agentId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as any;
};

export const verifyScope = (req: AuthenticatedRequest, toolName: string): boolean => {
    const scopes = req.agent?.scopes || [];
    
    // Simple wildcard support: "*:*" or "namespace:*"
    if (scopes.includes("*:*")) return true;
    
    const [namespace] = toolName.includes(":") ? toolName.split(":") : [null];
    
    if (namespace && scopes.includes(`${namespace}:*`)) return true;
    
    return scopes.includes(toolName);
};
