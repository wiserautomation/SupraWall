// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Robustly cleans a private key from environment variables.
 * Handles escaped newlines, surrounding quotes, and standardizes formatting
 * to prevent OpenSSL 3.0 decoder errors (common with gRPC/Firebase).
 */
export function cleanPrivateKey(key: string | undefined): string | undefined {
    if (!key) return undefined;
    
    // Replace literal \n strings with actual newlines
    let cleaned = key.replace(/\\n/g, '\n');
    
    // Remove any surrounding quotes
    cleaned = cleaned.replace(/^["']|["']$/g, '').trim();
    
    // OpenSSL 3.0 (Node 18+) decoder error check:
    // PKCS#1 (-----BEGIN RSA PRIVATE KEY-----) is often unsupported by gRPC/Node 18+ by default.
    // PKCS#8 (-----BEGIN PRIVATE KEY-----) is the required modern format.
    if (cleaned.includes('BEGIN RSA PRIVATE KEY')) {
        console.warn(
            "[SupraWall] WARNING: Detected Legacy PKCS#1 (RSA) private key format. " +
            "This will likely cause 'DECODER routines::unsupported' errors in Node 18+. " +
            "Please convert it to PKCS#8 using: " +
            "openssl pkcs8 -topk8 -nocrypt -in legacy_key.pem -out modern_key.pem"
        );
    }
    
    return cleaned;
}
