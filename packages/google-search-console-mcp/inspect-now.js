import { GSCClient } from './build/lib/gsc.js';
import fs from 'fs';

async function main() {
    const authData = JSON.parse(fs.readFileSync('./service-account.json', 'utf8'));
    const gsc = new GSCClient(authData);
    const siteUrl = 'sc-domain:agentgate.com';
    const inspectionUrl = 'https://www.agentgate.com/';

    try {
        console.log(`Inspecting URL: ${inspectionUrl}`);
        const result = await gsc.inspectUrl(siteUrl, inspectionUrl);
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error(`Failed to inspect URL ${inspectionUrl}:`, error.message);
    }
}

main();
