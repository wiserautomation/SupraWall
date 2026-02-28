import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export class GSCClient {
    private searchconsole = google.searchconsole('v1');
    private auth: OAuth2Client | any;

    constructor(authData: any) {
        if (authData.client_email && authData.private_key) {
            // Service Account
            this.auth = new google.auth.JWT(
                authData.client_email,
                undefined,
                authData.private_key,
                ['https://www.googleapis.com/auth/webmasters']
            );
        } else if (authData.client_id && authData.client_secret && authData.refresh_token) {
            // OAuth2
            this.auth = new google.auth.OAuth2(
                authData.client_id,
                authData.client_secret
            );
            this.auth.setCredentials({
                refresh_token: authData.refresh_token
            });
        } else {
            throw new Error('Invalid authentication data provided.');
        }
    }

    async listSites() {
        const res = await this.searchconsole.sites.list({
            auth: this.auth
        });
        return res.data.siteEntry || [];
    }

    async queryAnalytics(siteUrl: string, startDate: string, endDate: string, dimensions: string[] = ['query']) {
        const res = await this.searchconsole.searchanalytics.query({
            siteUrl,
            auth: this.auth,
            requestBody: {
                startDate,
                endDate,
                dimensions
            }
        });
        return res.data.rows || [];
    }

    async inspectUrl(siteUrl: string, inspectionUrl: string) {
        const res = await this.searchconsole.urlInspection.index.inspect({
            auth: this.auth,
            requestBody: {
                inspectionUrl,
                siteUrl
            }
        });
        return res.data.inspectionResult;
    }

    async submitSitemap(siteUrl: string, feedpath: string) {
        await this.searchconsole.sitemaps.submit({
            siteUrl,
            feedpath,
            auth: this.auth
        });
        return { success: true, message: `Sitemap submitted: ${feedpath} for site ${siteUrl}` };
    }
}
