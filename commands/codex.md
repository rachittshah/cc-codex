---
allowed-tools: mcp__codex__*
description: Execute custom Codex task (reason, plan, spec, analyze, compare)
---

# Execute Custom Codex Task

## Your task

You are receiving a request to execute a custom Codex task. Determine which Codex tool is most appropriate and execute it.

### Available Codex Tools

1. **codex_reason**: Deep reasoning, trade-off analysis, decision-making
2. **codex_plan**: Implementation planning, project roadmaps
3. **codex_spec**: Technical specifications, documentation
4. **codex_analyze**: Code/architecture analysis, security/performance review
5. **codex_compare**: Compare multiple options/technologies

### Steps

1. **Analyze Request**: Determine which Codex tool matches the request
   - Keywords like "plan" → codex_plan
   - Keywords like "should we" → codex_reason
   - Keywords like "specification" → codex_spec
   - Keywords like "analyze" → codex_analyze
   - Keywords like "compare" → codex_compare

2. **Execute Codex Tool**: Call the appropriate tool with proper parameters

3. **Present Results**: Format and present the Codex output clearly

4. **Follow Up**: Suggest next steps based on the output

### Example Usage

User: "/codex compare Redis vs Memcached for our caching layer"

Expected flow:
1. Detect: This is a comparison task
2. Call codex_compare with options ["Redis", "Memcached"]
3. Receive structured comparison
4. Present formatted comparison
5. Ask: "Based on this comparison, shall we proceed with [recommendation]?"

### Task Type Detection

```
"plan" | "roadmap" | "timeline" | "phases"
  → codex_plan

"should we" | "which is better" | "decide" | "reason"
  → codex_reason

"spec" | "specification" | "document" | "requirements"
  → codex_spec

"analyze" | "review" | "audit" | "examine"
  → codex_analyze

"compare" | "versus" | "vs" | "which one"
  → codex_compare
```

### Notes

- This is a meta-command that routes to specific Codex tools
- All Codex tools use gpt-5 with high reasoning effort
- Results are stored in shared session context
- Can chain multiple Codex calls if needed

### Example Scenarios

**Scenario 1: Architecture Decision**
```
User: /codex should we use microservices or monolith?
→ Use codex_reason
```

**Scenario 2: Feature Planning**
```
User: /codex plan the implementation of real-time chat
→ Use codex_plan
```

**Scenario 3: Code Review**
```
User: /codex analyze the authentication code for security issues
→ Use codex_analyze with focusAreas: ["security"]
```

**Scenario 4: Technology Selection**
```
User: /codex compare PostgreSQL, MySQL, and MongoDB
→ Use codex_compare with options
```

### Output

After executing the Codex tool, present results in a clear format and ask:

```markdown
# Codex [Tool] Results

[Formatted output from the tool]

---

Next steps:
1. [Suggested action based on results]
2. [Alternative action]

What would you like to do?
```
