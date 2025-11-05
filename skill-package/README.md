# Skill Package

**This directory contains the core skill logic that gets uploaded to Claude Desktop.**

---

## 📋 Contents

- **SKILL.md** - Main skill definition and documentation (entry point for Claude)
- **config/** - Static configuration files (paths, settings)
- **modules/** - Skill logic modules (markdown-based)
- **scripts/** - Python utility scripts (YAML, storage, config)
- **templates/** - Output templates for generated content
- **references/** - Detailed reference documentation

---

## 🎯 Purpose

This is the **read-only logic** that Claude reads to understand how your skill works. It should:
- ✅ Contain only skill logic, not user data
- ✅ Be portable across different users
- ✅ Be version controlled in git
- ✅ Work with any storage backend

---

## 📤 Usage

### Upload to Claude Desktop

1. Upload this entire directory to Claude Desktop
2. Or use the release package from `releases/`
3. Claude will read SKILL.md as the main entry point

### For Development

- Edit modules in `modules/` to add features
- Update `SKILL.md` to document changes
- Keep user data separate in `user-data/`

---

## 📁 Directory Structure

```
skill-package/
├── SKILL.md              # Main skill definition (read first)
├── config/               # Configuration
│   ├── README.md
│   └── paths.py         # File path configuration
├── modules/              # Skill logic
│   ├── README.md
│   └── module-template.md
├── scripts/              # Python utilities
│   ├── README.md
│   ├── config_loader.py
│   ├── storage.py
│   └── yaml_utils.py
├── templates/            # Output templates
│   └── README.md
└── references/           # Detailed docs
    └── README.md
```

---

## 🔒 Important Rules

**DO:**
- ✅ Keep this directory read-only for Claude
- ✅ Version control all changes
- ✅ Document all modules in SKILL.md
- ✅ Test changes before release

**DON'T:**
- ❌ Store user data here (use user-data/ instead)
- ❌ Include secrets or credentials
- ❌ Mix configuration with data
- ❌ Make it user-specific

---

## 🔗 Related

- **User Data:** `../user-data/` - Where user-specific data is stored
- **Templates:** `../user-data-templates/` - Starting templates
- **Documentation:** `../docs/` - Full documentation

---

**Last Updated:** 2025-11-05
