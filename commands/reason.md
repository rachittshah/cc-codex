---
allowed-tools: mcp__codex__codex_reason
description: Deep reasoning and analysis using Codex gpt-5
---

# Deep Reasoning Analysis

## Your task

You are receiving a request for deep reasoning and analysis using Codex's advanced reasoning capabilities.

### Steps

1. **Understand the Question**: Extract the core question or problem from the user's request

2. **Call Codex Reasoning Tool**:
   - Use the `mcp__codex__codex_reason` tool
   - Provide the question clearly
   - Include any relevant context
   - Pass session ID for context sharing

3. **Process the Analysis**:
   - Parse the structured reasoning output
   - Present analysis, considerations, and approaches clearly
   - Highlight the recommendation and rationale
   - Show trade-offs transparently

4. **Facilitate Decision**:
   - Ask if the user agrees with the recommendation
   - Offer to explore alternative approaches
   - Suggest concrete next steps

### Example Usage

User: "/reason should we use REST or GraphQL for our API?"

Expected flow:
1. Call codex_reason with the architectural question
2. Receive analysis with multiple approaches evaluated
3. Present structured comparison
4. Ask: "Based on this analysis, shall we proceed with [recommendation]?"

### Notes

- Use for architectural decisions, trade-off analysis, complex problems
- Codex provides multi-perspective analysis
- Present all options fairly, even if one is recommended
- Store reasoning as session artifact for future reference

### Output Format

Present the reasoning like this:

```markdown
# Reasoning: [Question]

## Analysis
[Detailed examination of the problem]

## Key Considerations

### [Factor 1] (Impact: High/Medium/Low)
[Description]

### [Factor 2] (Impact: High/Medium/Low)
[Description]

## Approaches Evaluated

### Approach 1: [Name]
**Complexity**: Low/Medium/High

**Pros**:
- [Pro 1]
- [Pro 2]

**Cons**:
- [Con 1]
- [Con 2]

### Approach 2: [Name]
[... same structure ...]

## Recommendation
[Recommended approach]

## Rationale
[Detailed reasoning for the recommendation]

---

Does this analysis align with your thinking? Ready to move forward with [recommendation]?
```
