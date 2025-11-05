# Configuration Templates

**Template configuration files for skill setup.**

---

## 📋 Files

### storage-config-template.yaml

**Purpose:** Configure the storage backend for user data

**Choose one of 5 backends:**

| Backend | Best For | Setup Complexity |
|---------|----------|-----------------|
| `local` | Single device, simple | Easy |
| `github` | Multi-device, version control | Medium |
| `checkpoint` | Testing, temporary work | None |
| `email` | Email-based workflow | Medium |
| `notion` | Structured data, visualization | Medium |

---

## 🚀 Setup Instructions

### 1. Copy Template

```bash
cd user-data/config
cp ../../user-data-templates/config/storage-config-template.yaml storage-config.yaml
```

### 2. Choose Backend

Edit `storage-config.yaml`:

```yaml
storage:
  backend: "local"  # Change this: local, github, checkpoint, email, notion
```

### 3. Configure Backend

**For Local Filesystem:**
```yaml
storage:
  backend: "local"
  local:
    base_path: "/absolute/path/to/user-data"  # Update this!
```

**For GitHub:**
```yaml
storage:
  backend: "github"
  github:
    repo: "username/repo-name"
    token: "ghp_xxxxxxxxxxxx"  # Generate at github.com/settings/tokens
    branch: "main"
```

**For Checkpoint (no config needed):**
```yaml
storage:
  backend: "checkpoint"
```

---

## 🔐 Security

**⚠️ IMPORTANT:** storage-config.yaml contains credentials!

**Protect Your Credentials:**
- ✅ storage-config.yaml is in .gitignore
- ✅ Never commit this file
- ✅ Use app-specific passwords (not main account password)
- ✅ Rotate tokens regularly

**Generate Tokens:**
- GitHub: https://github.com/settings/tokens (need repo access)
- Notion: https://www.notion.so/my-integrations
- Email: Use app-specific passwords (Gmail, Outlook, etc.)

---

## 🧪 Testing Configuration

After setup, test your storage:

```python
from scripts.storage import init_storage, save_data, load_data

# Initialize
init_storage("user-data/config/storage-config.yaml")

# Test
save_data("test.txt", "Hello World")
content = load_data("test.txt")
print(content)  # Should print: Hello World
```

---

## 🔗 Related

- **Storage Script:** `../../../skill-package/scripts/storage.py`
- **Dependencies:** `../../../DEPENDENCIES.md`
- **Setup Guide:** `../../../docs/guides/user-guide/setup.md`

---

**Last Updated:** 2025-11-05
