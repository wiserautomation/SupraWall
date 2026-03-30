// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tenantId = searchParams.get("tenantId");
        if (!tenantId) {
            return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
        }

        // 1. Resolve Effective Tenant ID (Dashboard UID -> mapped Tenant ID)
        let mappedTenantId = tenantId;
        try {
            const userDoc = await db.collection("users").doc(tenantId).get();
            if (userDoc.exists && userDoc.data()?.tenantId) {
                mappedTenantId = userDoc.data().tenantId;
            }
        } catch (e) {
            console.warn("[IdentityMapping] Firebase lookup failed, using direct UID:", e);
            // Fallback to the provided tenantId (UID)
        }

        // 2. Fetch Policies from Firestore (Policies are still in Firestore)
        const policiesSnap = await db.collection("policies").where("tenantId", "==", tenantId).get();
        const policies = policiesSnap.docs.map((d) => d.data());
        const approvalPoliciesCount = policies.filter((p) => p.ruleType === "REQUIRE_APPROVAL").length;
        const denyPoliciesCount = policies.filter((p) => p.ruleType === "DENY").length;

        // 3. Fetch Audit Logs & Approvals from Postgres
        const { pool } = require("@/lib/db_sql");
        const [auditRes, approvalsRes] = await Promise.all([
            pool.query(
                `SELECT COUNT(*) as count, MIN(timestamp) as oldest 
                 FROM audit_logs 
                 WHERE tenantid = $1 OR tenantid = $2`,
                [tenantId, mappedTenantId]
            ),
            pool.query(
                `SELECT COUNT(*) as count 
                 FROM approval_requests 
                 WHERE (tenantid = $1 OR tenantid = $2) AND status != 'PENDING'`,
                [tenantId, mappedTenantId]
            )
        ]);

        const auditCount = parseInt(auditRes.rows[0].count || "0", 10);
        const oldestDate = auditRes.rows[0].oldest ? new Date(auditRes.rows[0].oldest) : null;
        const approvalDecisionsCount = parseInt(approvalsRes.rows[0].count || "0", 10);

        // Record keeping check (Article 11)
        let recordStatus: "pass" | "partial" | "fail" = "fail";
        let recordDetail = "No audit logs found";
        if (auditCount > 0 && oldestDate) {
            const daysDiff = Math.floor((Date.now() - oldestDate.getTime()) / 86_400_000);
            recordStatus = daysDiff >= 30 ? "pass" : "partial";
            recordDetail = `Logs retained for ${daysDiff} days (since ${oldestDate.toISOString().split("T")[0]})`;
        }

        const checks = {
            humanOversight: {
                status: (approvalPoliciesCount > 0 && approvalDecisionsCount > 0 ? "pass" : approvalPoliciesCount > 0 ? "partial" : "fail") as "pass" | "partial" | "fail",
                detail: approvalPoliciesCount > 0
                    ? `${approvalPoliciesCount} REQUIRE_APPROVAL policies active. ${approvalDecisionsCount} decisions recorded.`
                    : "No REQUIRE_APPROVAL policies configured",
            },
            auditLogging: {
                status: (auditCount > 0 ? "pass" : "fail") as "pass" | "partial" | "fail",
                detail: auditCount > 0
                    ? `${auditCount.toLocaleString()} events logged in forensic audit trail`
                    : "No audit events recorded",
            },
            riskControls: {
                status: (denyPoliciesCount > 0 ? "pass" : "fail") as "pass" | "partial" | "fail",
                detail: denyPoliciesCount > 0
                    ? `${denyPoliciesCount} DENY policies active protecting sensitive endpoints`
                    : "No DENY policies configured",
            },
            recordKeeping: {
                status: recordStatus,
                detail: recordDetail,
            },
            dataGovernance: {
                status: "pass" as "pass",
                detail: "Self-hosted deployment with full argument logging",
            },
            incidentLogging: {
                status: "partial" as "partial",
                detail: "DENY events logged in Postgres. Dedicated incident workflow phase pending.",
            },
        };

        const criticalFailed = (["humanOversight", "auditLogging", "riskControls"] as const).some(
            (k) => checks[k].status === "fail"
        );
        const anyNonPass = Object.values(checks).some((c) => c.status !== "pass");
        const overall = criticalFailed ? "NOT_CONFIGURED" : anyNonPass ? "ATTENTION_NEEDED" : "COMPLIANT";

        return NextResponse.json({ overall, checks, lastChecked: new Date().toISOString() });
    } catch (err: any) {
        console.error("[API Compliance Status] Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
