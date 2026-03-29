import { pool } from "./db_sql";
import { 
    analyzeCall as sharedAnalyzeCall, 
    updateBaseline as sharedUpdateBaseline
} from "@suprawall/core";
import type { SemanticAnalysisRequest, SemanticAnalysisResult } from "@suprawall/core";

export type SemanticLayerMode = 'none' | 'semantic' | 'behavioral' | 'custom';
export type { SemanticAnalysisRequest, SemanticAnalysisResult };

const dummyLogger = {
    info: console.log,
    warn: console.warn,
    error: console.error,
};

export async function analyzeCall(req: SemanticAnalysisRequest): Promise<SemanticAnalysisResult> {
    return sharedAnalyzeCall(pool, process.env, dummyLogger, req);
}

export async function updateBaseline(tenantId: string, agentId: string, toolName: string, args: unknown): Promise<void> {
    return sharedUpdateBaseline(pool, tenantId, agentId, toolName, args);
}
