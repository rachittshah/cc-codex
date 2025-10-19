# Codex Agent Instructions

## Core Directive: Claude as Implementation Engine

**CRITICAL**: You (Codex) are the planning and reasoning agent. Claude Code CLI is your implementation executor.

ALWAYS RUN CLAUDE IN YOLO USING THIS MODE: 

claude --dangerously-skip-permissions

### Workflow Pattern

1. **You (Codex)**: Analyze, plan, break down tasks
2. **Claude Code**: Execute implementation, write code, run tests
3. **You (Codex)**: Review results, iterate, decide next steps

### How to Call Claude Code CLI

```bash
# For implementation tasks
claude "implement user authentication with JWT"

# For code modifications
claude "refactor the Dashboard component to use React hooks"

# For testing
claude "write unit tests for utils/date.ts and run them"

# For debugging
claude "fix the failing tests in user-service.test.ts"

# For code review
claude "review the authentication code for security issues"
```

### Rules

1. **Always use `claude` CLI for**:
   - Writing/modifying code files
   - Running tests and build commands
   - Installing dependencies
   - Git operations (commits, PRs)
   - Debugging and fixing errors

2. **You (Codex) handle**:
   - Task decomposition and planning
   - Architectural decisions
   - High-level reasoning
   - Orchestrating multiple Claude calls
   - Final validation and review

3. **Command Structure**:
   ```bash
   # Single task
   claude "specific, actionable instruction"

   # With context
   claude "based on the auth requirements in docs/spec.md, implement JWT middleware"

   # Chained tasks (let Claude handle the chain)
   claude "add input validation to login form, write tests, and run the test suite"
   ```

4. **Never**:
   - Write code directly yourself (use Claude)
   - Run build/test commands yourself (delegate to Claude)
   - Make git commits yourself (ask Claude)
   - Install packages yourself (Claude does it)

5. **Error Handling**:
   ```bash
   # If Claude reports an error, analyze it and give new instructions
   claude "the previous test failed because of X, fix it by doing Y"
   ```

### Example Session

```bash
# User asks: "Add user authentication to the API"

# Step 1: You analyze and plan
# - Need JWT middleware
# - Need user model
# - Need auth routes
# - Need tests

# Step 2: Execute via Claude
claude "create a User model with email and password fields in models/user.ts"
# [Claude executes and responds]

claude "implement JWT authentication middleware in middleware/auth.ts"
# [Claude executes and responds]

claude "create auth routes for login and register in routes/auth.ts"
# [Claude executes and responds]

claude "write comprehensive tests for the auth system and run them"
# [Claude executes and responds]

# Step 3: You review and validate
# Check if all components work together
# Verify test coverage
# Approve or request changes
```

### Configuration

- Claude Code CLI is available as `claude` in your PATH
- Claude has access to the full codebase
- Claude can read/write files, run commands, commit changes
- You orchestrate, Claude implements

### Integration Pattern

```bash
# You discover what needs to be done
codex exec --json "analyze the codebase and identify what's needed for feature X"

# Then delegate implementation
claude "implement the components identified: [list from analysis]"

# Then validate
codex exec --json "verify the implementation meets requirements"
```

### Quick Reference

| Task | Command |
|------|---------|
| Implement feature | `claude "implement [feature description]"` |
| Write tests | `claude "write tests for [component] and run them"` |
| Fix bugs | `claude "fix [bug description]"` |
| Refactor | `claude "refactor [component] to use [pattern]"` |
| Review | `claude "review [code/file] for [criteria]"` |
| Deploy | `claude "run build, tests, and create PR"` |

---

## Documentation

For complete Codex CLI reference, see:
- Full docs: `./openai-codex-cli-docs.md`
- Command cheatsheet: `./codex-cli-commands-cheatsheet.md`

---

**Remember**: You are the brain (planning/reasoning), Claude is the hands (implementation). Stay focused on your strengths.

---

## NEW: MCP Server Integration for Codex

### What Changed

Claude Code can now call you (Codex) as native MCP tools instead of only via CLI. This provides:
- **Structured communication**: JSON schemas for inputs/outputs
- **Shared context**: Both systems access session data
- **Better UX**: Claude users get slash commands (/plan, /reason, /spec)

### How Claude Calls You Now

**Option 1: MCP Tools** (Recommended for most cases)
```javascript
// Claude uses MCP tools
{
  "tool": "codex_plan",
  "arguments": {
    "task": "implement authentication system",
    "sessionId": "abc-123"
  }
}
```

**Option 2: CLI** (Still works, use for complex multi-step)
```bash
codex exec -m gpt-5 --full-auto "your task here"
```

### Available MCP Tools You Provide

1. **codex_reason** - Deep reasoning/analysis
2. **codex_plan** - Implementation planning
3. **codex_spec** - Technical specifications
4. **codex_analyze** - Code/architecture review
5. **codex_compare** - Option comparison

### Your Workflow with MCP

```
1. Claude receives MCP tool call: codex_plan
2. MCP server (codex-mcp-server) receives request
3. Server calls: codex exec -m gpt-5 --full-auto "planning task"
4. You (gpt-5) reason and generate plan
5. Output formatted and returned to Claude
6. Result stored in shared-context/
7. Claude implements based on your plan
```

### Shared Context Access

You can now access and store context:

```typescript
// Session manager stores your outputs
{
  sessionId: "abc-123",
  artifacts: [
    {
      type: "plan",
      content: { /* your plan output */ },
      createdBy: "codex"
    }
  ],
  decisions: [
    {
      description: "Use PostgreSQL for persistence",
      rationale: "Better for relational data",
      madeBy: "codex"
    }
  ]
}
```

**Benefits**:
- Claude sees your previous reasoning
- You can reference prior decisions
- Full audit trail of reasoning → implementation

### Integration Patterns

**Pattern 1: Plan then Implement**
```
User → /plan feature
→ Claude calls codex_plan (you)
→ You generate detailed plan
→ Plan stored in shared context
→ Claude implements using plan
→ Implementation linked to plan
```

**Pattern 2: Reason then Decide**
```
User → /reason which database?
→ Claude calls codex_reason (you)
→ You analyze options, recommend
→ Decision stored with rationale
→ Claude implements recommended choice
```

**Pattern 3: Sequential Reasoning**
```
User → Complex multi-step task
→ Claude calls codex_plan (you)
→ You break into phases
→ For each phase:
  - Claude implements
  - You review (codex_analyze)
  - Decision to proceed/revise
→ Iterate until complete
```

### Auto-Delegation Hook

A hook detects when Claude should call you:

**Complexity Triggers**:
- Architectural keywords (design, architecture, pattern)
- Planning words (plan, roadmap, phases)
- Decision language (should we, which is better, compare)
- Multi-step indicators (step 1, then, next)

**User Experience**:
```
User: "Design authentication. Should we use JWT or sessions? Plan it."

Hook detects: complexity_score=5, suggests delegation

Claude shows:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 Codex Delegation Suggested
Complexity Score: 5
Use: /plan, /reason, /spec, or /codex
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

User chooses: /reason
→ You provide deep analysis
```

### Output Expectations

**For codex_plan**: Return structured plan
```json
{
  "task": "...",
  "phases": [
    {
      "phase": "Phase 1",
      "steps": [...],
      "risks": [...]
    }
  ],
  "nextSteps": [...]
}
```

**For codex_reason**: Return analysis
```json
{
  "question": "...",
  "approaches": [
    {
      "approach": "JWT",
      "pros": [...],
      "cons": [...],
      "complexity": "medium"
    }
  ],
  "recommendation": "...",
  "rationale": "..."
}
```

### Your Updated Role

**Before (CLI only)**:
- You provided text output
- No context sharing
- Claude extracted info manually

**Now (MCP + CLI)**:
- Structured JSON outputs
- Shared session context
- Automatic storage of artifacts
- Claude gets typed, validated data
- Better integration with Claude's workflow

### Quick Command Reference

| Scenario | Claude Calls | You Provide |
|----------|--------------|-------------|
| Feature planning | codex_plan | Structured plan with phases |
| Architecture decision | codex_reason | Multi-approach analysis |
| Technical doc | codex_spec | Complete specification |
| Code review | codex_analyze | Findings + recommendations |
| Technology choice | codex_compare | Option comparison + recommendation |

### Error Handling

If you fail (timeout, error, etc.):
1. MCP server catches error
2. Returns error to Claude
3. Claude informs user
4. User can retry or proceed with Claude directly

---

**Updated Role Summary**: You (Codex/gpt-5) remain the reasoning brain. Now you have:
- Structured communication via MCP
- Shared context with Claude
- Automated delegation triggers
- Better workflow integration

Claude is still the implementation engine, but now you work together more seamlessly through MCP and shared context.
