// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export function scrubResponse(response: any, secretValues: string[]): any {
    if (secretValues.length === 0) return response;

    let responseString = typeof response === "string" ? response : JSON.stringify(response);

    for (const secret of secretValues) {
        // Specialized encodings FIRST
        const base64 = Buffer.from(secret).toString("base64");
        if (base64 !== secret) {
            responseString = responseString.split(base64).join("[REDACTED_B64]");
        }

        const urlEncoded = encodeURIComponent(secret);
        if (urlEncoded !== secret) {
            responseString = responseString.split(urlEncoded).join("[REDACTED_URL]");
        }

        const hexEncoded = Buffer.from(secret).toString("hex");
        if (hexEncoded !== secret) {
            responseString = responseString.split(hexEncoded).join("[REDACTED_HEX]");
        }

        // Plain secret LAST
        responseString = responseString.split(secret).join("[REDACTED]");

        if (secret.length > 12) {
            const partialStart = secret.substring(0, 8);
            const partialEnd = secret.substring(secret.length - 8);
            if (partialStart.length >= 6) {
                responseString = responseString.split(partialStart).join("[REDACTED_PARTIAL]");
            }
            if (partialEnd.length >= 6) {
                responseString = responseString.split(partialEnd).join("[REDACTED_PARTIAL]");
            }
        }
    }

    // HIPAA PHI Detection (Regex-based)
    const PHI_PATTERNS = [
        { pattern: /\b[A-Z][0-9]{2}\.[0-9]{1,4}\b/g, label: "ICD-10" }, // ICD-10 diagnosis codes
        { pattern: /\bMRN\d{6,10}\b/gi, label: "MRN" }, // Medical Record Numbers
        { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, label: "SSN" }, // Social Security Numbers
    ];

    for (const { pattern, label } of PHI_PATTERNS) {
        responseString = responseString.replace(pattern, `[REDACTED_PHI_${label}]`);
    }

    if (typeof response === "string") return responseString;
    try { return JSON.parse(responseString); }
    catch { return responseString; }
}
