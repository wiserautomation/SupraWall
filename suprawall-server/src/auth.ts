import { Request, Response, NextFunction } from "express";
import { db } from "./firebase";

export interface AuthenticatedRequest extends Request {
    agent?: {
        id: string;
        tenantId: string;
        name: string;
        scopes: string[];
    };
}

export const gatekeeperAuth = async (req: Request, res: Response, next: NextFunction) => {
    // 1. Extract API Key
    const apiKey = (req.headers["x-api-key"] as string) || req.body.apiKey;

    if (!apiKey) {
        return res.status(401).json({ 
            decision: "DENY", 
            reason: "Unauthorized: Missing API Key. Get your key at https://suprawall.ai/" 
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
