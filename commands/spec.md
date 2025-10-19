---
allowed-tools: mcp__codex__codex_spec
description: Create technical specification using Codex gpt-5
---

# Create Technical Specification

## Your task

You are receiving a request to create a comprehensive technical specification using Codex.

### Steps

1. **Gather Requirements**: Extract the feature/system to specify and any requirements

2. **Call Codex Specification Tool**:
   - Use the `mcp__codex__codex_spec` tool
   - Provide title and description
   - Include requirements list if available
   - Pass session ID for context

3. **Process the Spec**:
   - Parse the structured specification
   - Present in a clear, professional format
   - Include all sections: requirements, architecture, API, implementation
   - Make it implementation-ready

4. **Validate with User**:
   - Ask if the spec is complete
   - Offer to refine specific sections
   - Suggest saving as documentation
   - Propose starting implementation

### Example Usage

User: "/spec create a specification for rate limiting middleware"

Expected flow:
1. Call codex_spec with title and description
2. Receive comprehensive spec with architecture, API, implementation plan
3. Present formatted specification
4. Ask: "Spec complete. Shall I implement this now?"

### Notes

- Use for documenting new features/systems
- Spec becomes the source of truth
- Can be saved as .md file in docs/
- Reference during implementation

### Output Format

Present the specification like this:

```markdown
# Technical Specification: [Title]

## Overview
[High-level description]

## Requirements

### Functional Requirements
1. [Requirement 1]
2. [Requirement 2]

### Non-Functional Requirements
1. [Performance requirement]
2. [Security requirement]
3. [Scalability requirement]

## Architecture

### Components

#### [Component 1]
**Responsibilities**:
- [Responsibility 1]
- [Responsibility 2]

#### [Component 2]
[... same structure ...]

### Data Flow
[Description of how data flows through the system]

### External Integrations
- [Integration 1]
- [Integration 2]

## API Design

### Endpoint: [METHOD] /path
**Description**: [What it does]

**Request**:
```json
{
  "field": "type"
}
```

**Response**:
```json
{
  "result": "data"
}
```

## Implementation

### Phases
1. [Phase 1 description]
2. [Phase 2 description]

### Technologies
- [Technology 1]
- [Technology 2]

### Estimated Effort
[Time estimate]

---

Specification complete. Would you like me to:
1. Save this as docs/[filename].md
2. Start implementing Phase 1
3. Refine any section
```
