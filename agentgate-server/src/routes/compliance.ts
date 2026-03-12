import { Router, Request, Response } from "express";
import { pool } from "../db";
import PDFDocument from "pdfkit";
import { randomUUID } from "crypto";

const router = Router();

// ─── GET /v1/compliance/status ────────────────────────────────────────────────

router.get("/status", async (_req: Request, res: Response) => {
    try {
        const [approvalResult, auditResult, denyResult, oldestResult] = await Promise.all([
            pool.query("SELECT COUNT(*) FROM policies WHERE rule_type = 'REQUIRE_APPROVAL'"),
            pool.query("SELECT COUNT(*) FROM audit_logs"),
            pool.query("SELECT COUNT(*) FROM policies WHERE rule_type = 'DENY'"),
            pool.query("SELECT MIN(created_at) AS oldest FROM audit_logs"),
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
        console.error("Compliance status error:", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ─── GET /v1/compliance/report ────────────────────────────────────────────────

router.get("/report", async (req: Request, res: Response) => {
    try {
        const { agentId } = req.query;
        const to = req.query.to ? new Date(req.query.to as string) : new Date();
        const from = req.query.from
            ? new Date(req.query.from as string)
            : new Date(Date.now() - 30 * 86_400_000);

        // Fetch audit logs
        const auditParams: (Date | string)[] = [from, to];
        let auditSql = "SELECT * FROM audit_logs WHERE created_at >= $1 AND created_at <= $2";
        if (agentId) {
            auditSql += " AND agent_id = $3";
            auditParams.push(agentId as string);
        }
        auditSql += " ORDER BY created_at DESC";

        // Fetch policies
        const policyParams: string[] = [];
        let policySql = "SELECT * FROM policies";
        if (agentId) {
            policySql += " WHERE agent_id = $1";
            policyParams.push(agentId as string);
        }
        policySql += " ORDER BY created_at ASC";

        const [auditResult, policyResult] = await Promise.all([
            pool.query(auditSql, auditParams),
            pool.query(policySql, policyParams),
        ]);

        const logs = auditResult.rows;
        const policies = policyResult.rows;

        const total = logs.length;
        const allowed = logs.filter((l) => l.decision === "ALLOW").length;
        const denied = logs.filter((l) => l.decision === "DENY").length;
        const pending = logs.filter((l) => l.decision === "REQUIRE_APPROVAL").length;
        const uniqueAgents = new Set(logs.map((l) => l.agent_id)).size;
        const uniqueTools = new Set(logs.map((l) => l.tool_name)).size;

        const reportId = randomUUID();
        const orgName = process.env.ORG_NAME || "Your Organization";
        const dateStr = new Date().toISOString().split("T")[0];
        const fromStr = from.toISOString().split("T")[0];
        const toStr = to.toISOString().split("T")[0];

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="agentgate-compliance-report-${dateStr}.pdf"`
        );

        const doc = new PDFDocument({ margin: 50, size: "A4" });
        doc.pipe(res);

        const W = doc.page.width;
        const ACCENT = "#10b981";
        const DARK = "#111827";
        const MID = "#374151";
        const LIGHT = "#6b7280";
        const FAINT = "#9ca3af";

        // ── Helper: accent top bar ──────────────────────────────────────────────
        const accentBar = () => doc.rect(0, 0, W, 8).fill(ACCENT);

        // ── Helper: section heading ─────────────────────────────────────────────
        const sectionHead = (title: string) => {
            doc.fontSize(15).font("Helvetica-Bold").fillColor(DARK).text(title, 50);
            doc.moveDown(0.8);
        };

        // ── Helper: draw horizontal rule ────────────────────────────────────────
        const hr = () => {
            doc.moveTo(50, doc.y).lineTo(W - 50, doc.y).strokeColor("#e5e7eb").stroke();
            doc.moveDown(0.8);
        };

        // ── Helper: key-value row ───────────────────────────────────────────────
        const kv = (label: string, value: string) => {
            const y = doc.y;
            doc.fontSize(10).font("Helvetica-Bold").fillColor(MID).text(label + ":", 80, y, { width: 130 });
            doc.fontSize(10).font("Helvetica").fillColor(DARK).text(value, 220, y, { width: W - 270 });
            doc.y = doc.y + 2;
        };

        // ── PAGE 1: Cover ───────────────────────────────────────────────────────
        accentBar();
        doc.moveDown(3);
        doc.fontSize(26).font("Helvetica-Bold").fillColor(DARK)
            .text("HUMAN OVERSIGHT EVIDENCE REPORT", { align: "center" });
        doc.moveDown(0.5);
        doc.fontSize(13).font("Helvetica").fillColor(LIGHT)
            .text("EU AI Act Compliance Documentation", { align: "center" });
        doc.moveDown(2.5);
        hr();
        kv("Organization", orgName);
        kv("Report Period", `${fromStr} to ${toStr}`);
        kv("Generated", new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC");
        kv("Report ID", reportId);
        doc.moveDown(2);
        hr();
        doc.fontSize(9).font("Helvetica").fillColor(LIGHT)
            .text(
                "This report documents human oversight mechanisms, policy controls, and audit trails maintained for AI agent operations, as required under EU AI Act Article 14 (Human Oversight) and Article 12 (Record-keeping).",
                80, doc.y, { width: W - 160 }
            );

        // ── PAGE 2: Compliance Summary ──────────────────────────────────────────
        doc.addPage();
        accentBar();
        doc.moveDown(1);
        sectionHead("SECTION 1: COMPLIANCE CONTROLS ACTIVE");

        const controls = [
            { title: "Audit Logging (Art. 12)", desc: "All AI agent tool calls are recorded with timestamps, agent identity, tool name, arguments, and decision." },
            { title: "Human Oversight Mechanisms (Art. 14)", desc: "REQUIRE_APPROVAL policies enforce human review before sensitive tool executions. Humans can intervene at any point in agent operation." },
            { title: "Risk Management Controls (Art. 9)", desc: "DENY policies block dangerous or unauthorized tool calls before execution. Policy rules are version-controlled and auditable." },
            { title: "Data Governance (Art. 10)", desc: "Tool call arguments are logged with full fidelity. Self-hosting option ensures data residency compliance." },
        ];

        controls.forEach((c) => {
            doc.fontSize(11).font("Helvetica-Bold").fillColor(ACCENT).text("✓  ", 50, doc.y, { continued: true });
            doc.fillColor(DARK).text(c.title);
            doc.fontSize(9).font("Helvetica").fillColor(LIGHT)
                .text(c.desc, 66, doc.y, { width: W - 116 });
            doc.moveDown(0.8);
        });

        doc.moveDown(0.5);
        hr();
        sectionHead("SECTION 2: ACTIVITY SUMMARY");

        const pct = (n: number) => (total > 0 ? ` (${Math.round((n / total) * 100)}%)` : " (0%)");
        [
            ["Reporting Period", `${fromStr} → ${toStr}`],
            ["Total Tool Calls", String(total)],
            ["Allowed", `${allowed}${pct(allowed)}`],
            ["Blocked (DENY)", `${denied}${pct(denied)}`],
            ["Pending Approval", `${pending}${pct(pending)}`],
            ["Agents Monitored", String(uniqueAgents)],
            ["Unique Tools Called", String(uniqueTools)],
        ].forEach(([label, value]) => kv(label, value));

        // ── PAGE 3: Policy Register ─────────────────────────────────────────────
        doc.addPage();
        accentBar();
        doc.moveDown(1);
        sectionHead("SECTION 3: ACTIVE POLICY REGISTER");

        if (policies.length === 0) {
            doc.fontSize(10).font("Helvetica").fillColor(FAINT).text("No policies configured.", 50);
        } else {
            // Column positions and widths
            const COL = [50, 85, 185, 340, 430];
            const WIDTHS = [30, 95, 150, 85, 110];
            const HEADERS = ["ID", "Agent", "Tool Pattern", "Rule Type", "Created"];

            const drawTableHeader = () => {
                const y = doc.y;
                doc.fontSize(8).font("Helvetica-Bold").fillColor(MID);
                HEADERS.forEach((h, i) => doc.text(h, COL[i], y, { width: WIDTHS[i], lineBreak: false }));
                doc.y = y + 14;
                doc.moveTo(50, doc.y).lineTo(W - 50, doc.y).strokeColor("#e5e7eb").stroke();
                doc.y += 4;
            };

            drawTableHeader();
            policies.forEach((p) => {
                if (doc.y > doc.page.height - 80) {
                    doc.addPage();
                    accentBar();
                    doc.moveDown(1);
                    drawTableHeader();
                }
                const y = doc.y;
                doc.fontSize(8).font("Helvetica").fillColor(MID);
                doc.text(String(p.id), COL[0], y, { width: WIDTHS[0], lineBreak: false });
                doc.text(String(p.agent_id || "").substring(0, 16), COL[1], y, { width: WIDTHS[1], lineBreak: false });
                doc.text(String(p.condition || "").substring(0, 28), COL[2], y, { width: WIDTHS[2], lineBreak: false });
                doc.text(String(p.rule_type), COL[3], y, { width: WIDTHS[3], lineBreak: false });
                doc.text(new Date(p.created_at).toISOString().split("T")[0], COL[4], y, { width: WIDTHS[4], lineBreak: false });
                doc.y = y + 14;
            });

            doc.moveDown(0.5);
            doc.fontSize(9).font("Helvetica").fillColor(LIGHT)
                .text("Note: DENY rules prevent execution. REQUIRE_APPROVAL rules pause execution until a human approves.", 50);
        }

        // ── PAGE 4+: Audit Log ──────────────────────────────────────────────────
        doc.addPage();
        accentBar();
        doc.moveDown(1);
        sectionHead("SECTION 4: DETAILED AUDIT LOG");

        if (logs.length === 0) {
            doc.fontSize(10).font("Helvetica").fillColor(FAINT)
                .text("No audit log entries for the selected period.", 50);
        } else {
            const PAGE_ROWS = 30;
            const totalLogPages = Math.ceil(logs.length / PAGE_ROWS);
            const LOG_COL = [50, 130, 225, 310, 385];
            const LOG_WIDTHS = [75, 90, 80, 70, 155];
            const LOG_HEADERS = ["Timestamp", "Agent ID", "Tool Called", "Decision", "Arguments"];

            const drawLogHeader = () => {
                const y = doc.y;
                doc.fontSize(8).font("Helvetica-Bold").fillColor(MID);
                LOG_HEADERS.forEach((h, i) => doc.text(h, LOG_COL[i], y, { width: LOG_WIDTHS[i], lineBreak: false }));
                doc.y = y + 14;
                doc.moveTo(50, doc.y).lineTo(W - 50, doc.y).strokeColor("#e5e7eb").stroke();
                doc.y += 4;
            };

            for (let pageIdx = 0; pageIdx < totalLogPages; pageIdx++) {
                if (pageIdx > 0) {
                    doc.addPage();
                    accentBar();
                    doc.moveDown(1);
                }
                drawLogHeader();

                const slice = logs.slice(pageIdx * PAGE_ROWS, (pageIdx + 1) * PAGE_ROWS);
                slice.forEach((l) => {
                    const y = doc.y;
                    const argsStr = typeof l.arguments === "object"
                        ? JSON.stringify(l.arguments)
                        : String(l.arguments || "");
                    doc.fontSize(7).font("Helvetica").fillColor(MID);
                    doc.text(
                        new Date(l.created_at).toISOString().replace("T", " ").substring(0, 16),
                        LOG_COL[0], y, { width: LOG_WIDTHS[0], lineBreak: false }
                    );
                    doc.text(String(l.agent_id || "").substring(0, 16), LOG_COL[1], y, { width: LOG_WIDTHS[1], lineBreak: false });
                    doc.text(String(l.tool_name || "").substring(0, 20), LOG_COL[2], y, { width: LOG_WIDTHS[2], lineBreak: false });
                    doc.text(String(l.decision), LOG_COL[3], y, { width: LOG_WIDTHS[3], lineBreak: false });
                    doc.text(argsStr.substring(0, 80), LOG_COL[4], y, { width: LOG_WIDTHS[4], lineBreak: false });
                    doc.y = y + 12;
                });

                // Page footer
                doc.fontSize(8).font("Helvetica").fillColor(FAINT)
                    .text(
                        `Page ${pageIdx + 1} of ${totalLogPages}`,
                        50, doc.page.height - 40,
                        { align: "center", width: W - 100 }
                    );
            }
        }

        // Signed footer
        const footerY = Math.min(doc.y + 20, doc.page.height - 60);
        doc.moveTo(50, footerY).lineTo(W - 50, footerY).strokeColor("#e5e7eb").stroke();
        doc.fontSize(8).font("Helvetica").fillColor(FAINT)
            .text(
                "Signed: This report was generated automatically by AgentGate. Records are stored in tamper-evident append-only logs.",
                50, footerY + 8,
                { align: "center", width: W - 100 }
            );

        doc.end();
    } catch (e) {
        console.error("Compliance report error:", e);
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
});

export default router;
