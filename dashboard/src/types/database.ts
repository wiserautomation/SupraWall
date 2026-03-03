export interface Agent {
  id?: string;
  userId: string;
  name: string;
  apiKey: string;
  // --- Agent Identity ---
  scopes?: string[];
  scopeLimits?: Record<string, any>;
  status?: 'active' | 'suspended' | 'revoked';
  lastActiveAt?: any;
  // --- Budget & Safety Config ---
  maxCostUsd?: number;
  budgetAlertUsd?: number;
  maxIterations?: number;
  loopDetection?: boolean;
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
  agentRole?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timestamp: any; // Firestore timestamp
  cost_usd?: number;
  estimated_cost_usd?: number;
  isLoop?: boolean;
  isIterationLimit?: boolean;
  // --- Phase 3: Forensic Fields ---
  integrityHash?: string;      // SHA-256 hash of this entry (tamper detection)
  previousHash?: string;       // Hash of the previous entry (hash chain)
  sequenceNumber?: number;     // Monotonic sequence for ordering
  riskScore?: number;          // 0–100 automated risk assessment
  riskFactors?: string[];      // Explainability: why this score
}

export type ForensicVerificationStatus = 'verified' | 'tampered' | 'unchecked';


// ── Phase 2: Approval Workflows ──

export type ApprovalStatus = 'pending' | 'approved' | 'denied' | 'expired';
export type NotificationChannel = 'email' | 'slack' | 'dashboard';

export interface ApprovalRequest {
  id?: string;
  userId: string;           // org owner
  agentId: string;          // requesting agent
  agentName?: string;       // display name
  toolName: string;         // tool that needs approval
  arguments: string;        // stringified JSON of the tool args
  sessionId?: string;       // agent session for correlation
  agentRole?: string;       // optional agent role context

  status: ApprovalStatus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: any;           // Firestore timestamp
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  respondedAt?: any;        // Firestore timestamp
  expiresAt?: any;          // Firestore timestamp — auto-deny after this time

  // Reviewer info
  reviewedBy?: string;      // email or user ID of the reviewer
  reviewNote?: string;      // optional note from the reviewer

  // Notification config
  notifyChannels?: NotificationChannel[];
  slackChannelId?: string;
  notifyEmail?: string;

  // Cost context
  estimatedCostUsd?: number;
}

export interface ApprovalResponse {
  requestId: string;
  decision: 'approved' | 'denied';
  reviewedBy: string;
  reviewNote?: string;
}

