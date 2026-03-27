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

        // Fetch agent IDs owned by this tenant
        const agentsSnap = await db.collection("agents").where("userId", "==", tenantId).get();
        const agentIds = agentsSnap.docs.map((d) => d.id);

        // Run compliance checks against Firestore
        const [policiesSnap, auditSnap] = await Promise.all([
            db.collection("policies").where("tenantId", "==", tenantId).get(),
            agentIds.length > 0
                ? db.collection("audit_logs").where("agentId", "in", agentIds.slice(0, 10)).orderBy("timestamp", "asc").limit(1).get()
                : Promise.resolve({ docs: [] as any[] }),
        ]);

        const policies = policiesSnap.docs.map((d) => d.data());
        const approvalPolicies = policies.filter((p) => p.ruleType === "REQUIRE_APPROVAL").length;
        const denyPolicies = policies.filter((p) => p.ruleType === "DENY").length;

        // Count audit logs across all agents
        let auditCount = 0;
        let oldestDate: Date | null = null;
        if (agentIds.length > 0) {
            const countSnaps = await Promise.all(
                agentIds.slice(0, 10).map((id) =>
                    db.collection("audit_logs").where("agentId", "==", id).get()
                )
            );
            for (const snap of countSnaps) {
                auditCount += snap.size;
                for (const doc of snap.docs) {
                    const ts = doc.data().timestamp?.toDate?.();
                    if (ts && (!oldestDate || ts < oldestDate)) oldestDate = ts;
                }
            }
        }

        // Record keeping check
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
        const overall = criticalFailed ? "NOT_CONFIGURED" : anyNonPass ? "ATTENTION_NEEDED" : "COMPLIANT";

        return NextResponse.json({ overall, checks, lastChecked: new Date().toISOString() });
    } catch (err: any) {
        console.error("[API Compliance Status] Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
