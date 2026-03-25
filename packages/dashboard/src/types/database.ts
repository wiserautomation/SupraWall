// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export interface AgentGuardrails {
    budget?: {
        limitUsd: number;
        resetPeriod: 'daily' | 'weekly' | 'monthly' | 'never';
        onExceeded: 'block' | 'warn' | 'require_approval';
        currentPeriodSpend: number;
        periodStartAt: any;
    };
    allowedTools?: string[];
    blockedTools?: string[];
    piiScrubbing?: {
        enabled: boolean;
        patterns: ('email' | 'phone' | 'ssn' | 'credit_card' | 'ip')[];
        customPatterns?: { name: string; regex: string; action: 'redact' | 'block' }[];
        action: 'redact' | 'block';
    };
}

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
  max_cost_usd?: number;
  budgetAlertUsd?: number;
  budget_alert_usd?: number;
  maxIterations?: number;
  max_iterations?: number;
  loopDetection?: boolean;
  loop_detection?: boolean;
  createdAt?: any;
  guardrails?: AgentGuardrails;
}

export type RuleType = 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL';

export interface Policy {
  id?: string;
  agentId: string;
  agentid?: string;
  toolName: string;
  toolname?: string;
  condition: string; 
  ruleType: RuleType;
  ruletype?: RuleType;
  priority: number;   
  isDryRun: boolean; 
  isdryrun?: boolean;
  description?: string;
}

export interface AuditLog {
  id?: string;
  agentId: string;
  agentid?: string;
  toolName: string;
  toolname?: string;
  arguments: string; 
  decision: string;
  reason?: string;
  sessionId?: string;
  agentRole?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timestamp: any; 
  cost_usd?: number;
  estimated_cost_usd?: number;
  isLoop?: boolean;
  isIterationLimit?: boolean;
  // --- Phase 3: Forensic Fields ---
  integrityHash?: string;      
  previousHash?: string;       
  sequenceNumber?: number;     
  riskScore?: number;          
  riskFactors?: string[];      
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

