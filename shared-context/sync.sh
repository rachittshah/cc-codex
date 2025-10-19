#!/bin/bash

# Shared Context Sync Script
# Syncs context between Claude Code and Codex sessions

CONTEXT_DIR="$(dirname "$0")"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +%H:%M:%S)]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +%H:%M:%S)] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[$(date +%H:%M:%S)] ERROR:${NC} $1"
}

# List active sessions
list_sessions() {
    log "Active sessions:"
    for session in "$CONTEXT_DIR"/session-*.json; do
        if [ -f "$session" ]; then
            session_id=$(basename "$session" | sed 's/session-//;s/\.json$//')
            last_updated=$(jq -r '.lastUpdated' "$session")
            source=$(jq -r '.source' "$session")
            echo "  - $session_id (source: $source, updated: $last_updated)"
        fi
    done
}

# Clean old sessions (older than 7 days)
clean_old_sessions() {
    log "Cleaning sessions older than 7 days..."
    find "$CONTEXT_DIR" -name "session-*.json" -mtime +7 -delete
    log "Cleanup complete"
}

# Backup sessions
backup_sessions() {
    backup_dir="$CONTEXT_DIR/backups"
    mkdir -p "$backup_dir"

    log "Creating backup..."
    tar -czf "$backup_dir/sessions-backup-$TIMESTAMP.tar.gz" \
        -C "$CONTEXT_DIR" \
        --exclude='backups' \
        session-*.json 2>/dev/null || true

    log "Backup created at $backup_dir/sessions-backup-$TIMESTAMP.tar.gz"

    # Keep only last 10 backups
    cd "$backup_dir" && ls -t sessions-backup-*.tar.gz | tail -n +11 | xargs rm -f 2>/dev/null || true
}

# Get session summary
session_summary() {
    if [ -z "$1" ]; then
        error "Session ID required"
        exit 1
    fi

    session_file="$CONTEXT_DIR/session-$1.json"

    if [ ! -f "$session_file" ]; then
        error "Session not found: $1"
        exit 1
    fi

    log "Session Summary for $1:"
    echo ""
    echo "Source: $(jq -r '.source' "$session_file")"
    echo "Created: $(jq -r '.createdAt' "$session_file")"
    echo "Last Updated: $(jq -r '.lastUpdated' "$session_file")"
    echo "Current Goal: $(jq -r '.currentGoal // "N/A"' "$session_file")"
    echo ""
    echo "Decisions: $(jq '.decisions | length' "$session_file")"
    echo "Artifacts: $(jq '.artifacts | length' "$session_file")"
    echo "History Entries: $(jq '.history | length' "$session_file")"
    echo ""

    log "Recent History:"
    jq -r '.history[-5:] | .[] | "  [\(.timestamp)] \(.actor): \(.action)"' "$session_file"
}

# Main command handler
case "$1" in
    list)
        list_sessions
        ;;
    clean)
        clean_old_sessions
        ;;
    backup)
        backup_sessions
        ;;
    summary)
        session_summary "$2"
        ;;
    *)
        echo "Usage: $0 {list|clean|backup|summary <session-id>}"
        echo ""
        echo "Commands:"
        echo "  list              List all active sessions"
        echo "  clean             Remove sessions older than 7 days"
        echo "  backup            Create backup of all sessions"
        echo "  summary <id>      Show summary of a specific session"
        exit 1
        ;;
esac
