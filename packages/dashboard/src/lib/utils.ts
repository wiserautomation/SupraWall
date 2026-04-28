// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Robustly cleans an environment variable string.
 * Removes surrounding quotes and trims whitespace.
 */
export function cleanEnvVar(val: string | undefined): string | undefined {
    if (!val) return undefined;
    return val.replace(/^["']|["']$/g, '').trim();
}

/**
 * Robustly cleans a private key from environment variables.
 * Handles escaped newlines and standardizes formatting
 * to prevent OpenSSL 3.0 decoder errors.
 */
export function cleanPrivateKey(key: string | undefined): string | undefined {
    const cleaned = cleanEnvVar(key);
    if (!cleaned) return undefined;
    
    // Replace literal \n strings with actual newlines
    const finalKey = cleaned.replace(/\\n/g, '\n');
    
    if (finalKey.includes('BEGIN RSA PRIVATE KEY')) {
        console.warn(
            "[SupraWall] WARNING: Detected Legacy PKCS#1 (RSA) private key format. " +
            "Please convert it to PKCS#8 if you see DECODER errors."
        );
    }
    
    return finalKey;
}
