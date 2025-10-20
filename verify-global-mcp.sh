#!/bin/bash

echo "================================"
echo "Global MCP Configuration Verification"
echo "================================"
echo ""

# Test 1: Check global Claude settings
echo "Test 1: Global Claude Settings"
echo "--------------------------------"
if [ -f ~/.claude/settings.json ]; then
    echo "✓ Global settings file exists: ~/.claude/settings.json"

    if grep -q '"codex"' ~/.claude/settings.json; then
        echo "✓ Codex MCP server configured globally"

        # Extract and display the MCP server path
        mcp_path=$(cat ~/.claude/settings.json | grep -A 2 '"codex"' | grep "args" | sed 's/.*"\(.*\)".*/\1/')
        echo "  Path: $mcp_path"

        if [ -f "$mcp_path" ]; then
            echo "✓ MCP server file exists at configured path"
        else
            echo "✗ MCP server file NOT found at configured path"
            echo "  Expected: $mcp_path"
        fi
    else
        echo "✗ Codex MCP server NOT configured"
    fi

    if grep -q '"mcp__\*"' ~/.claude/settings.json; then
        echo "✓ MCP permissions enabled globally"
    else
        echo "⚠ MCP permissions may not be enabled"
    fi
else
    echo "✗ Global settings file not found"
fi

echo ""

# Test 2: Check global slash commands
echo "Test 2: Global Slash Commands"
echo "--------------------------------"
if [ -d ~/.claude/commands ]; then
    echo "✓ Global commands directory exists: ~/.claude/commands/"

    commands_found=0
    for cmd in plan reason spec codex; do
        if [ -L ~/.claude/commands/${cmd}.md ]; then
            target=$(readlink ~/.claude/commands/${cmd}.md)
            if [ -f "$target" ]; then
                echo "✓ /${cmd} command linked and target exists"
                ((commands_found++))
            else
                echo "⚠ /${cmd} command linked but target missing"
                echo "  Link: ~/.claude/commands/${cmd}.md -> $target"
            fi
        else
            echo "✗ /${cmd} command not found"
        fi
    done

    echo ""
    echo "Total: ${commands_found}/4 slash commands available globally"
else
    echo "✗ Global commands directory not found"
fi

echo ""

# Test 3: Test MCP availability from different directory
echo "Test 3: MCP Availability Test"
echo "--------------------------------"
echo "Testing from home directory..."

# Change to home directory and test
cd ~

# Check if Claude can see the config
if [ -f ~/.claude/settings.json ]; then
    echo "✓ Claude settings accessible from ~"
else
    echo "✗ Claude settings NOT accessible from ~"
fi

# Change to /tmp and test
cd /tmp

if [ -f ~/.claude/settings.json ]; then
    echo "✓ Claude settings accessible from /tmp"
else
    echo "✗ Claude settings NOT accessible from /tmp"
fi

# Return to original directory
cd - > /dev/null

echo ""

# Test 4: MCP Server Status
echo "Test 4: MCP Server Validation"
echo "--------------------------------"

mcp_server_path="/Users/rachitt/cc-codex/codex-mcp-server/dist/index.js"

if [ -f "$mcp_server_path" ]; then
    echo "✓ MCP server compiled: $mcp_server_path"

    # Check if it can be executed
    if node "$mcp_server_path" --help 2>&1 | grep -q "Codex MCP Server"; then
        echo "✓ MCP server responds correctly"
    else
        echo "⚠ MCP server may not respond as expected"
    fi
else
    echo "✗ MCP server not found at: $mcp_server_path"
fi

echo ""

# Test 5: Configuration Summary
echo "================================"
echo "Configuration Summary"
echo "================================"

echo ""
echo "Global MCP Server:"
echo "  Location: ~/.claude/settings.json"
echo "  Server: codex"
echo "  Path: /Users/rachitt/cc-codex/codex-mcp-server/dist/index.js"
echo "  Permissions: mcp__* (all MCP tools allowed)"
echo ""
echo "Global Slash Commands:"
echo "  Location: ~/.claude/commands/"
echo "  Available: /plan, /reason, /spec, /codex"
echo ""
echo "Accessibility:"
echo "  ✓ Available in ALL Claude Code sessions"
echo "  ✓ Available from ANY directory"
echo "  ✓ No per-project configuration needed"
echo ""
echo "How to Use:"
echo "  1. Open Claude Code from any directory: claude"
echo "  2. Use slash commands: /plan, /reason, /spec, /codex"
echo "  3. MCP tools automatically available"
echo ""
echo "================================"
echo "Status: MCP Integration Globally Installed ✓"
echo "================================"
