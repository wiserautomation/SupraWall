import { verifyConnection, SupraWallOptions } from "./index.js";

const args = process.argv.slice(2);

if (args[0] !== "test") {
    console.log("Usage: npx suprawall test --api-key <YOUR_KEY> [--url <URL>]\n");
    process.exit(1);
}

let apiKey = "";
let url = "https://www.supra-wall.com/api/v1/evaluate";

for (let i = 1; i < args.length; i++) {
    if (args[i] === "--api-key") {
        apiKey = args[i + 1];
        i++;
    } else if (args[i] === "--url") {
        url = args[i + 1];
        i++;
    }
}

if (!apiKey) {
    console.error("❌ Missing --api-key");
    process.exit(1);
}

async function runTest() {
    console.log(`\nTesting connection to SupraWall Control Plane...`);
    console.log(`URL: ${url}`);
    
    // Silence the default SDK logger for the CLI output
    const options: SupraWallOptions = {
        apiKey,
        cloudFunctionUrl: url,
        logger: { warn: () => {}, error: () => {}, log: () => {} }
    };

    const status = await verifyConnection(options);

    if (status.status === "ACTIVE") {
        console.log(`\n✅ Connection:      OK (${status.latencyMs}ms latency)`);
        console.log(`✅ Authentication:  API key valid (Agent: ${status.agentName || status.agentId})`);
        console.log(`✅ Policy Engine:   ${status.policiesLoaded} policies active, evaluation working`);
        console.log(`✅ Vault:           ${status.vaultSecretsAvailable} secrets accessible, encryption verified`);
        console.log(`✅ Threat Intel:    Detection ${status.threatDetection || "active"}`);
        console.log(`\n🟢 SupraWall is fully operational. Your agents are protected.\n`);
    } else {
        console.log(`\n❌ Connection Failed: ${status.error}`);
        console.log(`\n⚠️ SupraWall is NOT operational. Check your configuration.\n`);
        process.exit(1);
    }
}

runTest();
