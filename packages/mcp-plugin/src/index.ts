// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';

interface SupraWallConfig {
  apiKey: string;
  apiUrl?: string;
}

interface PolicyCheckRequest {
  agentRole?: string;
  toolName: string;
  args: Record<string, unknown>;
  sessionId?: string;
}

interface ApprovalRequest {
  toolName: string;
  args: Record<string, unknown>;
  reason: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

interface AuditLogRequest {
  action: string;
  toolName?: string;
  args?: Record<string, unknown>;
  outcome: 'allowed' | 'denied' | 'approved';
}

class SupraWallMCP {
  private config: SupraWallConfig;
  private readonly DEFAULT_API_URL = 'https://www.supra-wall.com/api/v1/evaluate';
  private readonly DEFAULT_DASHBOARD_URL = 'https://www.supra-wall.com';
  
  constructor(config: SupraWallConfig) {
    this.config = {
      apiUrl: config.apiUrl || this.DEFAULT_API_URL,
      apiKey: config.apiKey
    };
  }
  
  async checkPolicy(request: PolicyCheckRequest) {
    try {
      const response = await axios.post(
        this.config.apiUrl!,
        {
          apiKey: this.config.apiKey,
          toolName: request.toolName,
          args: request.args,
          sessionId: request.sessionId,
          agentRole: request.agentRole
        }
      );
      
      return {
        decision: response.data.decision,
        reason: response.data.reason,
        risk_score: response.data.risk_score || 0,
        requestId: response.data.requestId,
        approval_required: response.data.decision === 'REQUIRE_APPROVAL',
        branding: response.data.branding
      };
    } catch (error: unknown) {
      console.error('SupraWall policy check failed:', error instanceof Error ? error.message : String(error));
      // Security: Default to DENY on API failure (Fail-Closed)
      return {
        decision: 'DENY',
        reason: 'SupraWall Safety Layer unreachable (Fail-Closed for Security)',
        risk_score: 100,
        approval_required: false
      };
    }
  }

  async requestApproval(request: ApprovalRequest) {
    try {
      // Note: In the current backend, approvals are primarily triggered via evaluateAction
      // returning REQUIRE_APPROVAL. This manual trigger uses evaluateAction with a flag.
      const response = await axios.post(
        this.config.apiUrl!,
        {
          apiKey: this.config.apiKey,
          toolName: request.toolName,
          args: request.args,
          forceApproval: true,
          reason: request.reason
        }
      );
      
      const requestId = response.data.requestId;
      return {
        requestId: requestId,
        status: response.data.decision === 'REQUIRE_APPROVAL' ? 'pending' : 'decided',
        dashboard_url: `${this.DEFAULT_DASHBOARD_URL}/dashboard/approvals`
      };
    } catch (error: unknown) {
      console.error('SupraWall approval request failed:', error instanceof Error ? error.message : String(error));
      throw new Error('Failed to request approval');
    }
  }

  async logAction(request: AuditLogRequest) {
    try {
      await axios.post(
        this.config.apiUrl!,
        {
          apiKey: this.config.apiKey,
          toolName: request.toolName || request.action,
          args: request.args ?? {},
          logOnly: true,
          outcome: request.outcome
        }
      );
      return { success: true };
    } catch (error: unknown) {
      console.error('SupraWall audit log failed:', error instanceof Error ? error.message : String(error));
      return { success: false };
    }
  }
}

// MCP Plugin exports
export default async function initialize(config: SupraWallConfig) {
  const suprawall = new SupraWallMCP(config);
  
  return {
    name: 'suprawall',
    version: '1.1.0',
    tools: {
      check_policy: suprawall.checkPolicy.bind(suprawall),
      request_approval: suprawall.requestApproval.bind(suprawall),
      log_action: suprawall.logAction.bind(suprawall)
    }
  };
}
