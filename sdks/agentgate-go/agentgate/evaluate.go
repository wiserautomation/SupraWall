package agentgate

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"
)

var (
	ErrPolicyViolation = errors.New("agentgate: policy violation")
	ErrNetwork         = errors.New("agentgate: network error")
	ErrMissingKey      = errors.New("agentgate: missing AGENTGATE_API_KEY")
)

type Config struct {
	APIKey string
	APIURL string
}

type EvaluateRequest struct {
	AgentID   string      `json:"agentId"`
	ToolName  string      `json:"toolName"`
	Arguments interface{} `json:"arguments"`
}

type EvaluateResponse struct {
	Decision string `json:"decision"`
	Reason   string `json:"reason"`
}

func Evaluate(req EvaluateRequest, cfg ...Config) (*EvaluateResponse, error) {
	apiKey := os.Getenv("AGENTGATE_API_KEY")
	apiURL := os.Getenv("agentgate_API_URL")

	if len(cfg) > 0 {
		if cfg[0].APIKey != "" {
			apiKey = cfg[0].APIKey
		}
		if cfg[0].APIURL != "" {
			apiURL = cfg[0].APIURL
		}
	}

	if apiURL == "" {
		apiURL = "https://api.agentgate.io/v1/evaluate"
	}

	if apiKey == "" {
		return nil, ErrMissingKey
	}

	// Test mode bypass
	if strings.HasPrefix(apiKey, "ag_test_") {
		return &EvaluateResponse{Decision: "ALLOW", Reason: "Test mode bypass"}, nil
	}

	body, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	httpReq, err := http.NewRequest(http.MethodPost, apiURL, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("Authorization", "Bearer "+apiKey)
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrNetwork, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("%w: status %d", ErrNetwork, resp.StatusCode)
	}

	var resData EvaluateResponse
	if err := json.NewDecoder(resp.Body).Decode(&resData); err != nil {
		return nil, err
	}

	if resData.Decision == "DENY" {
		return nil, fmt.Errorf("%w: Tool %s explicitly denied", ErrPolicyViolation, req.ToolName)
	} else if resData.Decision == "REQUIRE_APPROVAL" {
		return nil, fmt.Errorf("%w: Tool %s requires human approval", ErrPolicyViolation, req.ToolName)
	}

	return &resData, nil
}
