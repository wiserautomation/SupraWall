import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDb, pool } from "./db";
import { evaluatePolicy, scrubToolResponse } from "./policy";
import complianceRouter from "./routes/compliance";
import vaultRouter from "./routes/vault";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Healthcheck with DB status
app.get("/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.status(200).json({ status: "ok", database: "connected" });
    } catch (err) {
        res.status(503).json({ status: "degraded", database: "disconnected" });
    }
});

// Policy Evaluation Webhook
app.post("/v1/evaluate", evaluatePolicy);

// Vault scrub endpoint
app.post("/v1/scrub", scrubToolResponse);

// Compliance Routes
app.use("/v1/compliance", complianceRouter);

// Vault Routes
app.use("/v1/vault", vaultRouter);

// Export the app for Vercel
export default app;

// Only start the server listener if not on Vercel
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    const startServer = async () => {
        try {
            await initDb();
            console.log("Database initialized");
            app.listen(port, () => {
                console.log(`SUPRA-WALL Server running on port ${port}`);
            });
        } catch (e) {
            console.error("Failed to start server", e);
            process.exit(1);
        }
    };
    startServer();
} else {
    // On Vercel, we still need to ensure DB is initialized
    // We can do this at the top level or per-request. 
    // Top-level await is supported in modern Node on Vercel.
    initDb().catch(err => console.error("Database initialization failed", err));
}
