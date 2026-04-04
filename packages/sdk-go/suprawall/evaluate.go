package suprawall

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Decision string

const (
	DecisionAllow           Decision = "ALLOW"
	DecisionDeny            Decision = "DENY"
	DecisionRequireApproval Decision = "REQUIRE_APPROVAL"
)

type SupraWallOptions struct {
	ApiKey           string
	CloudFunctionUrl string
	OnNetworkError   string // "fail-open" or "fail-closed"
	AgentRole        string
	SessionId        string
	TenantId         string
}

type SupraWallResponse struct {
	Decision Decision `json:"decision"`
	Reason   string   `json:"reason"`
}

type SupraWall struct {
	Options SupraWallOptions
}

func New(options SupraWallOptions) *SupraWall {
	if options.CloudFunctionUrl == "" {
		options.CloudFunctionUrl = "https://www.supra-wall.com/api/v1/evaluate"
	}
	if options.OnNetworkError == "" {
		options.OnNetworkError = "fail-open"
	}
	return &SupraWall{Options: options}
}

func (s *SupraWall) Evaluate(toolName string, args interface{}) (Decision, string, error) {
	payload := map[string]interface{}{
		"apiKey":    s.Options.ApiKey,
		"toolName":  toolName,
		"arguments": args,
		"agentId":   s.Options.SessionId,
		"tenantId":  s.Options.TenantId,
		"agentRole": s.Options.AgentRole,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return DecisionDeny, "Internal error", err
	}

	client := &http.Client{Timeout: 10 * time.Second}
	req, err := http.NewRequest("POST", s.Options.CloudFunctionUrl, bytes.NewBuffer(body))
	if err != nil {
		return DecisionDeny, "Internal error", err
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		if s.Options.OnNetworkError == "fail-closed" {
			return DecisionDeny, "SupraWall unreachable", err
		}
		return DecisionAllow, "SupraWall unreachable (fail-open)", nil
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		if s.Options.OnNetworkError == "fail-closed" {
			return DecisionDeny, fmt.Sprintf("SupraWall server error: %d", resp.StatusCode), nil
		}
		return DecisionAllow, "SupraWall server error (fail-open)", nil
	}

	var result SupraWallResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return DecisionAllow, "Failed to decode response", nil
	}

	return result.Decision, result.Reason, nil
}
