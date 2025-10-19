#!/bin/bash

# Setup script for Codex + Claude Code integration
set -e

echo "🚀 Setting up Codex + Claude Code Integration"
echo ""

# Check if Codex is installed
if ! command -v codex &> /dev/null; then
    echo "❌ Codex CLI not found. Installing..."
    npm install -g @openai/codex
    echo "✅ Codex installed"
else
    echo "✅ Codex CLI found: $(codex --version)"
fi

# Check if Claude is installed
if ! command -v claude &> /dev/null; then
    echo "⚠️  Claude Code CLI not found in PATH"
    echo "   Please install Claude Code manually:"
    echo "   - macOS: brew install claude-code"
    echo "   - Or follow: https://docs.claude.com/claude-code"
else
    echo "✅ Claude Code CLI found"
fi

# Create Codex config directory if it doesn't exist
CODEX_CONFIG_DIR="$HOME/.codex"
if [ ! -d "$CODEX_CONFIG_DIR" ]; then
    echo "📁 Creating Codex config directory: $CODEX_CONFIG_DIR"
    mkdir -p "$CODEX_CONFIG_DIR"
fi

# Copy AGENTS.md to global Codex config
AGENTS_SOURCE="./AGENTS.md"
AGENTS_DEST="$CODEX_CONFIG_DIR/AGENTS.md"

if [ -f "$AGENTS_DEST" ]; then
    echo "⚠️  $AGENTS_DEST already exists"
    read -p "   Overwrite? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp "$AGENTS_SOURCE" "$AGENTS_DEST"
        echo "✅ Updated global AGENTS.md"
    else
        echo "⏭️  Skipped updating AGENTS.md"
    fi
else
    cp "$AGENTS_SOURCE" "$AGENTS_DEST"
    echo "✅ Copied AGENTS.md to global config"
fi

# Create basic config.toml if it doesn't exist
CONFIG_FILE="$CODEX_CONFIG_DIR/config.toml"
if [ ! -f "$CONFIG_FILE" ]; then
    echo "📝 Creating basic config.toml"
    cat > "$CONFIG_FILE" << 'EOF'
# Codex + Claude Code Configuration

# Default model
model = "gpt-5-codex"

# Approval policy: "suggest", "on-failure", "on-request", "never"
approval_policy = "on-request"

# Sandbox mode: "read-only", "workspace-write", "danger-full-access"
sandbox_mode = "workspace-write"

# Enable notifications (requires compatible terminal)
[tui]
notifications = true

# Fast profile for quick tasks
[profiles.fast]
model = "gpt-4o-mini"
approval_policy = "never"
sandbox_mode = "read-only"

# Production profile for deployments
[profiles.production]
model = "o3"
approval_policy = "on-failure"
EOF
    echo "✅ Created config.toml"
else
    echo "✅ config.toml already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Authenticate Codex: codex (then sign in)"
echo "2. Test integration: codex 'analyze this codebase'"
echo "3. Review config: cat ~/.codex/AGENTS.md"
echo ""
echo "Documentation:"
echo "- Full docs: ./docs.md (or ./openai-codex-cli-docs.md)"
echo "- Commands: ./commands.md (or ./codex-cli-commands-cheatsheet.md)"
echo "- Agent config: ./AGENTS.md"
echo "- README: ./README.md"
echo ""
echo "Happy coding! 🚀"
