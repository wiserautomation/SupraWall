/**
 * Vault response scrubber unit tests (no DB required)
 */

import { scrubResponse } from "../../src/scrubber";

describe("Vault Scrubber", () => {
    const secret = "sk_live_SUPERSECRET123abc";

    test("scrubs exact secret value from response string", () => {
        const result = scrubResponse(`The key is ${secret} please use it`, [secret]);
        expect(result).not.toContain(secret);
        expect(result).toContain("[REDACTED]");
    });

    test("scrubs base64-encoded secret from response", () => {
        const b64 = Buffer.from(secret).toString("base64");
        const result = scrubResponse(`Encoded: ${b64}`, [secret]);
        expect(result).not.toContain(b64);
        expect(result).toContain("[REDACTED_B64]");
    });

    test("scrubs URL-encoded secret from response", () => {
        const urlEnc = encodeURIComponent(secret);
        const result = scrubResponse(`URL: ${urlEnc}`, [secret]);
        expect(result).not.toContain(urlEnc);
        expect(result).toContain("[REDACTED_URL]");
    });

    test("scrubs partial secret matches (first 8 chars)", () => {
        const partial = secret.substring(0, 8);
        const result = scrubResponse(`Partial key: ${partial}`, [secret]);
        expect(result).not.toContain(partial);
    });

    test("handles JSON response objects", () => {
        const obj = { status: "ok", key: secret, nested: { value: secret } };
        const result = scrubResponse(obj, [secret]) as any;
        expect(result.key).not.toBe(secret);
        expect(JSON.stringify(result)).not.toContain(secret);
    });

    test("returns original response when no secrets to scrub", () => {
        const original = { data: "hello world" };
        const result = scrubResponse(original, []);
        expect(result).toBe(original);
    });

    test("does not corrupt non-secret data in response", () => {
        const response = { userId: "user_123", status: "active", amount: 9900 };
        const result = scrubResponse(response, [secret]) as any;
        expect(result.userId).toBe("user_123");
        expect(result.status).toBe("active");
        expect(result.amount).toBe(9900);
    });

    test("scrubs hex-encoded secret from response", () => {
        const hex = Buffer.from(secret).toString("hex");
        const result = scrubResponse(`Hex: ${hex}`, [secret]);
        expect(result).not.toContain(hex);
        expect(result).toContain("[REDACTED_HEX]");
    });

    test("handles string response type", () => {
        const result = scrubResponse(`raw string with ${secret}`, [secret]);
        expect(typeof result).toBe("string");
        expect(result).not.toContain(secret);
    });
});
