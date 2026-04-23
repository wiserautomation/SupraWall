// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Router, Request, Response } from "express";
import { pool } from "../db";
import { enforceSeatLimit, inviteMember } from "../seats";
import { logger } from "../logger";

import { adminAuth, requireMemberRole, AuthenticatedRequest } from "../auth";

const router = Router();

// GET /v1/members — List organization members (Admin Protected)
router.get("/", adminAuth, async (req: Request, res: Response) => {
    try {
        const authenticatedTenantId = (req as AuthenticatedRequest).tenantId;
        const { tenantId: queryTenantId } = req.query;
        
        const tenantId = queryTenantId || authenticatedTenantId;
        if (queryTenantId && queryTenantId !== authenticatedTenantId) {
            return res.status(403).json({ error: "Forbidden: Cannot access members of another organization" });
        }

        if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

        const result = await pool.query(
            `SELECT id, user_email, role, status, invited_at, accepted_at
             FROM organization_members WHERE tenant_id = $1 ORDER BY invited_at DESC`,
            [tenantId]
        );
        res.json(result.rows);
    } catch (e) {
        logger.error("[Members] Failed to list members:", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /v1/members/invite — Invite a new member (Admin Protected, requires 'admin' role)
router.post("/invite", adminAuth, requireMemberRole("admin"), enforceSeatLimit, async (req: Request, res: Response) => {
    try {
        const authenticatedTenantId = (req as AuthenticatedRequest).tenantId;
        const { tenantId: bodyTenantId, email, role } = req.body;
        
        const tenantId = bodyTenantId || authenticatedTenantId;
        if (bodyTenantId && bodyTenantId !== authenticatedTenantId) {
            return res.status(403).json({ error: "Forbidden: Cannot invite members to another organization" });
        }

        if (!tenantId || !email) return res.status(400).json({ error: "Missing tenantId or email" });

        await inviteMember(tenantId as string, email as string, (role as string) || "member");
        res.status(201).json({ success: true, message: `Invite sent to ${email}` });
    } catch (e: any) {
        if (e.message.includes("Seat limit reached")) {
            return res.status(402).json({ error: "Seat limit reached", message: e.message });
        }
        logger.error("[Members] Failed to invite member:", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE /v1/members/:id — Remove a member (Admin Protected, requires 'admin' role)
router.delete("/:id", adminAuth, requireMemberRole("admin"), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const authenticatedTenantId = (req as AuthenticatedRequest).tenantId;
        const { tenantId: queryTenantId } = req.query;
        
        const tenantId = queryTenantId || authenticatedTenantId;
        if (queryTenantId && queryTenantId !== authenticatedTenantId) {
            return res.status(403).json({ error: "Forbidden: Cannot remove members from another organization" });
        }

        if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

        const result = await pool.query(
            "UPDATE organization_members SET status = 'removed' WHERE id = $1 AND tenant_id = $2 RETURNING id",
            [id, tenantId]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: "Member not found" });
        res.json({ success: true, message: "Member removed" });
    } catch (e) {
        logger.error("[Members] Failed to remove member:", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PATCH /v1/members/:id/role — Update member role (Admin Protected, requires 'admin' role)
router.patch("/:id/role", adminAuth, requireMemberRole("admin"), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const authenticatedTenantId = (req as AuthenticatedRequest).tenantId;
        const { tenantId: bodyTenantId, role } = req.body;
        
        const tenantId = bodyTenantId || authenticatedTenantId;
        if (bodyTenantId && bodyTenantId !== authenticatedTenantId) {
            return res.status(403).json({ error: "Forbidden: Cannot update roles in another organization" });
        }

        if (!tenantId || !role) return res.status(400).json({ error: "Missing tenantId or role" });

        const result = await pool.query(
            "UPDATE organization_members SET role = $1 WHERE id = $2 AND tenant_id = $3 RETURNING id",
            [role, id, tenantId]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: "Member not found" });
        res.json({ success: true, message: `Role updated to ${role}` });
    } catch (e) {
        logger.error("[Members] Failed to update role:", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
