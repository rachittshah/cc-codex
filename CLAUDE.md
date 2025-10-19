# Claude Code + Codex Integration

> **Role**: Claude Code delegates reasoning, planning, and specification tasks to Codex CLI using `gpt-5` model with high reasoning effort

---

## Core Directive

When Claude Code needs to:
- **Reason through complex problems**
- **Plan multi-step implementations**
- **Create detailed specifications**
- **Analyze architectural decisions**

**→ Delegate to Codex CLI using `gpt-5` model**

**Note**: The high reasoning effort is automatically enabled via `model_reasoning_effort = "high"` in `~/.codex/config.toml`

---

## Usage Pattern

### When to Call Codex

Call Codex for:
1. **Deep reasoning** - Complex logic, trade-offs, decision trees
2. **Planning** - Breaking down features into actionable steps
3. **Specification** - Creating detailed technical specs
4. **Analysis** - Code architecture, performance, security reviews
5. **Design decisions** - Comparing multiple approaches

### When NOT to Call Codex

Do NOT call Codex for:
- Simple code edits or file operations
- Direct execution of known tasks
- Quick lookups or simple questions
- File reading/writing operations

---

## Required Command Format

Always use this exact format:

```bash
codex exec -m gpt-5 --full-auto "YOUR_REASONING_TASK_HERE"
```

### Command Breakdown

- `codex exec` - Non-interactive execution
- `-m gpt-5` - **REQUIRED**: Use GPT-5 reasoning model
- `--full-auto` - Automatic execution with workspace write access
- `"TASK"` - Clear, specific reasoning/planning task

**Note**: High reasoning effort is automatically applied based on your `~/.codex/config.toml` setting

---

## Integration Rules

### 1. Model Requirement
```bash
# ✅ CORRECT - Always use gpt-5
codex exec -m gpt-5 --full-auto "reason through this problem"

# ❌ WRONG - Never omit model flag
codex exec --full-auto "reason through this problem"
```

### 2. Task Clarity
```bash
# ✅ CORRECT - Specific reasoning task
codex exec -m gpt-5 --full-auto "analyze three approaches for implementing user authentication: JWT, session-based, and OAuth2. Compare security, scalability, and complexity."

# ❌ WRONG - Vague request
codex exec -m gpt-5 --full-auto "help with auth"
```

### 3. Output Handling
```bash
# Capture output for further processing
codex exec -m gpt-5 --json "create implementation plan for feature X" > plan.jsonl

# Get plain text output
codex exec -m gpt-5 --full-auto "reason through approach" > reasoning.txt
```

---

## Example Workflows

### 1. Feature Planning

```bash
# Claude Code delegates planning to Codex
codex exec -m gpt-5 --full-auto "Plan implementation for real-time notifications system. Break down into: 1) Backend architecture, 2) Frontend components, 3) Testing strategy, 4) Deployment steps. Include dependencies and timeline estimates."
```

### 2. Architectural Reasoning

```bash
# Complex decision requires deep reasoning
codex exec -m gpt-5 --full-auto "Analyze whether to use microservices vs monolith for our e-commerce platform. Consider: current team size (5 devs), expected scale (10k users/month), complexity (payment processing, inventory), timeline (3 months MVP). Provide recommendation with reasoning."
```

### 3. Specification Creation

```bash
# Generate detailed technical spec
codex exec -m gpt-5 --full-auto "Create detailed API specification for user management service. Include: endpoints, request/response schemas, authentication, error handling, rate limiting, and validation rules. Follow OpenAPI 3.0 format."
```

### 4. Code Analysis

```bash
# Security and performance analysis
codex exec -m gpt-5 --full-auto "Analyze the codebase for security vulnerabilities and performance bottlenecks. Focus on: SQL injection risks, XSS vulnerabilities, N+1 queries, memory leaks. Provide prioritized list with remediation steps."
```

### 5. Problem Decomposition

```bash
# Break down complex problem
codex exec -m gpt-5 --full-auto "Decompose the task of migrating from MongoDB to PostgreSQL. Create step-by-step plan covering: schema design, data migration strategy, query refactoring, testing approach, rollback plan, and zero-downtime deployment."
```

---

## Workflow Integration

### Step 1: Receive Complex Task from User
```
User: "I need to implement a caching layer for our API"
```

### Step 2: Claude Code Identifies Need for Reasoning
```
Claude recognizes: This requires architectural decisions, not just coding
```

### Step 3: Delegate to Codex
```bash
codex exec -m gpt-5 --full-auto "Design a caching layer for REST API. Analyze options: Redis vs Memcached vs in-memory. Consider: data consistency, invalidation strategy, distributed caching, TTL policies. Recommend solution with implementation plan."
```

### Step 4: Codex Returns Reasoning/Plan
```
Codex provides: Detailed analysis → Recommendation → Implementation steps
```

### Step 5: Claude Code Executes Implementation
```
Claude uses the plan to write code, configure systems, run tests
```

---

## Output Processing

### JSON Output for Structured Data

```bash
# Get structured plan
codex exec -m gpt-5 --json "create implementation roadmap" > roadmap.jsonl

# Parse in subsequent commands
cat roadmap.jsonl | jq -r '.content'
```

### Plain Text for Documentation

```bash
# Generate spec document
codex exec -m gpt-5 --full-auto "write technical specification" > docs/spec.md
```

---

## Configuration

### Model Override (When Needed)

```bash
# Force specific model via config
codex exec -c model="gpt-5" --full-auto "reasoning task"
```

### Sandbox Settings

```bash
# Read-only analysis
codex exec -m gpt-5 --sandbox read-only "analyze codebase structure"

# Workspace write for planning that creates files
codex exec -m gpt-5 --sandbox workspace-write "create architecture diagrams"
```

---

## Error Handling

### If Codex Fails

```bash
# Check Codex status
codex --version

# Verify authentication
printenv OPENAI_API_KEY

# Retry with explicit config
codex exec -c model="gpt-5" --full-auto "task"
```

### Fallback Strategy

If `codex exec` fails:
1. Verify Codex installation: `which codex`
2. Check API key: `printenv OPENAI_API_KEY`
3. Try simpler task to test connectivity
4. Fall back to Claude Code's own reasoning (less optimal)

---

## Complete Documentation

For comprehensive Codex CLI documentation, see:

- **Full Docs**: [`./openai-codex-cli-docs.md`](./openai-codex-cli-docs.md)
- **Command Reference**: [`./codex-cli-commands-cheatsheet.md`](./codex-cli-commands-cheatsheet.md)
- **Setup Script**: [`./setup-codex.sh`](./setup-codex.sh)

---

## Quick Reference

### Essential Command
```bash
codex exec -m gpt-5 --full-auto "REASONING_TASK"
```

### Common Flags
- `-m gpt-5` - **REQUIRED**: GPT-5 reasoning model (high effort auto-enabled)
- `--full-auto` - Auto-approve actions with workspace write
- `--json` - Output as JSONL for parsing
- `--sandbox read-only` - Read-only mode for analysis
- `-o plan.md` - Save output to file

### Decision Tree
```
Complex task → Need reasoning? → YES → codex exec -m gpt-5
                                → NO  → Claude Code handles directly
```

---

## Enforcement Rules

1. **ALWAYS** use `-m gpt-5` when calling Codex for planning/reasoning tasks
2. **ALWAYS** provide clear, specific reasoning tasks
3. **NEVER** use Codex for simple file operations
4. **NEVER** omit the model flag
5. **ALWAYS** delegate complex reasoning to Codex
6. **ALWAYS** use `--full-auto` for planning/reasoning tasks
7. **VERIFY** Codex output before proceeding with implementation

---

**Remember**: Codex with `gpt-5` (high reasoning effort) is your reasoning partner. Claude Code executes, Codex reasons.
