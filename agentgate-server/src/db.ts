import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
});

pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
});

export const initDb = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS policies (
            id SERIAL PRIMARY KEY,
            agent_id VARCHAR(255) NOT NULL,
            tool_name VARCHAR(255) NOT NULL,
            condition TEXT NOT NULL,
            rule_type VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS audit_logs (
            id SERIAL PRIMARY KEY,
            agent_id VARCHAR(255) NOT NULL,
            tool_name VARCHAR(255) NOT NULL,
            arguments JSONB NOT NULL,
            decision VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await pool.query(query);
};
