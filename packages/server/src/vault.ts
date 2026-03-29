import { pool } from "./db";
import { 
    resolveVaultTokens as sharedResolveVaultTokens
} from "@suprawall/core";
import type { VaultResolutionResult, VaultError } from "@suprawall/core";

export type { VaultResolutionResult, VaultError };

export async function resolveVaultTokens(
    tenantId: string,
    agentId: string,
    toolName: string,
    args: any
): Promise<VaultResolutionResult> {
    const encryptionKey = process.env.VAULT_ENCRYPTION_KEY || "";
    return sharedResolveVaultTokens(pool, encryptionKey, tenantId, agentId, toolName, args);
}
