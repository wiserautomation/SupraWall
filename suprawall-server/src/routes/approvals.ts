import { Router } from "express";
import { pool } from "../db";

const router = Router();

// GET /v1/approvals/status/:id - Poll for decision (SDK use case)
router.get("/status/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "SELECT status, decision_at, decision_comment FROM approval_requests WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Approval request not found" });
        }

        res.json(result.rows[0]);
    } catch (e) {
        console.error("Status check error:", e);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /v1/approvals/respond - Decision from Dashboard
router.post("/respond", async (req, res) => {
    try {
        const { id, decision, comment, userId } = req.body; // decision: approved | denied

        if (!['approved', 'denied'].includes(decision)) {
            return res.status(400).json({ error: "Invalid decision" });
        }

        const result = await pool.query(
            "UPDATE approval_requests SET status = $1, decision_at = NOW(), decision_comment = $2, decision_by = $3 WHERE id = $4 RETURNING *",
            [decision, comment, userId, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Approval request not found" });
        }

        res.json({ success: true, request: result.rows[0] });
    } catch (e) {
        console.error("Respond error:", e);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /v1/approvals/pending/:tenantId - List pending for dashboard
router.get("/pending/:tenantId", async (req, res) => {
    try {
        const { tenantId } = req.params;
        const result = await pool.query(
            "SELECT * FROM approval_requests WHERE tenantid = $1 AND status = 'pending' ORDER BY createdat DESC",
            [tenantId]
        );
        res.json(result.rows);
    } catch (e) {
        console.error("Fetch pending error:", e);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
