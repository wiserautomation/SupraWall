
/**
 * Utility to parse .env file content into valid Vault secrets.
 * Handles KEY=VALUE, KEY="VALUE", KEY='VALUE' and skips comments/blanks.
 */

export interface ParsedSecret {
    key: string;
    value: string;
    description?: string;
}

export interface ParseResult {
    valid: ParsedSecret[];
    invalid: Array<{ key: string; value: string; reason: string }>;
    total: number;
}

const VAULT_NAME_PATTERN = /^[A-Z][A-Z0-9_]{2,63}$/;

export function parseEnvFile(content: string): ParseResult {
    const lines = content.split(/\r?\n/);
    const valid: ParsedSecret[] = [];
    const invalid: Array<{ key: string; value: string; reason: string }> = [];
    
    for (let line of lines) {
        line = line.trim();
        
        // Skip empty lines and comments
        if (!line || line.startsWith("#")) continue;
        
        const firstEqual = line.indexOf("=");
        if (firstEqual === -1) continue;
        
        let key = line.slice(0, firstEqual).trim();
        let value = line.slice(firstEqual + 1).trim();
        
        // Remove surrounding quotes from value
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        
        // Handle inline comments (basic)
        const hashIndex = value.indexOf("#");
        if (hashIndex !== -1) {
            // Check if it's not part of the value (basic check)
            // If it's a simple value, take what's before #
            // This is a naive heuristic but common for .env
            const preHash = value.slice(0, hashIndex).trim();
            if (preHash) value = preHash;
        }

        // Validate key
        if (!VAULT_NAME_PATTERN.test(key)) {
            // Try auto-fix: uppercase and replace non-alphanumeric with _
            const fixedKey = key.toUpperCase().replace(/[^A-Z0-9_]/g, "_").replace(/^[^A-Z]+/, "");
            
            if (VAULT_NAME_PATTERN.test(fixedKey)) {
                valid.push({ 
                    key: fixedKey, 
                    value, 
                    description: `Imported from .env (original key: ${key})` 
                });
            } else {
                invalid.push({ key, value, reason: "Key must match /^[A-Z][A-Z0-9_]{2,63}$/" });
            }
        } else {
            valid.push({ key, value, description: "Imported from .env" });
        }
    }
    
    return {
        valid,
        invalid,
        total: valid.length + invalid.length
    };
}
