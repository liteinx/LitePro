#!/bin/bash

# Video Room Management Script for Watch Together (w2g)
# Usage: ./add-video.sh <room-title> <video-url> [description]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/videos.json"
BASE_URL="https://liteinx.github.io/LitePro/w2g"

# Function to generate random code
generate_code() {
    # Generate 5-character alphanumeric code (A-Z, 0-9, excluding confusing chars)
    chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'  # No I, O, 0, 1 to avoid confusion
    code=''

    for i in {1..5}; do
        code="${code}${chars:RANDOM%${#chars}:1}"
    done

    echo "$code"
}

# Function to check if code already exists
code_exists() {
    local code=$1
    if grep -q "\"$code\"" "$CONFIG_FILE" 2>/dev/null; then
        return 0  # Code exists
    else
        return 1  # Code doesn't exist
    fi
}

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}✗ Error: jq is not installed${NC}"
    echo -e "${YELLOW}Install jq:${NC}"
    echo -e "  Ubuntu/Debian: ${BLUE}sudo apt-get install jq${NC}"
    echo -e "  macOS: ${BLUE}brew install jq${NC}"
    exit 1
fi

# Check arguments
if [ $# -lt 2 ]; then
    echo -e "${RED}✗ Error: Missing arguments${NC}"
    echo -e "\n${YELLOW}Usage:${NC} $0 <room-title> <video-url> [description]"
    echo -e "\n${YELLOW}Example:${NC} $0 \"Movie Night\" \"https://www.youtube.com/watch?v=dQw4w9WgXcQ\" \"Watch movies together\""
    exit 1
fi

# Get arguments
ROOM_TITLE="$1"
VIDEO_URL="$2"
DESCRIPTION="${3:-Watch videos together with friends and family}"

# Validate URL format (basic check for YouTube or other video platforms)
if [[ ! "$VIDEO_URL" =~ ^https?:// ]]; then
    echo -e "${RED}✗ Error: Invalid URL format. Must start with http:// or https://${NC}"
    exit 1
fi

# Generate unique code
echo -e "${BLUE}🔑 Generating unique room code...${NC}"
CODE=""
MAX_ATTEMPTS=100
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    CODE=$(generate_code)
    if ! code_exists "$CODE"; then
        break
    fi
    ATTEMPT=$((ATTEMPT + 1))
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo -e "${RED}✗ Error: Could not generate unique code${NC}"
    exit 1
fi

# Get current date
CURRENT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Add to videos.json
echo -e "${BLUE}📝 Updating videos.json...${NC}"

# Check if config file exists, create if not
if [ ! -f "$CONFIG_FILE" ]; then
    echo '{"default":{"title":"Default Room","description":"Watch videos together","videoUrl":""},"rooms":{}}' > "$CONFIG_FILE"
fi

# Use jq to add new entry
tmp=$(mktemp)
jq --arg code "$CODE" \
   --arg title "$ROOM_TITLE" \
   --arg videoUrl "$VIDEO_URL" \
   --arg description "$DESCRIPTION" \
   --arg createdBy "$USER" \
   --arg added "$CURRENT_DATE" \
   '.rooms[$code] = {"title": $title, "videoUrl": $videoUrl, "description": $description, "createdBy": $createdBy, "created": $added, "views": 0}' "$CONFIG_FILE" > "$tmp"

mv "$tmp" "$CONFIG_FILE"

# Success!
echo -e "\n${GREEN}✅ Video room created successfully!${NC}\n"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📺 Room Title:${NC}   $ROOM_TITLE"
echo -e "${BLUE}🎬 Video URL:${NC}    $VIDEO_URL"
echo -e "${BLUE}📝 Description:${NC}  $DESCRIPTION"
echo -e "${BLUE}🔑 Room Code:${NC}    $CODE"
echo -e "${BLUE}📅 Created:${NC}      $CURRENT_DATE"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
echo -e "${GREEN}🔗 Share link:${NC} ${BLUE}$BASE_URL/?r=$CODE${NC}\n"
echo -e "${YELLOW}💡 Tip: Commit and push changes to GitHub to deploy${NC}\n"
