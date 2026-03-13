export function scrubResponse(response: any, secretValues: string[]): any {
    if (secretValues.length === 0) return response;

    let responseString = typeof response === "string" ? response : JSON.stringify(response);

    for (const secret of secretValues) {
        responseString = responseString.split(secret).join("[REDACTED]");

        const base64 = Buffer.from(secret).toString("base64");
        responseString = responseString.split(base64).join("[REDACTED_B64]");

        const urlEncoded = encodeURIComponent(secret);
        responseString = responseString.split(urlEncoded).join("[REDACTED_URL]");

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

        const hexEncoded = Buffer.from(secret).toString("hex");
        if (hexEncoded !== secret) {
            responseString = responseString.split(hexEncoded).join("[REDACTED_HEX]");
        }
    }

    if (typeof response === "string") return responseString;
    try { return JSON.parse(responseString); }
    catch { return responseString; }
}
