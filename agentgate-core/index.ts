import { AgentGateConfig, Adapter, Agent } from "./types";
import { PostgresAdapter } from "./adapters/postgres";
import { MySQLAdapter } from "./adapters/mysql";
import { MongoAdapter } from "./adapters/mongodb";
import { SupabaseAdapter } from "./adapters/supabase";
import { FirebaseAdapter } from "./adapters/firebase";

class AgentGate {
    private configOptions: AgentGateConfig | null = null;
    private adapter: Adapter | null = null;

    config(config: AgentGateConfig) {
        this.configOptions = config;

        switch (config.adapter) {
            case "postgres":
                this.adapter = new PostgresAdapter();
                break;
            case "mysql":
                this.adapter = new MySQLAdapter();
                break;
            case "mongo":
                this.adapter = new MongoAdapter();
                break;
            case "supabase":
                this.adapter = new SupabaseAdapter();
                break;
            case "firebase":
                this.adapter = new FirebaseAdapter();
                break;
            default:
                throw new Error(`Adapter ${config.adapter} is not supported yet.`);
        }

        if (config.connectionString) {
            // Intentionally not awaiting since this config method is synchronous
            // Real apps might want an explicit init/connect method if strict connection guarantee is needed 
            // before operations.
            this.adapter.connect(config.connectionString).catch(err => {
                console.error(`Failed to connect ${config.adapter} adapter:`, err);
            });
        }
    }

    // Expose internal setter for test/interop
    __interop_setAdapterDb(db: any) {
        if (this.adapter && 'setDb' in this.adapter) {
            (this.adapter as any).setDb(db);
        }
    }

    get agents() {
        if (!this.adapter) {
            throw new Error("AgentGate is not configured. Call agentgate.config() first.");
        }
        return {
            create: async (agent: Agent) => this.adapter!.createAgent(agent),
            get: async (id: string) => this.adapter!.getAgent(id),
            update: async (id: string, updates: Partial<Agent>) => this.adapter!.updateAgent(id, updates),
            delete: async (id: string) => this.adapter!.deleteAgent(id),
            list: async (filter?: { userId?: string }) => this.adapter!.listAgents(filter),
        };
    }
}

export const agentgate = new AgentGate();
export * from "./types";
