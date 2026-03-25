// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import express, { Request, Response } from "express";
import { pool } from "../db";

const router = express.Router();

// GET tenant settings
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM tenants WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            // Auto-create tenant on first access if needed, or return empty
            return res.json({});
        }
        res.json(result.rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// UPDATE tenant settings
router.post("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const fields = req.body;
        
        // Dynamic update query
        const sets = Object.keys(fields).map((key, i) => `${key} = $${i + 2}`);
        const values = Object.values(fields);
        
        if (sets.length === 0) return res.status(400).json({ error: "No fields to update" });

        await pool.query(
            `INSERT INTO tenants (id, ${Object.keys(fields).join(", ")}) 
             VALUES ($1, ${Object.values(fields).map((_, i) => `$${i + 2}`).join(", ")})
             ON CONFLICT (id) DO UPDATE SET ${sets.join(", ")}, updated_at = CURRENT_TIMESTAMP`,
            [id, ...values]
        );
        
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
