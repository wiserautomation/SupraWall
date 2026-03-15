import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();
        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        const adminDb = getAdminDb();

        // 1. Fetch org data from Firestore
        const orgSnap = await adminDb.collection("organizations").doc(userId).get();
        const org = orgSnap.data();

        // 2. Fetch agents
        const agentsSnap = await adminDb
            .collection("agents")
            .where("userId", "==", userId)
            .get();

        // 3. Fetch recent audit logs
        const auditSnap = await adminDb
            .collection("auditLogs")
            .where("agentId", "in",
                agentsSnap.empty
                    ? ["__none__"]
                    : agentsSnap.docs.slice(0, 30).map(d => d.id)
            )
            .orderBy("timestamp", "desc")
            .limit(500)
            .get();

        // 4. Compute compliance metrics
        const totalEvents = auditSnap.size;
        const deniedEvents = auditSnap.docs.filter(d => d.data().decision === "DENY").length;
        const approvalEvents = auditSnap.docs.filter(d => d.data().decision === "REQUIRE_APPROVAL").length;

        const agents = agentsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Record<string, unknown>[];

        const hasArticle9 = agents.some((a: Record<string, unknown>) =>
            (a.policies as Record<string, unknown>[] | undefined)?.some(
                (p: Record<string, unknown>) => p.action === "DENY" || p.riskManagement
            )
        );
        const hasArticle12 = totalEvents > 0;
        const hasArticle14 = agents.some((a: Record<string, unknown>) =>
            (a.policies as Record<string, unknown>[] | undefined)?.some(
                (p: Record<string, unknown>) => p.action === "REQUIRE_APPROVAL"
            )
        ) || approvalEvents > 0;

        const articlesCompliant: string[] = [];
        if (hasArticle9) articlesCompliant.push("Article 9");
        if (hasArticle12) articlesCompliant.push("Article 12");
        if (hasArticle14) articlesCompliant.push("Article 14");

        const score = Math.round(
            (Number(hasArticle9) + Number(hasArticle12) + Number(hasArticle14)) / 3 * 100
        );

        // 5. Generate certificate ID
        const certId = `SW-CERT-${Date.now().toString(36).toUpperCase()}`;

        const certificateData = {
            certId,
            orgName: (org?.name as string) || "Your Organization",
            issueDate: new Date().toISOString().split("T")[0],
            complianceScore: score,
            articlesCompliant,
            totalAuditEvents: totalEvents,
            deniedEvents,
            approvalEvents,
            agentCount: agentsSnap.size,
            verificationUrl: `https://suprawall.ai/share/compliance/${userId}`,
            certificateUrl: `https://suprawall.ai/certificate/${certId}`,
            userId,
        };

        // 6. Store certificate metadata in Firestore
        await adminDb.collection("certificates").doc(certId).set({
            ...certificateData,
            createdAt: new Date(),
        });

        return NextResponse.json({ certificate: certificateData });
    } catch (error) {
        console.error("Certificate generation failed:", error);
        return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 });
    }
}
