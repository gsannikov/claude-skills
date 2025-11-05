# Archive

**Historical files, development notes, and deprecated content.**

---

## 🎯 Purpose

This directory contains **non-essential files** that are preserved for:
- Historical reference
- Development tracking
- Pre-release documentation
- Lessons learned

**These files are NOT needed for using the skill, but are kept for project history.**

---

## 📁 Contents

### sessions/
Development session notes and tracking:
- `DEV_SESSION_STATE.md` - Development state tracking
- `SESSION_8_SUMMARY.md` - Session 8 summary
- Other session notes

### pre-release/
Pre-release documentation and bug tracking:
- `PRE_RELEASE_BUGS.md` - Bugs identified before release
- `RELEASE_VALIDATION.md` - Release validation checklists
- QA notes

---

## 🔍 When to Use Archive

**Archive files when:**
- ✅ No longer needed for daily operations
- ✅ Historical value for reference
- ✅ Completed/resolved issues
- ✅ Superseded by newer versions

**Keep in main directories when:**
- ❌ Actively used documentation
- ❌ Current development work
- ❌ User-facing content
- ❌ Essential for skill operation

---

## 📊 Archive Organization

```
.archive/
├── README.md (this file)
├── sessions/              # Development sessions
│   ├── README.md
│   ├── DEV_SESSION_STATE.md
│   ├── SESSION_8_SUMMARY.md
│   └── [older sessions]
├── pre-release/           # Pre-release artifacts
│   ├── README.md
│   ├── PRE_RELEASE_BUGS.md
│   ├── RELEASE_VALIDATION.md
│   └── [older releases]
├── deprecated/            # Deprecated features
│   └── [old documentation]
└── migration/             # Migration guides
    └── [version migrations]
```

---

## 🗂️ Archive Policy

### What Gets Archived

1. **Completed Milestones**
   - Session summaries after completion
   - Release notes after release
   - Bug reports after fixes

2. **Deprecated Features**
   - Old documentation
   - Superseded implementations
   - Legacy guides

3. **Development Artifacts**
   - Planning documents (after implementation)
   - Design explorations (after decision)
   - Prototype code (after final implementation)

### What Doesn't Get Archived

1. **Active Content**
   - Current documentation
   - Open issues
   - Work in progress

2. **User-Facing Content**
   - README, guides, tutorials
   - API documentation
   - Examples

3. **Essential Files**
   - Configuration templates
   - Core skill files
   - Build scripts

---

## 🔗 Restoration

If you need to restore archived content:

```bash
# View archive
ls -la .archive/sessions/

# Restore specific file
cp .archive/sessions/SESSION_8_SUMMARY.md ./

# Or view without restoring
cat .archive/sessions/DEV_SESSION_STATE.md
```

---

## 📝 Adding to Archive

When archiving new content:

```bash
# Move to appropriate subdirectory
mv OLD_FILE.md .archive/sessions/

# Update this README if adding new category

# Commit with message
git add .archive/
git commit -m "Archive: Moved OLD_FILE.md to archive/sessions"
```

---

## 🔗 Related

- **Root Directory:** `../` - Active project files
- **Documentation:** `../docs/` - Current documentation
- **Development:** Development files belong here after completion

---

**Last Updated:** 2025-11-05
