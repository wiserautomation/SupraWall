import express, { Request, Response } from "express";
import { pool } from "../db";

const router = express.Router();

// GET all agents for a tenant
router.get("/", async (req: Request, res: Response) => {
    try {
        const { tenantId } = req.query;
        if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

        const result = await pool.query(
            "SELECT * FROM agents WHERE tenantid = $1 ORDER BY createdat DESC",
            [tenantId]
        );
        res.json(result.rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET single agent
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM agents WHERE id = $1", [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Agent not found" });
        res.json(result.rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PATCH agent config
router.patch("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { 
            name, 
            slack_webhook, 
            max_cost_usd, 
            budget_alert_usd, 
            max_iterations, 
            loop_detection 
        } = req.body;

        const result = await pool.query(
            `UPDATE agents 
             SET name = COALESCE($1, name),
                 slack_webhook = COALESCE($2, slack_webhook),
                 max_cost_usd = $3,
                 budget_alert_usd = $4,
                 max_iterations = $5,
                 loop_detection = COALESCE($6, loop_detection)
             WHERE id = $7
             RETURNING *`,
            [name, slack_webhook, max_cost_usd, budget_alert_usd, max_iterations, loop_detection, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: "Agent not found" });
        res.json(result.rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
