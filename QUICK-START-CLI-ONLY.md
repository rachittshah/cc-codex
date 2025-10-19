# Quick Start - CLI-Only (No API Keys!)

> Get Claude Code + Codex integration running in 5 minutes with **zero usage fees**

---

## ✅ Prerequisites (You Already Have These!)

- ✅ Codex CLI logged in (ChatGPT account) - **CHECK**
- ✅ Claude Code CLI available - **CHECK**
- ✅ Node.js installed - **CHECK**

---

## 🚀 3-Step Setup

### Step 1: Build MCP Server

```bash
cd /Users/rachitt/cc-codex/codex-mcp-server
npm install
npm run build
```

**Expected output:** TypeScript compiles successfully, no errors.

---

### Step 2: Configure Claude Code

Edit `~/.claude/settings.json` and add:

```json
{
  "mcpServers": {
    "codex": {
      "command": "node",
      "args": ["/Users/rachitt/cc-codex/codex-mcp-server/dist/index.js"]
    }
  },
  "permissions": {
    "allow": ["mcp__*"]
  }
}
```

**Note:** No `OPENAI_API_KEY`! Uses your ChatGPT account instead.

---

### Step 3: Link Slash Commands

```bash
cd /Users/rachitt/cc-codex
ln -s $(pwd)/commands/plan.md ~/.claude/commands/
ln -s $(pwd)/commands/reason.md ~/.claude/commands/
ln -s $(pwd)/commands/spec.md ~/.claude/commands/
ln -s $(pwd)/commands/codex.md ~/.claude/commands/
```

---

## 🧪 Test It!

```bash
claude

# Then try:
/plan implement a simple TODO list app

# Expected: 
# - Claude calls codex_plan MCP tool
# - Codex (via your ChatGPT account) generates plan
# - Claude presents structured plan
# - You approve
# - Claude implements
```

---

## 💰 Cost Breakdown

```
API Keys Method (OLD):
❌ $50-100+ per project in usage fees

CLI-Only Method (NEW):
✅ $0 usage fees (uses subscriptions you already pay for)

Savings: $50-100+ per project!
```

---

## 📋 Available Commands

Once setup:

- `/plan <task>` - Generate implementation plan
- `/reason <question>` - Deep reasoning analysis
- `/spec <feature>` - Create technical specification
- `/codex <anything>` - Generic Codex task (auto-routes)

---

## ❓ Troubleshooting

### "MCP server not found"

```bash
# Check if built:
ls /Users/rachitt/cc-codex/codex-mcp-server/dist/index.js

# If missing, rebuild:
npm run build
```

### "codex command not found"

```bash
# Verify codex CLI installed:
codex --version

# If not installed:
npm install -g @openai/codex
```

### "Not logged in to codex"

```bash
# Log in via ChatGPT:
codex
# Select "Sign in with ChatGPT"
# Follow browser flow
```

---

## ✅ You're Done!

**No API keys. No usage fees. No complexity.**

Just use your existing ChatGPT and Claude subscriptions for unlimited AI-assisted development.

Ready to build! 🚀
