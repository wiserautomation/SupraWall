import { GSCClient } from './build/lib/gsc.js';
import fs from 'fs';

async function main() {
    const authData = JSON.parse(fs.readFileSync('./service-account.json', 'utf8'));
    const gsc = new GSCClient(authData);
    const siteUrl = 'sc-domain:supra-wall.com';
    const sitemaps = [
        'https://www.supra-wall.com/sitemap.xml'
    ];

    for (const sitemap of sitemaps) {
        try {
            console.log(`Submitting sitemap: ${sitemap}`);
            const result = await gsc.submitSitemap(siteUrl, sitemap);
            console.log(JSON.stringify(result, null, 2));
        } catch (error) {
            console.error(`Failed to submit sitemap ${sitemap}:`, error.message);
        }
    }
}

main();
