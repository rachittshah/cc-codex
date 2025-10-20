#!/bin/bash

echo "========================================"
echo "Global Access Verification"
echo "========================================"
echo ""

# Test from multiple directories to verify global access
test_directories=(
    "$HOME"
    "/tmp"
    "/Users"
)

all_tests_passed=true

for dir in "${test_directories[@]}"; do
    echo "Testing from: $dir"
    echo "----------------------------------------"

    cd "$dir" || continue

    # Test 1: Codex accessible
    if codex --version > /dev/null 2>&1; then
        echo "✓ codex command available"
    else
        echo "✗ codex command NOT available"
        all_tests_passed=false
    fi

    # Test 2: Claude accessible
    if claude --version > /dev/null 2>&1; then
        echo "✓ claude command available"
    else
        echo "✗ claude command NOT available"
        all_tests_passed=false
    fi

    # Test 3: Claude settings accessible
    if [ -f ~/.claude/settings.json ]; then
        if grep -q '"codex"' ~/.claude/settings.json; then
            echo "✓ MCP server configured globally"
        else
            echo "✗ MCP server NOT configured"
            all_tests_passed=false
        fi
    else
        echo "✗ Claude settings NOT found"
        all_tests_passed=false
    fi

    # Test 4: Slash commands accessible
    if [ -d ~/.claude/commands ]; then
        cmd_count=$(ls ~/.claude/commands/*.md 2>/dev/null | wc -l | tr -d ' ')
        if [ "$cmd_count" -ge 4 ]; then
            echo "✓ Slash commands available ($cmd_count commands)"
        else
            echo "⚠ Only $cmd_count slash commands found"
        fi
    else
        echo "✗ Commands directory NOT found"
        all_tests_passed=false
    fi

    echo ""
done

echo "========================================"
echo "Path Information"
echo "========================================"
echo ""
echo "Codex location:"
which codex

echo ""
echo "Claude location:"
which claude

echo ""
echo "MCP server:"
echo "~/.claude/settings.json → /Users/rachitt/cc-codex/codex-mcp-server/dist/index.js"

echo ""
echo "Slash commands:"
echo "~/.claude/commands/ → /Users/rachitt/cc-codex/commands/"

echo ""
echo "========================================"
echo "Usage Examples"
echo "========================================"
echo ""
echo "From ANY directory, you can:"
echo ""
echo "1. Use Codex directly:"
echo "   codex exec -m gpt-5 --full-auto \"your reasoning task\""
echo ""
echo "2. Use Claude with slash commands:"
echo "   claude"
echo "   /plan implement feature"
echo "   /reason compare options"
echo "   /spec create documentation"
echo ""
echo "3. Both CLIs available in PATH:"
echo "   codex --version"
echo "   claude --version"
echo ""

if [ "$all_tests_passed" = true ]; then
    echo "========================================"
    echo "Status: ALL GLOBALLY ACCESSIBLE ✓"
    echo "========================================"
    exit 0
else
    echo "========================================"
    echo "Status: SOME ISSUES DETECTED ✗"
    echo "========================================"
    exit 1
fi
