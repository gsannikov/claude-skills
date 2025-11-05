# Folder Cleanup Plan

## Current Structure Analysis

### Root Level Files (14 files)
**Keep - Essential:**
- ✅ README.md - Main entry point
- ✅ LICENSE - Legal
- ✅ CHANGELOG.md - Version history
- ✅ .gitignore - Git config
- ✅ version.yaml - Version tracking
- ✅ requirements.txt - Dependencies
- ✅ requirements-dev.txt - Dev dependencies
- ✅ setup-storage.sh - Quick setup script
- ✅ CODE_OF_CONDUCT.md - Community standards
- ✅ CONTRIBUTING.md - Contribution guide
- ✅ DEPENDENCIES.md - Dependency docs

**Archive - Development/Internal:**
- 📦 DEV_SESSION_STATE.md → .archive/sessions/
- 📦 SESSION_8_SUMMARY.md → .archive/sessions/
- 📦 PRE_RELEASE_BUGS.md → .archive/pre-release/
- 📦 RELEASE_VALIDATION.md → .archive/pre-release/

**Consolidate - Documentation:**
- 📄 QUICK_SETUP.md → docs/guides/QUICK_SETUP.md

---

## Proposed Final Structure

```
claude-skill-template/
│
├── 📄 README.md                    # Main documentation
├── 📄 LICENSE                      # MIT License
├── 📄 CHANGELOG.md                 # Version history
├── 📄 CONTRIBUTING.md              # How to contribute
├── 📄 CODE_OF_CONDUCT.md           # Community standards
├── 📄 DEPENDENCIES.md              # Dependencies guide
├── 📄 .gitignore                   # Git ignore rules
├── 📄 version.yaml                 # Version tracking
├── 📄 requirements.txt             # Core dependencies
├── 📄 requirements-dev.txt         # Dev dependencies
├── 📄 setup-storage.sh             # Quick setup script
│
├── 📁 skill-package/               # 🎯 CORE: Upload to Claude
│   ├── 📄 README.md               # Skill package guide
│   ├── 📄 SKILL.md                # Main skill definition
│   ├── 📁 config/                 # Static configuration
│   │   ├── 📄 README.md
│   │   └── 📄 paths.py
│   ├── 📁 modules/                # Skill logic modules
│   │   ├── 📄 README.md
│   │   └── 📄 module-template.md
│   ├── 📁 scripts/                # Python utilities
│   │   ├── 📄 README.md
│   │   ├── 📄 config_loader.py
│   │   ├── 📄 storage.py
│   │   └── 📄 yaml_utils.py
│   ├── 📁 templates/              # Output templates
│   │   └── 📄 README.md
│   └── 📁 references/             # Reference docs
│       └── 📄 README.md
│
├── 📁 user-data-templates/         # 🎯 Templates for user data
│   ├── 📄 README.md               # Template usage guide
│   ├── 📁 config/                 # Config templates
│   │   ├── 📄 README.md
│   │   └── 📄 storage-config-template.yaml
│   ├── 📁 db/                     # Database templates
│   │   ├── 📄 README.md
│   │   └── 📄 .gitkeep
│   └── 📁 logs/                   # Log templates
│       ├── 📄 README.md
│       └── 📄 .gitkeep
│
├── 📁 user-data/                   # 🎯 Local user data (gitignored)
│   ├── 📄 README.md               # User data guide
│   └── 📁 config/
│       ├── 📄 README.md
│       └── 📄 user-config-template.yaml
│
├── 📁 host_scripts/                # 🛠️ Automation scripts
│   ├── 📄 README.md               # Scripts documentation
│   ├── 📄 setup.sh                # Initial setup
│   ├── 📄 release.sh              # Release automation
│   └── 📄 validate.py             # Validation script
│
├── 📁 docs/                        # 📚 Documentation
│   ├── 📄 README.md               # Documentation index
│   ├── 📁 guides/                 # User & developer guides
│   │   ├── 📄 README.md
│   │   ├── 📄 QUICK_SETUP.md     # ← Moved from root
│   │   ├── 📁 user-guide/
│   │   │   ├── 📄 README.md
│   │   │   └── 📄 setup.md
│   │   └── 📁 developer-guide/
│   │       ├── 📄 README.md
│   │       ├── 📄 architecture.md
│   │       └── 📄 storage-selection-guide.md
│   └── 📁 project/                # Project management
│       ├── 📄 README.md
│       ├── 📄 roadmap.md
│       ├── 📄 GITHUB_STORAGE.md
│       ├── 📄 STORAGE_DESIGN.md
│       └── 📁 features/
│           ├── 📄 README.md
│           └── 📄 TEMPLATE.md
│
├── 📁 .github/                     # GitHub configuration
│   ├── 📁 ISSUE_TEMPLATE/
│   │   ├── 📄 bug_report.md
│   │   └── 📄 feature_request.md
│   ├── 📄 PULL_REQUEST_TEMPLATE.md
│   └── 📁 workflows/
│       ├── 📄 validate.yml
│       └── 📄 release.yml
│
├── 📁 .archive/                    # 📦 Archived files (new)
│   ├── 📄 README.md               # Archive index
│   ├── 📁 sessions/               # Development sessions
│   │   ├── 📄 README.md
│   │   ├── 📄 DEV_SESSION_STATE.md
│   │   └── 📄 SESSION_8_SUMMARY.md
│   └── 📁 pre-release/            # Pre-release notes
│       ├── 📄 README.md
│       ├── 📄 PRE_RELEASE_BUGS.md
│       └── 📄 RELEASE_VALIDATION.md
│
└── 📁 releases/                    # Release packages
    └── 📄 README.md               # Release notes
```

---

## Actions Required

### 1. Create New Directories
```bash
mkdir -p .archive/sessions
mkdir -p .archive/pre-release
mkdir -p user-data-templates/logs
mkdir -p skill-package/templates
mkdir -p skill-package/references
```

### 2. Move Files to Archive
```bash
mv DEV_SESSION_STATE.md .archive/sessions/
mv SESSION_8_SUMMARY.md .archive/sessions/
mv PRE_RELEASE_BUGS.md .archive/pre-release/
mv RELEASE_VALIDATION.md .archive/pre-release/
```

### 3. Consolidate Documentation
```bash
mv QUICK_SETUP.md docs/guides/
```

### 4. Create README Files
Create README.md for every directory explaining its purpose.

### 5. Update .gitignore
Ensure .archive/ is not ignored (we want to commit archive structure).

---

## Summary

**Root Level:** 11 files (reduced from 14)
- Only essential documentation and config files
- Clear purpose for each file

**New .archive/:** Archive for development artifacts
- Sessions and summaries
- Pre-release notes
- Historical data

**Documentation:** Consolidated under docs/
- All guides in one place
- Clear hierarchy

**Each folder:** Has README.md explaining purpose
- Self-documenting structure
- Easy navigation

**Total Impact:**
- Cleaner root directory
- Better organization
- Preserved history in archive
- Self-documenting with READMEs
