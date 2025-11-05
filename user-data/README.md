# User Data

**Your personal data storage for this skill.**

---

## 🎯 Purpose

This directory contains **YOUR** personal data:
- Configuration (preferences, settings)
- Database (entities, cached data)
- Logs (operations, errors)

**Important:** This directory is in `.gitignore` and will never be committed to git.

---

## 🚀 First-Time Setup

If this directory is empty, run the setup:

```bash
# Automated setup
./setup-storage.sh

# Or manual setup
cp -r user-data-templates/* user-data/
cd user-data/config
cp storage-config-template.yaml storage-config.yaml
# Edit storage-config.yaml with your settings
```

---

## 📁 Directory Structure

```
user-data/
├── README.md (this file)
├── config/                    # Your configuration
│   ├── README.md
│   ├── storage-config.yaml   # Storage backend config
│   └── user-config.yaml      # User preferences
├── db/                        # Your data
│   ├── entities/             # Entities you work with
│   ├── cache/                # Cached research
│   └── results/              # Analysis results
└── logs/                      # Operation logs
    ├── operations/
    ├── errors/
    └── sessions/
```

---

## 🔐 Security & Privacy

### This Directory Contains:
- ✅ Your personal configuration
- ✅ Your data and analysis results
- ✅ Logs of your operations
- ✅ Cached research specific to you

### Protection:
- 🔒 Listed in `.gitignore` (never committed)
- 🔒 Stays on your machine (or your chosen storage)
- 🔒 Not included in releases
- 🔒 Private to you

### DO:
- ✅ Back up this directory regularly
- ✅ Keep storage credentials secure
- ✅ Use appropriate storage backend for your needs

### DON'T:
- ❌ Commit this to git
- ❌ Share with others (contains your data)
- ❌ Store in public locations
- ❌ Include in releases

---

## 🔄 Backup Strategy

### Local Backups

```bash
# Create backup
tar -czf user-data-backup-$(date +%Y%m%d).tar.gz user-data/

# Restore backup
tar -xzf user-data-backup-20251105.tar.gz
```

### Cloud Backups

If using `local` storage backend, consider:
- Google Drive sync
- Dropbox
- iCloud Drive
- External drive

Or switch to `github` backend for automatic version control.

---

## 📊 Storage Size

Monitor your data size:

```bash
# Check size
du -sh user-data/

# Find large files
find user-data/ -type f -size +1M -exec ls -lh {} \;
```

---

## 🔧 Configuration Files

### storage-config.yaml

**What it does:** Configures where your data is stored

**Location:** `user-data/config/storage-config.yaml`

**Backends:** local, github, checkpoint, email, notion

**Setup:** See `config/README.md` for details

### user-config.yaml

**What it does:** Your skill preferences and settings

**Location:** `user-data/config/user-config.yaml`

**Contains:**
- User profile
- Feature settings
- Scoring weights
- Output preferences

**Setup:** Copy from `user-data/config/user-config-template.yaml`

---

## 🔗 Related

- **Templates:** `../user-data-templates/` - Starting templates
- **Setup Script:** `../setup-storage.sh` - Automated setup
- **Skill Package:** `../skill-package/` - Skill logic (reads this data)
- **Setup Guide:** `../docs/guides/user-guide/setup.md`

---

## ❓ Troubleshooting

**Directory is empty?**
→ Run `./setup-storage.sh` or copy from templates

**Can't save data?**
→ Check `storage-config.yaml` is configured
→ Verify paths in `skill-package/config/paths.py`

**Storage backend not working?**
→ See `../DEPENDENCIES.md` for required packages
→ Check credentials in `storage-config.yaml`

---

**Last Updated:** 2025-11-05
