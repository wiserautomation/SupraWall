// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import puppeteer from 'puppeteer';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import handlebars from 'handlebars';
import crypto from 'crypto';
import { logger } from '../logger';

export interface ComplianceReportData {
    issueDate: string;
    tenantId: string;
    reportId: string;
    totalEvaluations: number;
    threatsBlocked: number;
    complianceScore: number;
    signature: string;
    events: Array<{
        timestamp: string;
        agentName: string;
        toolName: string;
        riskScore: number;
        decision: string;
    }>;
}

/**
 * Generates a signed compliance PDF using Puppeteer and Handlebars.
 */
export async function generateCompliancePDF(
    templateName: string,
    data: ComplianceReportData
): Promise<Buffer> {
    try {
        const templatePath = join(__dirname, 'templates', `${templateName}.html`);
        if (!existsSync(templatePath)) {
            throw new Error(`Template not found at ${templatePath}`);
        }

        const templateSource = readFileSync(templatePath, 'utf8');
        const compiledTemplate = handlebars.compile(templateSource);
        
        // Generate pre-render signature if not provided
        if (!data.signature) {
             const hash = crypto.createHash('sha256');
             hash.update(JSON.stringify(data));
             data.signature = hash.digest('hex').substring(0, 32).toUpperCase();
        }

        const html = compiledTemplate(data);

        logger.info(`[PDF] Launching Puppeteer browser for report ${data.reportId}...`);
        
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true,
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '15mm', bottom: '15mm', left: '10mm', right: '10mm' },
            displayHeaderFooter: true,
            headerTemplate: '<div style="font-size: 8px; font-family: sans-serif; margin: 0 auto; border-bottom: 1px solid #efefef; width: 80%; text-align: right; color: #999; padding-bottom: 5px;">SupraWall Compliance Service | Confidential Verification</div>',
            footerTemplate: '<div style="font-size: 8px; font-family: sans-serif; margin: 0 auto; width: 80%; display: flex; justify-content: space-between; color: #999; padding-top: 5px; border-top: 1px solid #efefef;"><div>Report: ' + data.reportId + '</div><div>Page <span class="pageNumber"></span> / <span class="totalPages"></span></div></div>',
        });

        await browser.close();
        const buffer = Buffer.from(pdf);
        logger.info(`[PDF] Successfully generated ${templateName} report (${buffer.length} bytes)`);
        
        return buffer;
    } catch (e) {
        logger.error(`[PDF] Error generating compliance PDF:`, e);
        throw e;
    }
}
