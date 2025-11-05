# User Data Templates

**Starting templates for user-specific data and configuration.**

---

## 🎯 Purpose

This directory provides **template files** that users copy and customize:
- Configuration templates
- Database structure examples
- Log file formats
- Starting points for customization

**Important:** This directory contains TEMPLATES only. Actual user data goes in `../user-data/`

---

## 📁 Directory Structure

```
user-data-templates/
├── README.md (this file)
├── config/                          # Configuration templates
│   ├── README.md
│   └── storage-config-template.yaml # Storage backend config
├── db/                              # Database templates
│   ├── README.md
│   └── .gitkeep
└── logs/                            # Log templates
    ├── README.md
    └── .gitkeep
```

---

## 🚀 First-Time Setup

### Quick Setup (Automated)

```bash
# Run setup script
./setup-storage.sh

# This will:
# 1. Copy user-data-templates/ to user-data/
# 2. Update paths.py with your directory
# 3. Configure MCP filesystem access
```

### Manual Setup

```bash
# 1. Copy templates to user-data
cp -r user-data-templates/* user-data/

# 2. Customize configuration
cd user-data/config
cp storage-config-template.yaml storage-config.yaml
# Edit storage-config.yaml with your settings

# 3. Update paths.py
# Edit skill-package/config/paths.py
# Set USER_DATA_BASE to your user-data/ path
```

---

## 📄 Template Files

### storage-config-template.yaml

**Purpose:** Configure storage backend

**Backends:**
- `local` - Local filesystem (recommended)
- `github` - GitHub repository
- `checkpoint` - Session-only
- `email` - Email storage
- `notion` - Notion database

**Usage:**
```bash
cp storage-config-template.yaml storage-config.yaml
# Edit storage-config.yaml
# Set backend: "local" (or github, etc.)
# Configure backend-specific settings
```

**Security:**
⚠️ **Never commit storage-config.yaml** - it contains credentials!

---

## 📁 Directory Templates

### config/
Configuration files:
- Storage backend settings
- Feature preferences
- API credentials (in .gitignore)

### db/
Database storage:
- Entity YAML files
- Cached data
- Structured data storage

### logs/
Log files:
- Operation logs
- Error logs
- Audit trails

---

## 🔄 Workflow

```
1. Install Skill
   ├─> Clone repository
   └─> Install dependencies

2. Setup User Data (ONE TIME)
   ├─> Copy user-data-templates/ → user-data/
   ├─> Customize config files
   └─> Update paths.py

3. Use Skill
   ├─> Upload skill-package/ to Claude
   ├─> Skill reads from user-data/
   └─> Skill writes to user-data/
```

---

## 🔐 Security Best Practices

**DO:**
- ✅ Copy templates before customizing
- ✅ Keep storage-config.yaml gitignored
- ✅ Use app-specific passwords for services
- ✅ Back up user-data/ regularly

**DON'T:**
- ❌ Commit user-data/ to git
- ❌ Share storage credentials
- ❌ Edit templates directly (copy first)
- ❌ Store secrets in templates

---

## 🆕 Adding New Templates

If you create new template files:

1. **Add to user-data-templates/**
   ```bash
   # Create new template
   echo "template content" > user-data-templates/config/new-template.yaml
   ```

2. **Document in README**
   Update this file to explain the template

3. **Add to .gitignore**
   ```
   # .gitignore
   user-data/config/new-config.yaml
   ```

4. **Test Setup**
   ```bash
   # Test that copying works
   cp user-data-templates/config/new-template.yaml user-data/config/
   ```

---

## 🔗 Related

- **User Data:** `../user-data/` - Where templates get copied to
- **Setup Script:** `../setup-storage.sh` - Automates template copying
- **Documentation:** `../docs/guides/user-guide/setup.md`

---

**Last Updated:** 2025-11-05
