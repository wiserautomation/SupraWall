import express, { Request, Response } from "express";
import { pool } from "../db";

const router = express.Router();

// GET audit logs for a tenant
router.get("/", async (req: Request, res: Response) => {
    try {
        const { tenantId, limit = 50, offset = 0 } = req.query;
        if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

        const result = await pool.query(
            "SELECT * FROM audit_logs WHERE tenantid = $1 ORDER BY timestamp DESC LIMIT $2 OFFSET $3",
            [tenantId, limit, offset]
        );
        res.json(result.rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
