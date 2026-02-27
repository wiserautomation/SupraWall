export interface Agent {
  id?: string;
  userId: string;
  name: string;
  apiKey: string;
}

export type RuleType = 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL';

export interface Policy {
  id?: string;
  agentId: string;
  toolName: string;
  condition: string; // used for regex
  ruleType: RuleType;
}

export interface AuditLog {
  id?: string;
  agentId: string;
  toolName: string;
  arguments: string; // stringified JSON
  decision: string;
  reason?: string;
  sessionId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timestamp: any; // Firestore timestamp
  cost_usd?: number;
}
