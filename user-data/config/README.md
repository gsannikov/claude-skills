# User Configuration

**Your personal configuration files.**

---

## 📋 Configuration Files

### user-config-template.yaml

**Purpose:** Template for your user preferences

**How to use:**
```bash
cp user-config-template.yaml user-config.yaml
# Edit user-config.yaml with your settings
```

**What to configure:**
- User profile (name, email, timezone)
- Feature settings (enable/disable features)
- Scoring weights (customize for your domain)
- Output preferences (format, style)
- Integrations (MCP servers, APIs)

### storage-config.yaml

**Purpose:** Configure storage backend (local, GitHub, etc.)

**How to use:**
```bash
cp ../../user-data-templates/config/storage-config-template.yaml storage-config.yaml
# Edit storage-config.yaml with backend choice
```

**See:** `../../user-data-templates/config/README.md` for details

---

## 🔐 Security Note

**⚠️ These files are in .gitignore and contain:**
- Personal information
- API credentials
- Storage tokens
- Preferences

**Never commit user-config.yaml or storage-config.yaml to git!**

---

**Last Updated:** 2025-11-05
