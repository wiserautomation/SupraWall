// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Router, Request, Response } from "express";
import { pool } from "../db";
import { enforceSeatLimit, inviteMember } from "../seats";
import { logger } from "../logger";

const router = Router();

// GET /v1/members — List organization members
router.get("/", async (req: Request, res: Response) => {
    try {
        const { tenantId } = req.query;
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

// POST /v1/members/invite — Invite a new member
router.post("/invite", enforceSeatLimit, async (req: Request, res: Response) => {
    try {
        const { tenantId, email, role } = req.body;
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

// DELETE /v1/members/:id — Remove a member
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { tenantId } = req.query;
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

// PATCH /v1/members/:id/role — Update member role
router.patch("/:id/role", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { tenantId, role } = req.body;
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
