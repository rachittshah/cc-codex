---
allowed-tools: mcp__codex__codex_plan
description: Generate detailed implementation plan using Codex gpt-5
---

# Generate Implementation Plan

## Your task

You are receiving a request to create a detailed implementation plan using Codex's deep reasoning capabilities.

### Steps

1. **Understand the Task**: Extract the core task/feature to be planned from the user's request

2. **Call Codex Planning Tool**:
   - Use the `mcp__codex__codex_plan` tool
   - Provide clear task description
   - Include any constraints or timeline information
   - Pass session ID if available for context sharing

3. **Process the Plan**:
   - Parse the structured plan output from Codex
   - Present it in a clear, readable format
   - Highlight key phases and next steps
   - Note any risks or dependencies

4. **Ask for Feedback**:
   - Ask if the user wants to proceed with implementation
   - Offer to refine the plan if needed
   - Suggest starting with the first phase/step

### Example Usage

User: "/plan implement user authentication system"

Expected flow:
1. Call codex_plan with: "implement user authentication system"
2. Receive structured plan with phases, steps, timeline
3. Present plan to user with clear sections
4. Ask: "Would you like me to start implementing Phase 1?"

### Notes

- This delegates planning to Codex (gpt-5 with high reasoning)
- Claude Code (you) will handle the actual implementation
- The plan becomes a shared artifact in the session context
- Use the plan to guide step-by-step implementation

### Output Format

Present the plan like this:

```markdown
# Implementation Plan: [Task Name]

## Overview
[High-level summary]

## Phase 1: [Name]
**Steps**:
1. [Step description] (est: [duration])
   - Dependencies: [if any]
   - Risks: [if any]

[... more steps ...]

## Technologies Required
- [Tech 1]
- [Tech 2]

## Timeline
[Overall estimate]

## Risks
- [Risk 1]
- [Risk 2]

## Next Steps
1. [Immediate action 1]
2. [Immediate action 2]

---

Ready to proceed with Phase 1? I can start implementing now.
```
