# Skill Scripts

**Python utility scripts for data operations and automation.**

---

## 🎯 Purpose

These scripts provide Python utilities that Claude can execute to:
- Load and manipulate YAML configuration
- Handle multi-backend storage operations
- Perform file I/O operations
- Process structured data

---

## 📋 Scripts

### config_loader.py

**Purpose:** Load and access user configuration

**Functions:**
- `load_user_config()` - Load user-config.yaml
- `get_config_value(key, default)` - Get specific config value

**Usage:**
```python
from scripts.config_loader import load_user_config

config = load_user_config()
user_name = config.get('user_profile', {}).get('name')
```

---

### storage.py

**Purpose:** Multi-backend storage system

**Supports 5 Backends:**
1. **Local Filesystem** - MCP filesystem (recommended)
2. **GitHub** - Git repository storage
3. **Checkpoint** - Session-only memory
4. **Email** - IMAP/SMTP storage
5. **Notion** - Notion database

**Functions:**
```python
from scripts.storage import init_storage, save_data, load_data

# Initialize
init_storage("user-data/config/storage-config.yaml")

# Operations
save_data("db/entity.yaml", content)
data = load_data("db/entity.yaml")
exists = data_exists("db/entity.yaml")
keys = list_data("db/")
delete_data("db/old-entity.yaml")
```

**Backends:**
```python
# Use specific backend
storage = StorageManager()
storage.use_local_filesystem("/path/to/data")
storage.use_github("user/repo", "token")
storage.use_checkpoint()
```

---

### yaml_utils.py

**Purpose:** YAML file operations

**Functions:**
```python
from scripts.yaml_utils import read_yaml, write_yaml, update_yaml

# Read/Write
data = read_yaml('file.yaml')
write_yaml(data, 'output.yaml')

# Update
update_yaml('file.yaml', {'key': 'new_value'})

# Nested access
value = get_nested_value(data, 'level1.level2.key')
set_nested_value(data, 'level1.level2.key', 'value')

# Validation
is_valid, error = validate_yaml('file.yaml')
```

---

## 🔧 Dependencies

**Core (Required):**
- Python 3.8+
- PyYAML - `pip install pyyaml`

**Backend-Specific (Optional):**
- GitHub: `pip install PyGithub`
- Notion: `pip install notion-client`
- Email: Built-in (smtplib, imaplib)

See `../../requirements.txt` for full list.

---

## 🏗️ Architecture

### Storage Backend Pattern

```python
class StorageBackend(ABC):
    def save(key, content) -> bool
    def load(key) -> str
    def exists(key) -> bool
    def list_keys(prefix) -> List[str]
    def delete(key) -> bool
```

All backends implement this interface, allowing seamless switching.

### Configuration Loader Pattern

Centralized config loading with validation:
1. Validate paths exist
2. Load YAML with error handling
3. Provide typed accessors

---

## 🔐 Security Notes

**Storage Credentials:**
- Never hardcode tokens/passwords
- Use environment variables
- Store config in gitignored user-data/
- Use app-specific passwords

**Path Validation:**
- All paths validated against USER_DATA_BASE
- Prevents directory traversal
- Safe file operations

---

## 🧪 Testing

Each script includes test code at bottom:
```bash
python skill-package/scripts/yaml_utils.py
python skill-package/scripts/storage.py
```

---

## 🔗 Related

- **Config:** `../config/paths.py` - Path configuration
- **User Config:** `../../user-data/config/` - User settings
- **Storage Config:** `../../user-data-templates/config/storage-config-template.yaml`

---

**Last Updated:** 2025-11-05
