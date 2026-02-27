export type WebhookEvent =
    | "agent.created"
    | "policy.created"
    | "policy.updated"
    | "tool.allowed"
    | "tool.denied"
    | "tool.require_approval"
    | "audit_log.created";

export interface WebhookPayload {
    id: string;            // Unique event ID
    event: WebhookEvent;   // Type of event
    created_at: string;    // ISO timestamp
    data: Record<string, any>; // Event specific payload
}

export interface WebhookEndpoint {
    id: string;            // Unique endpoint ID
    userId: string;        // The user who owns this endpoint
    url: string;           // The destination URL
    secret: string;        // The signing secret (like whsec_...)
    enabled: boolean;
    events: WebhookEvent[]; // The events this endpoint listens to
}
