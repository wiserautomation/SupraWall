#!/bin/bash
# Copyright 2026 SupraWall Contributors
# Smoke test to verify auth guards are active on critical endpoints.

BASE_URL=${1:-"http://localhost:3000"}

echo "Running Auth Smoke Tests against: $BASE_URL"
echo "------------------------------------------"

test_endpoint() {
    local method=$1
    local path=$2
    local expected_status=$3
    local description=$4

    echo -n "[ ] $description ($path)... "
    
    # We use -o /dev/null to discard body, and -w "%{http_code}" to get status
    local status=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$BASE_URL$path")
    
    if [ "$status" == "$expected_status" ]; then
        echo "PASS ($status)"
    else
        echo "FAIL (Expected $expected_status, got $status)"
    fi
}

# 1. Dashboard Protected Routes (requireDashboardAuth)
test_endpoint "GET" "/api/v1/agents" "401" "V1 Agents List (Dashboard Auth)"
test_endpoint "POST" "/api/generate" "401" "AI Generation (Dashboard Auth)"
test_endpoint "POST" "/api/audit/scan" "401" "Code Scan (Dashboard Auth)"

# 2. MCP OAuth Protected Routes
test_endpoint "GET" "/api/mcp/sse" "401" "MCP SSE Transport (OAuth Auth)"

# 3. Admin Protected Routes
test_endpoint "GET" "/api/admin/overview" "401" "Admin Overview (Admin Auth)"

# 4. Paperclip Token Protected Routes
test_endpoint "POST" "/api/paperclip/checkout" "401" "Paperclip Checkout (Temp Token Auth)"

# 5. Public / API Key Routes (should NOT return 401 for missing token, but maybe 400 for missing API key)
test_endpoint "POST" "/api/v1/evaluate" "400" "Public Evaluation (API Key Auth - Expect 400 for missing key)"

echo "------------------------------------------"
echo "Smoke tests complete."
