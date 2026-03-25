// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0


import { withSupraWall, AgentInstance } from "./src/index";

async function runSimulation() {
    console.log("Starting SupraWall Simulation...");

    const myAgent: AgentInstance = {
        executeTool: async (name: string, args: any) => {
            console.log(`[Agent] Executing tool: ${name} with args:`, args);
            return `Successfully executed ${name}`;
        }
    };

    const securedAgent = withSupraWall(myAgent, {
        apiKey: "ag_test_simulation_key_321",
        cloudFunctionUrl: "http://localhost:3000/v1/evaluate",
        logger: console
    });

    console.log("\n--- Triggering REQUIRE_APPROVAL Action ---");
    try {
        const result = await securedAgent.executeTool("send_funds", { amount: 100, to: "unknown_address" });
        console.log("[Result]", result);
    } catch (err) {
        console.error("[Error]", err);
    }
}

runSimulation();
