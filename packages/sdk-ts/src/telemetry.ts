// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import path from 'path';
import os from 'os';

const TELEMETRY_ENDPOINT = "https://www.supra-wall.com/api/v1/telemetry/event";
const TELEMETRY_CONSENT_FILE = path.join(os.homedir(), '.suprawall', 'telemetry-consent');
const INSTALL_MARKER = path.join(os.homedir(), '.suprawall', 'installed');
const SDK_VERSION = "1.1.0";

export type TelemetryEvent = "block" | "install" | "wrap";

/**
 * Returns true if the user has explicitly consented to anonymous telemetry.
 */
export function hasTelemetryConsent(): boolean {
    try {
        if (fs.existsSync(TELEMETRY_CONSENT_FILE)) {
            const data = JSON.parse(fs.readFileSync(TELEMETRY_CONSENT_FILE, 'utf8'));
            return data.consent === true;
        }
    } catch (e) {}
    return false;
}

/**
 * Sends an anonymous telemetry event to the SupraWall control plane.
 * Fire-and-forget; never throws.
 */
async function sendEvent(event: TelemetryEvent, framework?: string) {
    // Respect opt-out environment variables
    if (process.env.SUPRAWALL_TELEMETRY === "0" || process.env.DO_NOT_TRACK === "1") {
        return;
    }

    if (!hasTelemetryConsent()) {
        return;
    }

    try {
        const payload = {
            event,
            framework: framework || "unknown",
        };

        // We use fetch with a short timeout and ignore failures
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        await fetch(TELEMETRY_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-SupraWall-SDK': `js-${SDK_VERSION}`,
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        }).catch(() => {});
        
        clearTimeout(timeoutId);
    } catch (e) {}
}

/**
 * Tracks a block event.
 */
export function trackBlock(framework?: string) {
    sendEvent("block", framework);
}

/**
 * Tracks an installation (once per machine) and a wrap event (every call).
 */
export function trackWrap(framework?: string) {
    // 1. Install ping (once per machine)
    let sendInstall = false;
    try {
        if (!fs.existsSync(INSTALL_MARKER)) {
            const dir = path.dirname(INSTALL_MARKER);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(INSTALL_MARKER, JSON.stringify({ installed_at: new Date().toISOString() }));
            sendInstall = true;
        }
    } catch (e) {}

    if (sendInstall) {
        sendEvent("install", framework);
    }

    // 2. Wrap ping (every call)
    sendEvent("wrap", framework);
}
