// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Router, Request, Response } from "express";
import { pool } from "../db";
import { randomUUID } from "crypto";
import { adminAuth, AuthenticatedRequest } from "../auth";
import { logger } from "../logger";
import { resolveTier, TieredRequest } from "../tier-guard";
import { generateCompliancePDF, ComplianceReportData } from "../compliance/pdf-generator";

const router = Router();

// ─── GET /v1/compliance/status ────────────────────────────────────────────────

router.get("/status", adminAuth, async (req: Request, res: Response) => {
    try {
        const authenticatedTenantId = (req as AuthenticatedRequest).tenantId;
        const { tenantId: queryTenantId } = req.query;
        
        // Security: Ensure query tenantId matches authenticated tenantId
        const tenantId = queryTenantId || authenticatedTenantId;
        if (queryTenantId && queryTenantId !== authenticatedTenantId) {
            return res.status(403).json({ error: "Forbidden: Cannot access compliance status of another tenant" });
        }

        if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

        const [approvalResult, auditResult, denyResult, oldestResult] = await Promise.all([
            pool.query("SELECT COUNT(*) FROM policies WHERE ruletype = 'REQUIRE_APPROVAL' AND tenantid = $1", [tenantId]),
            pool.query("SELECT COUNT(*) FROM audit_logs WHERE tenantid = $1", [tenantId]),
            pool.query("SELECT COUNT(*) FROM policies WHERE ruletype = 'DENY' AND tenantid = $1", [tenantId]),
            pool.query("SELECT MIN(timestamp) AS oldest FROM audit_logs WHERE tenantid = $1", [tenantId]),
        ]);

        const approvalPolicies = parseInt(approvalResult.rows[0].count, 10);
        const auditCount = parseInt(auditResult.rows[0].count, 10);
        const denyPolicies = parseInt(denyResult.rows[0].count, 10);
        const oldestDate: Date | null = oldestResult.rows[0].oldest;

        // Record keeping: need logs AND oldest log ≥ 30 days ago
        let recordStatus: "pass" | "partial" | "fail" = "fail";
        let recordDetail = "No audit logs found";
        if (auditCount > 0 && oldestDate) {
            const daysDiff = Math.floor((Date.now() - oldestDate.getTime()) / 86_400_000);
            recordStatus = daysDiff >= 30 ? "pass" : "partial";
            recordDetail = `Logs retained since ${oldestDate.toISOString().split("T")[0]}`;
        }

        const checks = {
            humanOversight: {
                status: (approvalPolicies > 0 ? "pass" : "fail") as "pass" | "partial" | "fail",
                detail: approvalPolicies > 0
                    ? `${approvalPolicies} REQUIRE_APPROVAL ${approvalPolicies === 1 ? "policy" : "policies"} active`
                    : "No REQUIRE_APPROVAL policies configured",
            },
            auditLogging: {
                status: (auditCount > 0 ? "pass" : "fail") as "pass" | "partial" | "fail",
                detail: auditCount > 0
                    ? `${auditCount.toLocaleString()} events logged`
                    : "No audit events recorded",
            },
            riskControls: {
                status: (denyPolicies > 0 ? "pass" : "fail") as "pass" | "partial" | "fail",
                detail: denyPolicies > 0
                    ? `${denyPolicies} DENY ${denyPolicies === 1 ? "policy" : "policies"} active`
                    : "No DENY policies configured",
            },
            recordKeeping: {
                status: recordStatus,
                detail: recordDetail,
            },
            dataGovernance: {
                status: "pass" as "pass",
                detail: "Self-hosted deployment",
            },
            incidentLogging: {
                status: "partial" as "partial",
                detail: "DENY events logged. Dedicated incident workflow coming soon.",
            },
        };

        const criticalFailed = (["humanOversight", "auditLogging", "riskControls"] as const).some(
            (k) => checks[k].status === "fail"
        );
        const anyNonPass = Object.values(checks).some((c) => c.status !== "pass");

        const overall = criticalFailed
            ? "NOT_CONFIGURED"
            : anyNonPass
            ? "ATTENTION_NEEDED"
            : "COMPLIANT";

        res.json({ overall, checks, lastChecked: new Date().toISOString() });
    } catch (e) {
        logger.error("[Compliance] Status error:", { error: e });
        res.status(500).json({ 
            error: "Internal Server Error", 
            message: e instanceof Error ? e.message : String(e) 
        });
    }
});

// ─── GET /v1/compliance/report ────────────────────────────────────────────────

router.get("/report", adminAuth, resolveTier, async (req: Request, res: Response) => {
    try {
        const authenticatedTenantId = (req as AuthenticatedRequest).tenantId;
        const { agentId, tenantId: queryTenantId } = req.query;
        
        // Security: Ensure query tenantId matches authenticated tenantId
        const tenantId = queryTenantId || authenticatedTenantId;
        if (queryTenantId && queryTenantId !== authenticatedTenantId) {
            return res.status(403).json({ error: "Forbidden: Cannot access compliance report of another tenant" });
        }

        if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

        const tieredReq = req as TieredRequest;
        const tierLimits = tieredReq.tierLimits!;

        // --- Tier Enforcement: PDF Reports are paid-only ---
        if (!tierLimits.pdfReports) {
            return res.status(403).json({
                error: "PDF compliance reports require a paid plan.",
                detail: "Your Developer tier includes JSON compliance status via /v1/compliance/status. Upgrade to Starter ($49/mo) or higher for regulator-ready PDF evidence reports.",
                upgradeUrl: "https://www.supra-wall.com/pricing",
                code: "TIER_LIMIT_EXCEEDED",
                currentTier: tieredReq.tier,
            });
        }

        const to = req.query.to ? new Date(req.query.to as string) : new Date();
        const from = req.query.from
            ? new Date(req.query.from as string)
            : new Date(Date.now() - 30 * 86_400_000);

        // Fetch audit logs scoped to tenant
        const auditParams: (Date | string)[] = [from, to, tenantId as string];
        let auditSql = "SELECT * FROM audit_logs WHERE timestamp >= $1 AND timestamp <= $2 AND tenantid = $3";
        if (agentId) {
            auditSql += " AND agentid = $4";
            auditParams.push(agentId as string);
        }
        auditSql += " ORDER BY timestamp DESC";

        // Fetch policies scoped to tenant
        const policyParams: string[] = [tenantId as string];
        let policySql = "SELECT * FROM policies WHERE tenantid = $1";
        if (agentId) {
            policySql += " AND agentid = $2";
            policyParams.push(agentId as string);
        }
        policySql += " ORDER BY createdat ASC";

        const [auditResult, policyResult] = await Promise.all([
            pool.query(auditSql, auditParams),
            pool.query(policySql, policyParams),
        ]);

        const logs = auditResult.rows;
        
        // Prepare template data
        const reportId = randomUUID().substring(0, 8).toUpperCase();
        const dateStr = new Date().toISOString().split("T")[0];
        
        const reportData: ComplianceReportData = {
            issueDate: new Date().toLocaleDateString(),
            tenantId: tenantId as string,
            reportId: `SW-COMP-${reportId}`,
            totalEvaluations: logs.length,
            threatsBlocked: logs.filter(l => l.decision === "DENY").length,
            complianceScore: 100, // Placeholder calculation
            signature: "", // Will be generated in pdf-generator
            events: logs.map(l => ({
                timestamp: new Date(l.timestamp).toLocaleString(),
                agentName: l.agentid.substring(0, 8), // Simplify or lookup name if available
                toolName: l.toolname,
                riskScore: l.riskscore || 0,
                decision: l.decision
            }))
        };

        const templateName = req.query.template as string || "eu-ai-act-article-9";
        const pdf = await generateCompliancePDF(templateName, reportData);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="suprawall-compliance-${templateName}-${dateStr}.pdf"`
        );
        res.send(pdf);
    } catch (e) {
        logger.error("[Compliance] Report error:", { error: e });
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
});

export default router;
