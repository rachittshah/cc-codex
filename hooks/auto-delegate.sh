#!/bin/bash

# Auto-Delegation Hook for Claude Code
# Automatically triggers Codex delegation when complexity is detected

set -e

# Read input from stdin
input=$(cat)

# Extract tool name and input
tool_name=$(echo "$input" | jq -r '.tool_name // ""')
tool_input=$(echo "$input" | jq -r '.tool_input // {}')

# Only process user messages (not tool executions)
if [ "$tool_name" != "" ]; then
    exit 0
fi

# Extract user message
user_message=$(echo "$input" | jq -r '.user_message // ""')

if [ -z "$user_message" ]; then
    exit 0
fi

# Run complexity detection
detection_result=$(echo "$input" | python3 "$(dirname "$0")/detect-complexity.py" 2>&1 || echo "{}")

# Parse detection result
should_delegate=$(echo "$detection_result" | jq -r '.should_delegate // false')
complexity_score=$(echo "$detection_result" | jq -r '.complexity_score // 0')
confidence=$(echo "$detection_result" | jq -r '.confidence // "low"')

# If complexity is high, suggest delegation
if [ "$should_delegate" = "true" ] && [ "$confidence" != "low" ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >&2
    echo "🤖 Codex Delegation Suggested" >&2
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >&2
    echo "" >&2
    echo "Complexity Score: $complexity_score" >&2
    echo "Confidence: $confidence" >&2
    echo "" >&2
    echo "This task appears complex and may benefit from:" >&2
    echo "  • Deep reasoning with Codex gpt-5" >&2
    echo "  • Structured planning" >&2
    echo "  • Multiple approach comparison" >&2
    echo "" >&2
    echo "To delegate to Codex, use one of:" >&2
    echo "  /plan    - Generate implementation plan" >&2
    echo "  /reason  - Deep reasoning analysis" >&2
    echo "  /spec    - Technical specification" >&2
    echo "  /codex   - Custom Codex task" >&2
    echo "" >&2
    echo "Or continue with Claude Code for direct implementation." >&2
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >&2
fi

# Always exit 0 - don't block execution
exit 0
