// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import express, { Request, Response } from "express";
import { adminAuth, AuthenticatedRequest } from "../auth";
import { processGDPRErasure } from "../gdpr";
import { logger } from "../logger";

const router = express.Router();

// DELETE /gdpr/erasure
// This implements GDPR Article 17 (Right to Erasure) via Cryptographic Shredding
router.delete("/erasure", adminAuth, async (req: Request, res: Response) => {
    try {
        const authenticatedTenantId = (req as AuthenticatedRequest).tenantId;
        const { tenantId: queryTenantId, subjectId, verificationToken } = req.body;
        
        // Security: Ensure query tenantId matches authenticated tenantId
        const tenantId = queryTenantId || authenticatedTenantId;
        if (queryTenantId && queryTenantId !== authenticatedTenantId) {
            return res.status(403).json({ error: "Forbidden: Cannot execute erasure for another tenant" });
        }

        if (!tenantId) {
            return res.status(400).json({ error: "Missing tenantId" });
        }

        const sid = subjectId || "entire_tenant";

        // In a real system, verify verificationToken here.
        // For now, we trust the adminAuth context.

        const receipt = await processGDPRErasure(
            tenantId, 
            sid, 
            (req as AuthenticatedRequest).agent?.id || "admin_dashboard"
        );

        logger.info("[GDPR] Processed Erasure Request", { tenantId, subjectId: sid, erasureId: receipt.erasureId });

        res.json({
            success: true,
            receipt,
        });
    } catch (e) {
        logger.error("[GDPR] Erasure Error", { error: e });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
