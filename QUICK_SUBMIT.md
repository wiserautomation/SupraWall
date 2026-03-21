# SupraWall MCP Registry - Quick Submission Guide

Submit SupraWall to the official MCP registry in 5 minutes!

---

## Option A: Automated Submission (Recommended)

### Step 1: Navigate to SupraWall directory
```bash
cd /path/to/suprawall-mcp
```

### Step 2: Make script executable
```bash
chmod +x submit-to-mcp-registry.sh
```

### Step 3: Run the submission script
```bash
bash submit-to-mcp-registry.sh
```

The script will:
- ✓ Check prerequisites (Node.js, npm, git)
- ✓ Install MCP Publisher CLI
- ✓ Validate server.json
- ✓ Authenticate with GitHub (if needed)
- ✓ Run dry-run test
- ✓ Get your confirmation
- ✓ Publish to registry

**That's it!** The script handles everything.

---

## Option B: Manual Submission

If you prefer to do it step-by-step:

### Step 1: Install MCP Publisher CLI
```bash
npm install -g @modelcontextprotocol/registry-cli
```

### Step 2: Authenticate with GitHub
```bash
mcp-publisher login github
```

Follow the device code flow:
1. Visit the URL shown in terminal
2. Paste the device code
3. Authorize the application
4. Return to terminal

### Step 3: Validate Configuration
```bash
mcp-publisher validate --config server.json
```

Expected output: `✓ server.json is valid`

### Step 4: Test Publication (Dry Run)
```bash
mcp-publisher publish --dry-run --config server.json
```

This tests without actually publishing.

### Step 5: Publish to Registry
```bash
mcp-publisher publish --config server.json
```

**⚠️ Important:** Versions are immutable after publishing!

### Step 6: Verify Publication
Visit: https://registry.modelcontextprotocol.io/server/io.github.wiserautomation/suprawall-mcp

---

## What Gets Published?

**Local MCP Server:**
- Name: `io.github.wiserautomation/suprawall-mcp`
- Version: `1.0.0`
- Type: stdio (local)
- Transport: JSON-RPC over stdin/stdout
- Tools: check_policy, request_approval

**Configuration:** from `server.json` file

---

## After Publication

### Immediately Available
- Appears in official MCP registry
- Searchable at https://registry.modelcontextprotocol.io/
- Can be installed by Claude users
- Installation: via MCP registry or local package

### Next Steps (Optional)
1. **Publish Remote Server** (cloud version)
   ```bash
   mcp-publisher publish --config server-remote.json
   ```

2. **Submit to Claude Directory** (get official listing in Claude)
   - Local: https://forms.gle/tyiAZvch1kDADKoP9
   - Remote: https://docs.google.com/forms/d/e/1FAIpQLSeafJF2NDI7oYx1r8o0ycivCSVLNq92Mpc1FPxMKSw1CzDkqA/viewform

3. **Announce**
   - Update website/GitHub
   - Social media announcement
   - Blog post about submission

---

## Troubleshooting

### "Node.js not found"
```bash
# Install Node.js from: https://nodejs.org/
# Then retry
```

### "mcp-publisher not found"
```bash
npm install -g @modelcontextprotocol/registry-cli
```

### "Not authenticated"
```bash
mcp-publisher login github
# Follow device code flow
```

### "server.json validation failed"
```bash
# Check that all required fields are present:
jq . server.json  # Verify JSON syntax

# Required fields:
# - name: "io.github.wiserautomation/suprawall-mcp"
# - version: "1.0.0"
# - description
# - packages (array)
```

### "Dry run failed"
Fix any validation errors shown before attempting actual publication.

---

## Questions?

**Documentation:** https://www.supra-wall.com/docs
**Support:** support@wiserautomation.agency
**MCP Registry:** https://registry.modelcontextprotocol.io/

---

## Timeline

```
Now: Run submission script
↓
5 minutes: Script completes
↓
1-24 hours: Server appears in registry
↓
Ready: Users can install and use
```

---

**Ready? Let's go! 🚀**

Run: `bash submit-to-mcp-registry.sh`

