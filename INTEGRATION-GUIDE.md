# Claude Code + Codex Integration Guide

> Complete guide for setting up and using the seamless Claude Code + Codex integration

**Version:** 1.0.0
**Last Updated:** 2025-10-19

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Usage Patterns](#usage-patterns)
6. [Slash Commands](#slash-commands)
7. [MCP Tools](#mcp-tools)
8. [Shared Context](#shared-context)
9. [Hooks & Auto-Delegation](#hooks--auto-delegation)
10. [Workflows](#workflows)
11. [Troubleshooting](#troubleshooting)
12. [Best Practices](#best-practices)

---

## Overview

### What is This Integration?

The Claude Code + Codex integration creates a unified AI development environment where:
- **Claude Code** handles implementation (writing code, running tests, git operations)
- **Codex (gpt-5)** handles reasoning (planning, architectural decisions, analysis)

### Key Features

✅ **Automated Task Delegation** - Claude detects complexity and suggests Codex
✅ **Shared Context** - Both tools access session state, decisions, artifacts
✅ **Structured Output** - JSON schemas for consistent data exchange
✅ **MCP Integration** - Native tools for seamless communication
✅ **CLI Flexibility** - Direct `codex exec` for complex scenarios
✅ **Convenience Commands** - `/plan`, `/reason`, `/spec`, `/codex` slash commands

### Benefits

- **Better Decisions**: Codex's deep reasoning for architectural choices
- **Faster Development**: Claude implements while Codex plans ahead
- **Quality Code**: Codex reviews, Claude fixes
- **Documentation**: Auto-generated specs and plans
- **Audit Trail**: Full history of reasoning → decisions → implementation

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User                                │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ Prompts
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Claude Code CLI                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Complexity Detection Hook                           │   │
│  │  (analyzes prompt → suggests delegation if complex)  │   │
│  └──────────────────────────────────────────────────────┘   │
│                  │                          │                │
│                  │ Simple Task              │ Complex Task   │
│                  ▼                          ▼                │
│           Direct Execution          Delegate to Codex       │
│                                             │                │
└─────────────────────────────────────────────┼────────────────┘
                                              │
                                              ▼
                  ┌───────────────────────────────────────────┐
                  │       Codex MCP Server                    │
                  │  ┌─────────────────────────────────────┐  │
                  │  │  Tools: reason, plan, spec,         │  │
                  │  │         analyze, compare            │  │
                  │  └─────────────────────────────────────┘  │
                  │                  │                        │
                  └──────────────────┼────────────────────────┘
                                     │
                                     ▼
                  ┌───────────────────────────────────────────┐
                  │     Codex CLI (gpt-5 high reasoning)      │
                  │  codex exec -m gpt-5 --full-auto "..."   │
                  └───────────────────────────────────────────┘
                                     │
                                     ▼
                  ┌───────────────────────────────────────────┐
                  │        Shared Context Store               │
                  │  • Session state                          │
                  │  • Decisions & rationale                  │
                  │  • Artifacts (plans, specs, analysis)     │
                  │  • History timeline                       │
                  └───────────────────────────────────────────┘
```

---

## Installation

### Prerequisites

- **Node.js** 18+ (for MCP server)
- **Claude Code** CLI installed
- **Codex** CLI installed
- **OpenAI API Key** (for Codex/gpt-5)

### Step 1: Install Dependencies

```bash
cd codex-mcp-server
npm install
```

### Step 2: Build MCP Server

```bash
cd codex-mcp-server
npm run build
```

### Step 3: Verify Installation

```bash
# Check MCP server built
ls codex-mcp-server/dist/index.js

# Check Codex CLI
codex --version

# Check Claude Code CLI
claude --help
```

---

## Configuration

### 1. Configure Codex

Edit `~/.codex/config.toml`:

```toml
model = "gpt-5"
model_reasoning_effort = "high"

[projects."/path/to/your/project"]
trust_level = "trusted"
```

### 2. Configure Claude Code

Edit `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "codex": {
      "command": "node",
      "args": ["/absolute/path/to/cc-codex/codex-mcp-server/dist/index.js"],
      "env": {
        "OPENAI_API_KEY": "${OPENAI_API_KEY}"
      }
    }
  },
  "permissions": {
    "allow": ["mcp__*"]
  }
}
```

### 3. Set Environment Variables

```bash
# Add to ~/.bashrc or ~/.zshrc
export OPENAI_API_KEY="your-openai-api-key"
export ANTHROPIC_API_KEY="your-anthropic-api-key"
```

### 4. Install Slash Commands

```bash
# Link commands to Claude Code
mkdir -p ~/.claude/commands
ln -s /absolute/path/to/cc-codex/commands/*.md ~/.claude/commands/
```

### 5. Install Hooks (Optional)

```bash
# Link hooks to Claude Code
mkdir -p ~/.claude/hooks
ln -s /absolute/path/to/cc-codex/hooks/hooks.json ~/.claude/hooks/
```

---

## Usage Patterns

### Pattern 1: Direct Claude (Simple Tasks)

```bash
User: "Add a console.log to the main function"
→ Claude Code handles directly
→ No Codex delegation needed
```

### Pattern 2: Slash Command (Medium Complexity)

```bash
User: "/plan implement caching layer"
→ Calls codex_plan via MCP
→ Returns structured plan
→ Claude presents plan
→ User approves
→ Claude implements
```

### Pattern 3: CLI (High Complexity)

```bash
User: "Design a complete microservices architecture"
→ Too complex for single MCP tool
→ Use: codex exec -m gpt-5 --full-auto "..."
→ Codex provides comprehensive design
→ Claude implements incrementally
```

### Pattern 4: Auto-Delegation (Detected Complexity)

```bash
User: "We need to choose between PostgreSQL and MongoDB.
       Consider scalability, query patterns, and team expertise.
       Then plan the migration."

Hook Output:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 Codex Delegation Suggested
Complexity Score: 6
Use: /reason, /plan
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

User: /reason
→ Codex analyzes database options
→ Recommends PostgreSQL
→ User approves

User: /plan
→ Codex plans migration
→ Claude implements phase-by-phase
```

---

## Slash Commands

### `/plan` - Generate Implementation Plan

**Usage:**
```
/plan <task description>
```

**Example:**
```
/plan implement user authentication with JWT and refresh tokens
```

**Output:**
- Structured plan with phases
- Step-by-step breakdown
- Timeline estimates
- Risk assessment
- Technologies required
- Next steps

**When to Use:**
- Feature implementation
- Multi-step projects
- Unclear implementation path

---

### `/reason` - Deep Reasoning Analysis

**Usage:**
```
/reason <question or problem>
```

**Example:**
```
/reason should we use REST or GraphQL for our new API?
```

**Output:**
- Detailed analysis
- Multiple approaches evaluated
- Pros/cons for each
- Recommendation with rationale

**When to Use:**
- Architectural decisions
- Technology selection
- Trade-off analysis
- Complex problem-solving

---

### `/spec` - Create Technical Specification

**Usage:**
```
/spec <feature or system to specify>
```

**Example:**
```
/spec rate limiting middleware for Express API
```

**Output:**
- Requirements (functional + non-functional)
- Architecture design
- Component descriptions
- API endpoints
- Implementation plan

**When to Use:**
- Documenting new features
- System design
- Before large implementations

---

### `/codex` - Generic Codex Command

**Usage:**
```
/codex <any complex task>
```

**Example:**
```
/codex compare Redis, Memcached, and in-memory cache
```

**Behavior:**
- Auto-detects best tool (reason, plan, spec, analyze, compare)
- Routes request appropriately
- Returns formatted results

**When to Use:**
- Not sure which specific command to use
- Want automatic tool selection

---

## MCP Tools

### Available Tools

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `codex_reason` | Deep reasoning | question, context | analysis, approaches, recommendation |
| `codex_plan` | Planning | task, constraints, timeline | structured plan with phases |
| `codex_spec` | Specification | title, description, requirements | technical spec |
| `codex_analyze` | Code analysis | target, focusAreas, depth | findings, metrics, recommendations |
| `codex_compare` | Comparison | question, options, criteria | comparison matrix, recommendation |

### Direct MCP Tool Usage

If you want to bypass slash commands and call MCP tools directly:

```javascript
// Via Claude Code (internally)
{
  "tool": "codex_reason",
  "arguments": {
    "question": "Which database should we use?",
    "context": "E-commerce app, 10k users, complex queries",
    "sessionId": "abc-123"
  }
}
```

---

## Shared Context

### Overview

The shared context system maintains state across Claude and Codex interactions.

### What Gets Stored

**Sessions:**
```json
{
  "sessionId": "abc-123-def",
  "createdAt": "2025-10-19T14:00:00Z",
  "source": "claude",
  "currentGoal": "Implement authentication system",
  "decisions": [...],
  "artifacts": [...],
  "history": [...]
}
```

**Decisions:**
```json
{
  "description": "Use PostgreSQL for persistence",
  "rationale": "Better for relational data, team familiar",
  "madeBy": "codex",
  "impact": "high",
  "timestamp": "2025-10-19T14:05:00Z"
}
```

**Artifacts:**
```json
{
  "type": "plan",
  "createdBy": "codex",
  "content": { /* full plan */ },
  "timestamp": "2025-10-19T14:10:00Z"
}
```

### Context Commands

```bash
# List all sessions
./shared-context/sync.sh list

# View session details
./shared-context/sync.sh summary <session-id>

# Backup sessions
./shared-context/sync.sh backup

# Clean old sessions (>7 days)
./shared-context/sync.sh clean
```

### Session IDs

When calling Codex tools, use session IDs for continuity:

```bash
# First call
/plan implement auth
→ Creates session abc-123
→ Stores plan artifact

# Later call
/reason which auth method? (sessionId: abc-123)
→ Accesses previous plan
→ Provides context-aware reasoning
```

---

## Hooks & Auto-Delegation

### How It Works

1. **User sends prompt** to Claude Code
2. **Pre-tool hook** intercepts
3. **Complexity detection** script analyzes prompt
4. **Score calculation** based on:
   - Architectural keywords
   - Planning language
   - Decision-making phrases
   - Multi-step indicators
   - Question marks
5. **Suggestion displayed** if score ≥ 3
6. **User decides** to delegate or proceed

### Complexity Indicators

| Category | Keywords | Score |
|----------|----------|-------|
| Architecture | design, architecture, structure, pattern | +1 each |
| Planning | plan, roadmap, strategy, phases, timeline | +1 each |
| Decision | should we, which is better, compare, versus | +1 each |
| Analysis | analyze, evaluate, assess, review | +1 each |
| Multi-step | step 1, then, next, after that, finally | +1 each |

### Example Detection

```
Prompt: "We need to design an authentication system. Should we use JWT
         or session-based? Create a detailed implementation plan."

Analysis:
- "design" → +1
- "should we use" → +1
- "plan" → +1
- Multiple sentences → +1
Total: 4 (suggests delegation)

Hook suggests: /reason, /plan
```

### Disabling Hooks

If you want to disable auto-delegation:

```json
// In ~/.claude/settings.json, remove:
"hooks": {
  "PreToolUse": [...]
}
```

---

## Workflows

### Workflow 1: Plan → Implement → Review

```
1. User: "Add payment processing with Stripe"

2. User: /plan
   → Codex generates plan:
     Phase 1: Setup Stripe SDK
     Phase 2: Create payment routes
     Phase 3: Handle webhooks
     Phase 4: Add error handling
     Phase 5: Write tests

3. Claude: "Ready to implement Phase 1?"

4. User: "Yes"

5. Claude: Implements Phase 1
   → Installs Stripe SDK
   → Configures API keys
   → Creates basic setup

6. User: /codex review Phase 1 for security
   → Codex analyzes via codex_analyze
   → Recommends improvements

7. Claude: Applies Codex recommendations

8. Repeat for Phases 2-5

9. Shared Context:
   ├── Plan artifact
   ├── Security review findings
   ├── Implementation decisions
   └── Complete audit trail
```

### Workflow 2: Reason → Decide → Spec → Implement

```
1. User: "We need a caching solution"

2. User: /reason compare Redis, Memcached, and in-memory
   → Codex analyzes:
     • Redis: Persistent, feature-rich, slower
     • Memcached: Fast, simple, no persistence
     • In-memory: Fastest, limited to single process
   → Recommends Redis for our use case

3. User: "Agreed, let's use Redis"

4. User: /spec Redis caching layer
   → Codex creates:
     • Requirements
     • Architecture
     • API design
     • Implementation plan

5. User: "Implement it"

6. Claude: Implements based on spec
   → Installs Redis client
   → Creates cache manager
   → Adds cache middleware
   → Writes tests

7. Shared Context:
   ├── Decision: Use Redis (with rationale)
   ├── Specification artifact
   ├── Implementation code
   └── Test results
```

### Workflow 3: Iterative Refinement

```
1. User: "Improve our API performance"

2. User: /codex analyze API performance
   → Codex identifies:
     • N+1 query issues
     • Missing indexes
     • Inefficient serialization

3. User: /plan address these performance issues
   → Codex creates prioritized plan

4. Claude: Implements fixes
   → Adds database indexes
   → Optimizes queries
   → Improves serialization

5. User: /codex analyze again
   → Codex verifies improvements
   → Confirms 80% latency reduction

6. Shared Context:
   ├── Initial analysis
   ├── Improvement plan
   ├── Implementation changes
   └── Verification results
```

---

## Troubleshooting

### MCP Server Not Found

**Problem:** Claude can't find Codex MCP tools

**Solution:**
```bash
# Verify MCP server built
ls codex-mcp-server/dist/index.js

# Rebuild if missing
cd codex-mcp-server && npm run build

# Check Claude settings
cat ~/.claude/settings.json | jq '.mcpServers'

# Restart Claude
claude
```

### Codex Authentication Errors

**Problem:** `OPENAI_API_KEY` not found

**Solution:**
```bash
# Verify API key set
echo $OPENAI_API_KEY

# Set if missing
export OPENAI_API_KEY="your-key"

# Make permanent
echo 'export OPENAI_API_KEY="your-key"' >> ~/.bashrc
```

### Hooks Not Triggering

**Problem:** Auto-delegation not suggesting Codex

**Solution:**
```bash
# Verify hooks installed
ls ~/.claude/hooks/hooks.json

# Link if missing
ln -s /path/to/cc-codex/hooks/hooks.json ~/.claude/hooks/

# Check hook script executable
chmod +x hooks/detect-complexity.py hooks/auto-delegate.sh

# Test hook manually
echo '{"user_message": "design authentication system"}' | python3 hooks/detect-complexity.py
```

### Shared Context Not Persisting

**Problem:** Session data not saved

**Solution:**
```bash
# Check directory exists
mkdir -p shared-context

# Verify permissions
chmod 755 shared-context

# Check for orphaned sessions
./shared-context/sync.sh list

# Clean if needed
./shared-context/sync.sh clean
```

---

## Best Practices

### When to Use Codex

✅ **DO delegate to Codex for:**
- Architectural decisions
- Technology comparisons
- Implementation planning
- Code analysis/review
- Complex problem decomposition
- Technical specifications

❌ **DON'T delegate to Codex for:**
- Simple code edits
- Quick bug fixes
- Renaming variables
- Adding comments
- Running tests
- Git operations

### Session Management

**Best Practices:**
- Use consistent session IDs for related work
- Include session IDs in Codex tool calls
- Backup sessions weekly: `./shared-context/sync.sh backup`
- Clean old sessions monthly: `./shared-context/sync.sh clean`

### Output Format

**For structured data:**
- Use MCP tools (codex_plan, codex_spec, etc.)
- Returns JSON for programmatic access

**For documentation:**
- Use CLI with output redirection
- `codex exec -m gpt-5 --full-auto "..." > docs/spec.md`

### Performance Tips

- **Parallel execution**: Multiple Codex calls can run in parallel
- **Caching**: Codex outputs stored in shared context, reuse when possible
- **Batch operations**: Combine related questions in single Codex call
- **Session reuse**: Link related tasks with session IDs

### Security

- Never commit API keys to git
- Use environment variables for keys
- Review Codex recommendations before implementing
- Validate security-critical decisions manually
- Keep audit trail via shared context

---

## Quick Reference

### Command Cheat Sheet

```bash
# Slash commands
/plan <task>          # Generate plan
/reason <question>    # Deep analysis
/spec <feature>       # Create spec
/codex <task>         # Auto-route

# CLI
codex exec -m gpt-5 --full-auto "task"

# Context management
./shared-context/sync.sh list
./shared-context/sync.sh summary <id>
./shared-context/sync.sh backup
./shared-context/sync.sh clean

# MCP server
cd codex-mcp-server && npm run build
node codex-mcp-server/dist/index.js
```

### Decision Matrix

| Task Complexity | Method | Tool |
|----------------|--------|------|
| Trivial | Direct Claude | - |
| Simple | Direct Claude | - |
| Medium | Slash command | `/plan`, `/reason` |
| Complex | MCP tool | `codex_*` |
| Very complex | CLI | `codex exec` |

---

## Next Steps

1. **Test the integration:**
   ```bash
   cd /path/to/your/project
   claude
   /plan implement a simple feature
   ```

2. **Try workflows:**
   - Plan → Implement
   - Reason → Decide → Implement
   - Spec → Plan → Implement

3. **Explore shared context:**
   ```bash
   ./shared-context/sync.sh list
   ```

4. **Customize:**
   - Add your own slash commands
   - Modify complexity detection
   - Create custom MCP tools

---

## Support & Resources

- **CLAUDE.md**: Instructions for Claude Code
- **AGENTS.md**: Instructions for Codex
- **Full Docs**: See `openai-codex-cli-docs.md`
- **Commands**: See `codex-cli-commands-cheatsheet.md`

---

**Version:** 1.0.0
**Integration Complete:** Claude Code + Codex working as a unified AI development system
