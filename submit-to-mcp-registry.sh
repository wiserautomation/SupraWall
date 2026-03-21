#!/bin/bash

# SupraWall MCP Registry Submission Script
# This script automates the process of submitting SupraWall to the official MCP registry
# Usage: bash submit-to-mcp-registry.sh

set -e

echo "=================================================="
echo "SupraWall MCP Registry Submission Script"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${BLUE}Step 1: Checking prerequisites...${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js installed: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed${NC}"
    echo "Please install npm"
    exit 1
fi
echo -e "${GREEN}✓ npm installed: $(npm --version)${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}✗ Git is not installed${NC}"
    echo "Please install Git from https://git-scm.com/"
    exit 1
fi
echo -e "${GREEN}✓ Git installed: $(git --version)${NC}"

echo ""

# Step 2: Install mcp-publisher CLI
echo -e "${BLUE}Step 2: Installing MCP Publisher CLI...${NC}"
echo ""

if ! command -v mcp-publisher &> /dev/null && [ ! -f "./mcp-publisher" ]; then
    echo "Installing MCP Publisher CLI binary..."
    curl -sL "https://github.com/modelcontextprotocol/registry/releases/latest/download/mcp-publisher_$(uname -s | tr '[:upper:]' '[:lower:]')_$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/').tar.gz" | tar xz mcp-publisher
    echo -e "${GREEN}✓ MCP Publisher CLI downloaded to current directory${NC}"
else
    echo -e "${GREEN}✓ MCP Publisher CLI is available${NC}"
fi

# Set an alias or variable to use the right executable
if [ -f "./mcp-publisher" ]; then
    MCP_CMD="./mcp-publisher"
else
    MCP_CMD="mcp-publisher"
fi

echo ""

# Step 3: Validate server.json
echo -e "${BLUE}Step 3: Validating server.json...${NC}"
echo ""

if [ ! -f "server.json" ]; then
    echo -e "${RED}✗ server.json not found in current directory${NC}"
    echo "Please run this script from the SupraWall directory containing server.json"
    exit 1
fi

echo "Validating server.json..."
if $MCP_CMD validate --config server.json; then
    echo -e "${GREEN}✓ server.json is valid${NC}"
else
    echo -e "${RED}✗ server.json validation failed${NC}"
    echo "Please fix the errors in server.json before submitting"
    exit 1
fi

echo ""

# Step 4: Check for GitHub authentication
echo -e "${BLUE}Step 4: Checking GitHub authentication...${NC}"
echo ""

echo "Checking if you're already authenticated with GitHub..."
if $MCP_CMD whoami 2>/dev/null; then
    echo -e "${GREEN}✓ Already authenticated with GitHub${NC}"
else
    echo -e "${YELLOW}⚠ Not yet authenticated with GitHub${NC}"
    echo ""
    echo "You'll need to authenticate with GitHub to publish."
    echo "Follow these steps:"
    echo "1. Run: mcp-publisher login github"
    echo "2. Visit the provided URL"
    echo "3. Enter the device code"
    echo "4. Authorize the application"
    echo ""
    read -p "Ready to authenticate? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Starting GitHub authentication..."
        $MCP_CMD login github
        echo -e "${GREEN}✓ GitHub authentication complete${NC}"
    else
        echo -e "${YELLOW}Skipping authentication. You can run 'mcp-publisher login github' manually later.${NC}"
        exit 0
    fi
fi

echo ""

# Step 5: Dry run
echo -e "${BLUE}Step 5: Running dry-run validation...${NC}"
echo ""

echo "Testing publication without actually submitting..."
if $MCP_CMD publish --dry-run --config server.json; then
    echo -e "${GREEN}✓ Dry run successful${NC}"
else
    echo -e "${RED}✗ Dry run failed${NC}"
    echo "Please fix any issues before publishing"
    exit 1
fi

echo ""

# Step 6: Final confirmation
echo -e "${BLUE}Step 6: Final confirmation${NC}"
echo ""

echo "⚠️  IMPORTANT: Once published, versions are IMMUTABLE"
echo "You will NOT be able to change or delete this version."
echo ""
echo "Server Details:"
echo "  Name: io.github.wiserautomation/suprawall-mcp"
echo "  Version: 1.0.0"
echo "  Type: Local MCP Server (stdio)"
echo ""

read -p "Are you ready to publish? (type 'yes' to confirm): " confirmation

if [ "$confirmation" != "yes" ]; then
    echo -e "${YELLOW}Publication cancelled${NC}"
    exit 0
fi

echo ""

# Step 7: Publish to registry
echo -e "${BLUE}Step 7: Publishing to MCP Registry...${NC}"
echo ""

echo "Publishing server.json to official MCP registry..."
if $MCP_CMD publish --config server.json; then
    echo ""
    echo -e "${GREEN}✓✓✓ PUBLICATION SUCCESSFUL ✓✓✓${NC}"
    echo ""
    echo "Your server is now available in the official MCP registry!"
    echo ""
    echo "Registry URL: https://registry.modelcontextprotocol.io/"
    echo "Server Name: io.github.wiserautomation/suprawall-mcp"
    echo "Version: 1.0.0"
    echo ""
    echo "Next Steps:"
    echo "1. Verify it appears in the registry at:"
    echo "   https://registry.modelcontextprotocol.io/server/io.github.wiserautomation/suprawall-mcp"
    echo ""
    echo "2. (Optional) Submit remote server (server-remote.json) by running:"
    echo "   $MCP_CMD publish --config server-remote.json"
    echo ""
    echo "3. Submit to Claude Directory at:"
    echo "   https://forms.gle/tyiAZvch1kDADKoP9 (local)"
    echo "   https://docs.google.com/forms/d/e/1FAIpQLSeafJF2NDI7oYx1r8o0ycivCSVLNq92Mpc1FPxMKSw1CzDkqA/viewform (remote)"
    echo ""
    echo "=================================================="
else
    echo -e "${RED}✗ Publication failed${NC}"
    echo "Please check the error message above and try again"
    exit 1
fi

echo ""
