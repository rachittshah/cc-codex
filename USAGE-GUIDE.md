# Codex + Claude Code Usage Guide

> Quick reference for using Codex and Claude Code together

---

## Core Principle

**Codex thinks, Claude implements.**

- **Codex (gpt-5)**: Planning, reasoning, architectural decisions
- **Claude Code**: Writing code, running tests, git operations

---

## When to Use Each Tool

### Use Codex For:
- Complex architectural decisions
- Multi-step implementation planning
- Technology comparisons
- Security/performance analysis
- Technical specifications
- Problem decomposition

### Use Claude Code For:
- Writing and editing code
- Running tests and builds
- Git commits and PRs
- Installing dependencies
- Debugging and fixing errors
- File operations

---

## How Claude Calls Codex

### Method 1: Slash Commands (Recommended)

```bash
# Start Claude Code
claude

# Use slash commands
/plan implement user authentication with JWT
/reason should we use PostgreSQL or MongoDB?
/spec REST API for payment processing
/codex compare caching solutions
```

### Method 2: Direct MCP Tool Call

Claude automatically calls MCP tools when it detects complexity:

```
User: "Design an authentication system"
→ Claude detects complexity
→ Calls: mcp__codex__codex_plan
→ Codex generates plan
→ Claude presents to user
→ User approves
→ Claude implements
```

### Available Slash Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `/plan` | Implementation planning | `/plan add real-time notifications` |
| `/reason` | Deep analysis | `/reason microservices vs monolith` |
| `/spec` | Technical specifications | `/spec user management API` |
| `/codex` | Generic task | `/codex analyze security vulnerabilities` |

---

## How Codex Calls Claude

### From Codex Session

```bash
# When Codex needs implementation
codex exec -m gpt-5 --full-auto "plan user authentication system"

# Codex generates plan, then delegates:
claude "implement User model with email and password in models/user.ts"
claude "create JWT middleware in middleware/auth.ts"
claude "write tests for auth system and run them"
```

### Codex Always Runs Claude With:
```bash
claude --dangerously-skip-permissions
```

This enables full automation without approval prompts.

---

## Complete Workflows

### Workflow 1: Feature Planning

**Starting from Claude:**

```bash
claude

> "Add user authentication to the API"

# Claude suggests
→ Use /plan for complex features

> /plan implement user authentication

# Process:
1. Claude calls Codex via /plan
2. Codex analyzes requirements
3. Codex generates detailed plan:
   - Phase 1: Database schema
   - Phase 2: Auth middleware
   - Phase 3: API routes
   - Phase 4: Testing
4. Claude presents plan
5. User approves
6. Claude implements phase by phase
7. Tests run, commits made
```

### Workflow 2: Architectural Decision

**Starting from Claude:**

```bash
claude

> "We need to choose a database"

# Use /reason for decisions
> /reason PostgreSQL vs MongoDB for e-commerce platform

# Process:
1. Claude calls Codex via /reason
2. Codex analyzes both options:
   - PostgreSQL: Strong ACID, relations, complex queries
   - MongoDB: Flexible schema, horizontal scaling
3. Codex recommends based on requirements
4. User decides
5. Claude implements chosen solution
```

### Workflow 3: Code Review

**Starting from Claude:**

```bash
claude

> "Review the authentication code for security issues"

# Use /codex for analysis
> /codex analyze authentication code for security vulnerabilities

# Process:
1. Claude calls Codex via /codex (auto-selects analyze tool)
2. Codex reviews codebase
3. Codex identifies issues:
   - Missing rate limiting
   - Weak password hashing
   - No input validation
4. Claude presents findings
5. User approves fixes
6. Claude implements fixes
```

### Workflow 4: From Codex CLI

**Starting from Codex:**

```bash
# Complex planning task
codex exec -m gpt-5 --full-auto "design a scalable notification system with WebSockets, email, and SMS. break down implementation."

# Codex analyzes and creates plan, then:
# Codex calls Claude for implementation:

claude "create notification service in services/notification.ts"
claude "implement WebSocket server in websocket/server.ts"
claude "add email integration with SendGrid in integrations/email.ts"
claude "write comprehensive tests and run them"
```

---

## Practical Examples

### Example 1: Add Complex Feature

```bash
# From Claude
claude

> /plan implement rate limiting middleware for API

# Codex returns plan:
Phase 1: Choose rate limiting strategy (token bucket)
Phase 2: Implement middleware with Redis
Phase 3: Add configuration (per-user, per-endpoint)
Phase 4: Testing and monitoring

# User approves
> Proceed

# Claude implements all phases
```

### Example 2: Technology Selection

```bash
# From Claude
claude

> /reason Redis vs Memcached vs in-memory caching for session storage

# Codex analyzes:
- Redis: Persistence, data structures, pub/sub
- Memcached: Simple, fast, pure cache
- In-memory: Fastest, no network, loses data on restart

# Codex recommends: Redis for session storage
# Reasoning: Need persistence, TTL, distributed access

# User agrees
> Use Redis

# Claude implements Redis integration
```

### Example 3: Create Specification

```bash
# From Claude
claude

> /spec payment processing API with Stripe integration

# Codex generates detailed spec:
- Endpoints: POST /payments, GET /payments/:id
- Request schemas with validation
- Response formats
- Error handling (card declined, network errors)
- Webhook handling
- Security (idempotency, API keys)
- Rate limiting

# User reviews and approves
# Claude implements to spec
```

### Example 4: Security Audit

```bash
# From Claude
claude

> /codex perform security audit on authentication system

# Codex reviews and reports:
1. CRITICAL: No rate limiting on login endpoint
2. HIGH: Weak password requirements (no complexity)
3. MEDIUM: Session tokens not rotated
4. LOW: Missing security headers

# User prioritizes
> Fix critical and high issues

# Claude implements fixes
```

---

## Best Practices

### When Using Claude → Codex

1. **Use slash commands** for clarity (`/plan`, `/reason`, `/spec`)
2. **Provide context** in your request (project type, scale, requirements)
3. **Review plans** before approving implementation
4. **Ask follow-up questions** to Codex if plan is unclear

### When Using Codex → Claude

1. **Be specific** in delegation to Claude (exact file paths, clear instructions)
2. **One task per call** to Claude (don't batch unrelated tasks)
3. **Verify results** before proceeding to next step
4. **Use --dangerously-skip-permissions** for automation

### General

1. **Complex decisions → Codex** (architecture, tech selection, planning)
2. **Implementation → Claude** (code writing, testing, git)
3. **Iterate** (Codex plans → Claude implements → Codex reviews)
4. **Document decisions** (Codex provides rationale, save it)

---

## Command Reference

### Claude Code Slash Commands

```bash
/plan <task>      # Generate implementation plan
/reason <query>   # Deep reasoning and analysis
/spec <feature>   # Create technical specification
/codex <task>     # Generic Codex task (auto-detects tool)
```

### Codex CLI Commands

```bash
# Interactive mode
codex

# Execute with gpt-5
codex exec -m gpt-5 --full-auto "<task>"

# Get JSON output
codex exec -m gpt-5 --json "<task>"

# Delegate to Claude
claude "<specific implementation task>"
```

---

## Common Patterns

### Pattern 1: Plan → Implement → Review

```bash
# 1. Plan (Codex)
/plan add payment processing

# 2. Implement (Claude automatically)
# Claude follows plan step-by-step

# 3. Review (Codex)
/codex review payment implementation for security
```

### Pattern 2: Reason → Decide → Implement

```bash
# 1. Reason (Codex)
/reason which authentication method to use

# 2. Decide (User)
> Use JWT

# 3. Implement (Claude)
# Claude implements JWT authentication
```

### Pattern 3: Spec → Implement → Test

```bash
# 1. Spec (Codex)
/spec user management API

# 2. Implement (Claude)
# Claude implements to spec

# 3. Test (Claude)
# Claude writes and runs tests
```

### Pattern 4: Analyze → Fix → Verify

```bash
# 1. Analyze (Codex)
/codex analyze performance bottlenecks

# 2. Fix (Claude)
# Claude implements optimizations

# 3. Verify (Claude)
# Claude runs benchmarks
```

---

## Troubleshooting

### Slash Commands Not Working

```bash
# Verify links
ls -la ~/.claude/commands/

# Re-link if needed
ln -sf /Users/rachitt/cc-codex/commands/*.md ~/.claude/commands/
```

### MCP Tools Not Available

```bash
# Check global config
cat ~/.claude/settings.json | grep codex

# Verify MCP server
ls -la /Users/rachitt/cc-codex/codex-mcp-server/dist/index.js

# Restart Claude Code
```

### Codex Not Calling Claude

```bash
# Check Claude in PATH
which claude

# Test Claude manually
claude "echo 'test'"

# Verify Codex instructions
cat /Users/rachitt/cc-codex/AGENTS.md
```

---

## Quick Start

### First Time Setup

1. **Build MCP server** (one time):
   ```bash
   cd /Users/rachitt/cc-codex/codex-mcp-server
   npm install && npm run build
   ```

2. **Verify global config**:
   ```bash
   /Users/rachitt/cc-codex/verify-global-mcp.sh
   ```

3. **Start using**:
   ```bash
   claude
   /plan implement your feature
   ```

### Daily Usage

```bash
# Start Claude Code (from any directory)
claude

# Use slash commands as needed
/plan <feature>
/reason <decision>
/spec <component>
/codex <task>

# Claude automatically calls Codex
# Codex analyzes and responds
# Claude implements
```

---

## Summary

**Bidirectional Integration:**
- Claude → Codex: Use `/plan`, `/reason`, `/spec`, `/codex`
- Codex → Claude: Use `claude "task"`

**Division of Labor:**
- Codex: Planning, reasoning, specifications, analysis
- Claude: Implementation, testing, git operations

**Workflow:**
1. Start with Claude for most tasks
2. Claude calls Codex when complexity detected
3. Codex analyzes and plans
4. User approves
5. Claude implements
6. Iterate as needed

**Global Availability:**
- Works from any directory
- No per-project setup
- Consistent interface everywhere

---

**Ready to use. Start with: `claude` then try `/plan your task`**
