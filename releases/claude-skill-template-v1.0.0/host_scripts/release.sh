#!/bin/bash
# Claude Skill Release Script
# Automates version updates and release package creation

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get version from command line
VERSION=$1

if [ -z "$VERSION" ]; then
    echo -e "${RED}Error: Version number required${NC}"
    echo "Usage: ./release.sh <version>"
    echo "Example: ./release.sh 1.0.0"
    exit 1
fi

# Validate version format (semantic versioning)
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo -e "${RED}Error: Invalid version format${NC}"
    echo "Version must be in format: MAJOR.MINOR.PATCH (e.g., 1.0.0)"
    exit 1
fi

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SKILL_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

echo -e "${BLUE}🚀 Claude Skill Release v${VERSION}${NC}\n"

# Check if we're in a git repository
if [ ! -d "$SKILL_ROOT/.git" ]; then
    echo -e "${RED}Error: Not a git repository${NC}"
    echo "Run 'git init' first or use ./setup.sh"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${YELLOW}⚠  Warning: You have uncommitted changes${NC}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted"
        exit 1
    fi
fi

echo -e "${BLUE}Step 1: Updating version files${NC}"
echo "----------------------------------------"

# Update version.yaml if it exists
if [ -f "$SKILL_ROOT/version.yaml" ]; then
    echo "version: \"$VERSION\"" > "$SKILL_ROOT/version.yaml.tmp"
    echo "release_date: \"$(date +%Y-%m-%d)\"" >> "$SKILL_ROOT/version.yaml.tmp"
    echo "status: \"stable\"" >> "$SKILL_ROOT/version.yaml.tmp"
    mv "$SKILL_ROOT/version.yaml.tmp" "$SKILL_ROOT/version.yaml"
    echo -e "${GREEN}✓${NC} Updated version.yaml"
else
    echo -e "${YELLOW}→${NC} version.yaml not found, skipping"
fi

# Update SKILL.md version if it exists
if [ -f "$SKILL_ROOT/skill-package/SKILL.md" ]; then
    sed -i.bak "s/version: .*/version: $VERSION/" "$SKILL_ROOT/skill-package/SKILL.md" 2>/dev/null || \
    sed -i '' "s/version: .*/version: $VERSION/" "$SKILL_ROOT/skill-package/SKILL.md" 2>/dev/null || \
    echo -e "${YELLOW}→${NC} Could not update SKILL.md version (manual edit may be needed)"
    rm -f "$SKILL_ROOT/skill-package/SKILL.md.bak"
    echo -e "${GREEN}✓${NC} Updated SKILL.md"
fi

echo ""
echo -e "${BLUE}Step 2: Creating release package${NC}"
echo "----------------------------------------"

# Create releases directory
mkdir -p "$SKILL_ROOT/releases"

# Create release package
RELEASE_DIR="$SKILL_ROOT/releases/skill-package-v${VERSION}"
RELEASE_ZIP="$SKILL_ROOT/releases/skill-package-v${VERSION}.zip"

# Clean up old release directory if exists
rm -rf "$RELEASE_DIR"
mkdir -p "$RELEASE_DIR"

# Copy essential files
cp -r "$SKILL_ROOT/skill-package" "$RELEASE_DIR/"
cp "$SKILL_ROOT/README.md" "$RELEASE_DIR/"
[ -f "$SKILL_ROOT/LICENSE" ] && cp "$SKILL_ROOT/LICENSE" "$RELEASE_DIR/"
[ -f "$SKILL_ROOT/CHANGELOG.md" ] && cp "$SKILL_ROOT/CHANGELOG.md" "$RELEASE_DIR/"

# Copy docs if they exist
if [ -d "$SKILL_ROOT/docs" ]; then
    cp -r "$SKILL_ROOT/docs" "$RELEASE_DIR/"
fi

echo -e "${GREEN}✓${NC} Created release directory"

# Create ZIP archive
cd "$SKILL_ROOT/releases"
zip -r "skill-package-v${VERSION}.zip" "skill-package-v${VERSION}" > /dev/null
rm -rf "skill-package-v${VERSION}"  # Clean up directory after zipping

echo -e "${GREEN}✓${NC} Created release package: releases/skill-package-v${VERSION}.zip"

echo ""
echo -e "${BLUE}Step 3: Git operations${NC}"
echo "----------------------------------------"

cd "$SKILL_ROOT"

# Stage changes
git add .
echo -e "${GREEN}✓${NC} Staged changes"

# Commit
git commit -m "Release v${VERSION}" 2>/dev/null || echo -e "${YELLOW}→${NC} No changes to commit"

# Create tag
if git rev-parse "v${VERSION}" >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠  Tag v${VERSION} already exists${NC}"
else
    git tag "v${VERSION}"
    echo -e "${GREEN}✓${NC} Created tag v${VERSION}"
fi

echo ""
echo -e "${BLUE}Step 4: Summary${NC}"
echo "----------------------------------------"
echo ""
echo "Release v${VERSION} prepared successfully!"
echo ""
echo "Next steps:"
echo "  1. Review changes: git log"
echo "  2. Push to remote: git push origin main --tags"
echo "  3. Upload to GitHub: releases/skill-package-v${VERSION}.zip"
echo "  4. Update CHANGELOG.md with release notes"
echo ""
echo -e "${GREEN}✅ Release complete!${NC}"
echo ""
