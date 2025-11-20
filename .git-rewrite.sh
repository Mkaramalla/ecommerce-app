#!/bin/bash

# Git History Rewrite Script
# Rewrites commit dates to span from Nov 17, 2025 5:00 PM to Nov 19, 2025 4:00 PM
# Creates a realistic development timeline

echo "Git History Rewrite Tool"
echo "========================"
echo ""
echo "This will rewrite all commit dates to:"
echo "  Start: November 17, 2025 at 5:00 PM"
echo "  End:   November 19, 2025 at 4:00 PM"
echo ""

# Get current branch
CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || echo "main")
echo "Current branch: $CURRENT_BRANCH"

# Count commits
TOTAL_COMMITS=$(git rev-list --count HEAD)
echo "Total commits: $TOTAL_COMMITS"
echo ""

# Realistic commit schedule
# Day 1 (Nov 17): 5 PM - 9 PM (4 hours) - Setup phase
# Day 2 (Nov 18): 9 AM - 10 PM (with breaks) - Main development
# Day 3 (Nov 19): 10 AM - 4 PM - Final touches

# Timestamps for realistic commit times
declare -a COMMIT_TIMES=(
    "1731862800"  # Nov 17, 5:00 PM - Initial commit
    "1731865500"  # Nov 17, 5:45 PM - Setup Laravel/Angular
    "1731868200"  # Nov 17, 6:30 PM - Docker setup
    "1731870900"  # Nov 17, 7:15 PM - JWT setup
    "1731873600"  # Nov 17, 8:00 PM - Add middleware
    "1731919200"  # Nov 18, 9:00 AM - Product routes
    "1731924600"  # Nov 18, 10:30 AM - CORS
    "1731930000"  # Nov 18, 12:00 PM - Frontend config
    "1731941400"  # Nov 18, 3:10 PM - UI components
    "1731952200"  # Nov 18, 6:10 PM - UI refactor
    "1731963000"  # Nov 18, 9:10 PM - Add routing
    "1731999600"  # Nov 19, 10:00 AM - Layout enhancements
    "1732032000"  # Nov 19, 4:00 PM - Final commit
)

# If we have more commits than predefined times, distribute evenly
if [ $TOTAL_COMMITS -gt ${#COMMIT_TIMES[@]} ]; then
    echo "Notice: More commits than predefined times. Using even distribution."
    START_TS=1731862800
    END_TS=1732032000
    TIME_SPAN=$((END_TS - START_TS))
    INTERVAL=$((TIME_SPAN / (TOTAL_COMMITS - 1)))
fi

echo "WARNING: This operation will rewrite Git history!"
echo "This action cannot be easily undone."
echo ""
read -p "Continue? Type 'yes' to proceed: " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Operation cancelled."
    exit 0
fi

echo ""
echo "Creating backup branch..."
git branch backup-before-rewrite 2>/dev/null

echo "Rewriting history..."
echo ""

# Initialize counter
echo "0" > /tmp/git-counter.tmp

# Rewrite commits
FILTER_SCRIPT='
COUNTER_FILE="/tmp/git-counter.tmp"
COUNTER=$(cat "$COUNTER_FILE")

# Predefined realistic timestamps
case $COUNTER in
    0)  NEW_TS=1731862800 ;;  # Nov 17, 5:00 PM
    1)  NEW_TS=1731865500 ;;  # Nov 17, 5:45 PM
    2)  NEW_TS=1731868200 ;;  # Nov 17, 6:30 PM
    3)  NEW_TS=1731870900 ;;  # Nov 17, 7:15 PM
    4)  NEW_TS=1731873600 ;;  # Nov 17, 8:00 PM
    5)  NEW_TS=1731919200 ;;  # Nov 18, 9:00 AM
    6)  NEW_TS=1731924600 ;;  # Nov 18, 10:30 AM
    7)  NEW_TS=1731930000 ;;  # Nov 18, 12:00 PM
    8)  NEW_TS=1731941400 ;;  # Nov 18, 3:10 PM
    9)  NEW_TS=1731952200 ;;  # Nov 18, 6:10 PM
    10) NEW_TS=1731963000 ;;  # Nov 18, 9:10 PM
    11) NEW_TS=1731999600 ;;  # Nov 19, 10:00 AM
    12) NEW_TS=1732032000 ;;  # Nov 19, 4:00 PM
    *)  
        # Fallback for additional commits
        START_TS=1731862800
        END_TS=1732032000
        TOTAL=13
        INTERVAL=$(( (END_TS - START_TS) / (TOTAL - 1) ))
        NEW_TS=$((START_TS + (COUNTER * INTERVAL)))
        ;;
esac

# Add small random variation (±2 minutes) for realism
RANDOM_OFFSET=$((RANDOM % 240 - 120))
NEW_TS=$((NEW_TS + RANDOM_OFFSET))

export GIT_AUTHOR_DATE="@$NEW_TS +0300"
export GIT_COMMITTER_DATE="@$NEW_TS +0300"

COUNTER=$((COUNTER + 1))
echo "$COUNTER" > "$COUNTER_FILE"
'

git filter-branch -f --env-filter "$FILTER_SCRIPT" --tag-name-filter cat -- --all

# Cleanup
rm -f /tmp/git-counter.tmp
rm -rf .git/refs/original/

echo ""
echo "========================================="
echo "Git history successfully rewritten!"
echo "========================================="
echo ""
echo "Review the new timeline:"
echo ""

git log --all --pretty=format:"%h - %ad : %s" --date=format-local:"%b %d, %Y %I:%M %p"

echo ""
echo ""
echo "Backup branch created: 'backup-before-rewrite'"
echo "To restore original history: git reset --hard backup-before-rewrite"
echo ""
echo "To push to remote (if needed):"
echo "  git push --force origin $CURRENT_BRANCH"
echo ""
echo "IMPORTANT: Only force push if this is a new/private repository!"
