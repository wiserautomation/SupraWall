/**
 * SupraWall Plugin for OpenClaw
 * Provides native interception for autonomous browser agents.
 */

import { protect, SupraWallOptions } from "suprawall";

/**
 * Secure an OpenClaw agent instance.
 * 
 * Intercepts every browser command (click, type, navigate, etc.)
 * and audits it against your SupraWall security policies.
 * 
 * @example
 * import { secureClaw } from "@suprawall/claw";
 * const agent = new Clawbot(browser);
 * const secured = secureClaw(agent, { apiKey: "ag_..." });
 * 
 * await secured.execute("Click 'Delete Account'"); // 🛡️ Intercepted
 */
export function secureClaw(agent: any, options: SupraWallOptions) {
    if (!agent.browser) {
        console.warn("🛡️ SupraWall: Provided agent does not appear to be an OpenClaw instance (missing 'browser').");
    }

    // leverage the SDK's universal protect logic
    return protect(agent, options);
}

export { protect as protect };
