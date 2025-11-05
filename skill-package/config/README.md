# Skill Configuration

**Static configuration files for the skill.**

---

## 📋 Contents

- **paths.py** - File system path configuration

---

## 🎯 Purpose

This directory contains **static configuration** that defines how the skill operates. These files are:
- Part of the skill package (uploaded to Claude)
- Version controlled in git
- Read-only for Claude
- Portable across users

---

## 📄 Files

### paths.py

Defines file system paths for user data storage.

**Key Configuration:**
```python
USER_DATA_BASE = "/Users/YOUR_USERNAME/path/to/user-data"
```

**Before First Use:**
1. Edit `paths.py`
2. Update `USER_DATA_BASE` with your local path
3. Or use `setup-storage.sh` to auto-configure

**Functions Provided:**
- `get_user_data_base()` - Get base user data directory
- `get_config_path(filename)` - Get config file path
- `get_db_path(subdir, filename)` - Get database file path
- `get_log_path(filename)` - Get log file path
- `validate_path(path)` - Validate path security

---

## 🔧 Adding New Configuration

If you need to add new configuration files:

1. **For skill logic:** Add here in `config/`
2. **For user data:** Use `user-data/config/` instead
3. **For feature toggles:** Consider `user-config.yaml`

---

## 🔗 Related

- **Storage Config:** `../../user-data-templates/config/storage-config-template.yaml`
- **User Config:** `../../user-data/config/user-config-template.yaml`
- **Scripts:** `../scripts/config_loader.py`

---

**Last Updated:** 2025-11-05
