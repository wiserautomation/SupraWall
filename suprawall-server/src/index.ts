import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDb } from "./db";
import { evaluatePolicy } from "./policy";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Healthcheck
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// Policy Evaluation Webhook
app.post("/v1/evaluate", evaluatePolicy);

const startServer = async () => {
    try {
        await initDb();
        console.log("Database initialized");
        app.listen(port, () => {
            console.log(\`SupraWall Server running on port \${port}\`);
        });
    } catch (e) {
        console.error("Failed to start server", e);
        process.exit(1);
    }
};

startServer();
