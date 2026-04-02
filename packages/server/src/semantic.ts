import { pool } from "./db";
import { logger } from "./logger";
import { 
    analyzeCall as sharedAnalyzeCall, 
    updateBaseline as sharedUpdateBaseline
} from "@suprawall/core";
import type { SemanticAnalysisRequest, SemanticAnalysisResult } from "@suprawall/core";

export type { SemanticAnalysisRequest, SemanticAnalysisResult };

export async function analyzeCall(req: SemanticAnalysisRequest): Promise<SemanticAnalysisResult> {
    return sharedAnalyzeCall(pool, process.env as any, logger, req);
}

export async function updateBaseline(tenantId: string, agentId: string, toolName: string, args: unknown): Promise<void> {
    return sharedUpdateBaseline(pool, tenantId, agentId, toolName, args);
}
