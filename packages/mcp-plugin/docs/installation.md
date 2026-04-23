# Installation Guide

## Direct Installation
To install the SupraWall MCP plugin directly into your Claude Desktop environment:

1. Open Claude Desktop.
2. Enter the following command in the input field:
   ```bash
   /plugin marketplace add wiserautomation/suprawall-mcp-plugin
   ```

## Configuration
After installation, you must provide your API key to authenticate with the SupraWall platform.

1. Run the configuration command:
   ```bash
   /plugin configure suprawall
   ```
2. When prompted, paste your API key from the [SupraWall Dashboard](https://app.supra-wall.com).

## Manual Configuration
If you prefer manual configuration, you can add the following to your `mcp_config.json`:

```json
{
  "mcpServers": {
    "suprawall": {
      "command": "node",
      "args": ["path/to/suprawall-mcp-plugin/dist/index.js"],
      "env": {
        "SUPRAWALL_API_KEY": "your_api_key_here"
      }
    }
  }
}
```
