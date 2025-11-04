# [Your Skill Name] v1.0.0

**Type:** Claude Skill  
**Version:** 1.0.0  
**Last Updated:** 2025-11-03  
**Author:** [Your Name]  
**License:** MIT  

---

## Overview

[Brief description of what your skill does - 2-3 sentences]

**Purpose:** [What problem does this skill solve?]

**Target Users:** [Who is this skill for?]

**Key Features:**
- Feature 1: [Brief description]
- Feature 2: [Brief description]
- Feature 3: [Brief description]

---

## ⚠️ Storage Backend System

This skill uses a flexible **multi-backend storage system** that supports 5 different storage options. Choose the backend that best fits your needs.

### Supported Backends

1. **Local Filesystem** (Recommended) - Uses MCP filesystem tools
2. **GitHub Repository** - Multi-device sync via GitHub
3. **Checkpoint System** - Session-only, perfect for testing
4. **Email Storage** - Store data as emails
5. **Notion Database** - Structured storage in Notion

### Quick Start

#### Step 1: Choose Your Backend

Edit `user-data/config/storage-config.yaml` (copy from template first):

```yaml
storage:
  backend: local  # or: github, checkpoint, email, notion
  
  # Local Filesystem (Recommended)
  local:
    base_path: /Users/yourname/MyDrive/your-skill/user-data
  
  # GitHub (Optional - for multi-device)
  # github:
  #   repo: "username/skill-data"
  #   token: "ghp_your_token_here"
  #   branch: "main"
  
  # Checkpoint (Session-only - no config needed)
  
  # Email (Optional)
  # email:
  #   imap_server: "imap.gmail.com"
  #   smtp_server: "smtp.gmail.com"
  #   email: "your.email@gmail.com"
  #   password: "your_app_password"
  #   folder: "Claude/SkillData"
  
  # Notion (Optional)
  # notion:
  #   token: "secret_your_token_here"
  #   database_id: "your_database_id"
```

#### Step 2: Initialize Storage

```python
from scripts.storage import init_storage, save_data, load_data

# Initialize with config file
init_storage("user-data/config/storage-config.yaml")

# Or initialize manually
from scripts.storage import StorageManager
storage = StorageManager()
storage.use_local_filesystem("/path/to/user-data")
```

#### Step 3: Use Storage

```python
# Save data
save_data("config/settings.yaml", yaml_content)
save_data("db/entities/company-acme.yaml", company_data)
save_data("logs/2025-11-04.log", log_message)

# Load data
settings = load_data("config/settings.yaml")
company = load_data("db/entities/company-acme.yaml")

# Check if exists
if data_exists("config/settings.yaml"):
    settings = load_data("config/settings.yaml")

# List files
all_companies = list_data("db/entities/")
all_logs = list_data("logs/")

# Delete
delete_data("logs/old-log.log")
```

### Backend Comparison

| Backend | Setup | Persistence | Multi-Device | Best For |
|---------|-------|-------------|--------------|----------|
| **Local** | Easy | ✅ | ❌ | Single device, simplicity |
| **GitHub** | Medium | ✅ | ✅ | Multi-device, version control |
| **Checkpoint** | None | ❌ | ❌ | Testing, temporary work |
| **Email** | Medium | ✅ | ✅ | Email-based workflows |
| **Notion** | Medium | ✅ | ✅ | Structured data, visualization |

### Dependencies

See [DEPENDENCIES.md](../../DEPENDENCIES.md) for detailed installation instructions.

- **Local**: No extra dependencies (uses MCP)
- **GitHub**: `pip install PyGithub`
- **Checkpoint**: No extra dependencies
- **Email**: No extra dependencies (built-in)
- **Notion**: `pip install notion-client`

### Advanced Usage

#### Backend-Specific Features

**GitHub Backend - Version History:**
```python
from scripts.storage import get_storage

storage = get_storage()
if hasattr(storage.backend, 'get_history'):
    history = storage.backend.get_history("config/settings.yaml", limit=10)
    for commit in history:
        print(f"{commit['date']}: {commit['message']}")
```

**Checkpoint Backend - Export/Import:**
```python
from scripts.storage import get_storage

storage = get_storage()
if hasattr(storage.backend, 'export_checkpoint'):
    # Export before session ends
    checkpoint = storage.backend.export_checkpoint()
    save_data("checkpoint-2025-11-04.json", json.dumps(checkpoint))
    
    # Import in new session
    checkpoint = json.loads(load_data("checkpoint-2025-11-04.json"))
    storage.backend.import_checkpoint(checkpoint)
```

#### Switching Backends

```python
from scripts.storage import get_storage

storage = get_storage()

# Switch to GitHub
storage.use_github("username/repo", "ghp_token", "main")

# Switch to Local
storage.use_local_filesystem("/path/to/data")

# Switch to Checkpoint
storage.use_checkpoint()
```

### File Access Rules (Important!)

**For Skill Modules (Read-Only):**
```python
# ✅ CORRECT: Use file_read() tool
module_content = file_read("modules/analysis.md")
reference = file_read("references/detailed-scoring.md")
```

**For User Data (Read-Write):**
```python
# ✅ CORRECT: Use storage backend
save_data("db/analysis-result.yaml", result)
data = load_data("config/settings.yaml")

# ❌ WRONG: Don't use file_read() for user data
# This won't work with non-local backends!
```

**NEVER mix these access methods!**

### Migration Between Backends

To migrate data from one backend to another:

```python
from scripts.storage import StorageManager

# Load from old backend
old_storage = StorageManager()
old_storage.use_local_filesystem("/old/path")

# Get all keys
all_keys = old_storage.list_keys()

# Setup new backend
new_storage = StorageManager()
new_storage.use_github("username/repo", "token")

# Copy all data
for key in all_keys:
    data = old_storage.load(key)
    if data:
        new_storage.save(key, data)
        print(f"✓ Migrated: {key}")
```

### Security Best Practices

1. **Never commit credentials:**
   - Use `.gitignore` for `storage-config.yaml`
   - Store tokens in environment variables
   - Use `.env` files (also in `.gitignore`)

2. **Use app-specific passwords:**
   - GitHub: Personal Access Tokens (not main password)
   - Email: App Passwords (not account password)
   - Notion: Integration tokens (not personal login)

3. **Encrypt sensitive data:**
   ```python
   from cryptography.fernet import Fernet
   
   # Generate key (do once, store securely)
   key = Fernet.generate_key()
   cipher = Fernet(key)
   
   # Encrypt before saving
   encrypted = cipher.encrypt(sensitive_data.encode())
   save_data("secure/credentials.enc", encrypted)
   
   # Decrypt when loading
   encrypted = load_data("secure/credentials.enc")
   decrypted = cipher.decrypt(encrypted).decode()
   ```

### Troubleshooting Storage

**"Storage not initialized" error:**
```python
# Make sure to call init_storage() first
from scripts.storage import init_storage
init_storage("user-data/config/storage-config.yaml")
```

**"PyYAML required" error:**
```bash
pip install PyYAML
```

**"PyGithub not installed" error:**
```bash
pip install PyGithub
```

**Backend not working:**
- Check configuration file syntax
- Verify credentials are correct
- Test connection manually
- Check backend-specific setup (see DEPENDENCIES.md)

---

## Token Budget Management

### Budget Targets
- **Initialization**: < 10K tokens (10%)
- **Research Phase**: < 30K tokens (30%)
- **Analysis Phase**: < 50K tokens (50%)
- **Output Generation**: < 20K tokens (20%)
- **Reserve**: 20K tokens (20%)

### Protection Mechanisms

#### 1. Progressive Discovery
```markdown
✅ DO:
- Use list_allowed_directories() to find MCP roots
- Navigate incrementally with list_directory()
- Build mental map progressively
- Use directory_tree() only on confirmed small directories

❌ DON'T:
- Use directory_tree() on allowed directory roots
- Perform recursive operations on large directories
- Search entire filesystem
- Load all modules at once
```

#### 2. Modular Loading
Load only what's needed:
- Start with core module overview
- Load detailed references only when required
- Cache research results to avoid re-fetching
- Unload modules after use

#### 3. Smart Caching
```python
# Example: Cache company research
if company_cached:
    data = load_from_cache(company_id)
else:
    data = research_company(company_id)
    save_to_cache(company_id, data)
```

#### 4. Checkpoint Monitoring
After each major operation:
```markdown
📊 Token Usage Check
Current: XXK tokens (XX%)
Remaining: XXK tokens (XX%)
Status: [✅ Safe | ⚠️ Warning | 🛑 Critical]
Action: [Continue | Reduce scope | Stop and restart]
```

---

## Available Modules

### Core Modules
Located in `skill-package/modules/`:

1. **module-name.md** - [Brief description]
   - Token cost: ~XK
   - When to use: [Use case]
   - Dependencies: [Other modules]

### Reference Documentation
Located in `skill-package/references/`:

1. **module-name-detailed.md** - [Detailed implementation]
   - Token cost: ~XK
   - Load when: [Specific need]

---

## Configuration System

### User Configuration
Path: `user-data/config/user-config.yaml`

```yaml
skill_metadata:
  version: "1.0.0"
  user_name: "Your Name"
  configured_at: "2025-11-03"

feature_settings:
  feature_1:
    enabled: true
    parameters:
      setting_a: "value"
      setting_b: 42
  feature_2:
    enabled: false

paths:
  data_dir: "/Users/username/data"
  cache_dir: "/Users/username/.cache"
```

### Loading Configuration
```python
from scripts.config_loader import load_user_config

config = load_user_config()
feature_enabled = config['feature_settings']['feature_1']['enabled']
```

---

## Data Storage Structure

### Directory Layout

```
user-data/
├── config/           # Configuration files
│   ├── storage-config.yaml      # Storage backend config (CRITICAL)
│   ├── user-config.yaml         # User preferences
│   └── [domain-specific configs]
├── db/              # Dynamic data storage
│   ├── entities/    # Entity data (YAML)
│   └── cache/       # Cached research
└── logs/            # Operation logs
    └── YYYY-MM-DD.log
```

**Note:** With non-local backends (GitHub, Email, Notion), this structure exists virtually in the backend storage, not as local directories.

### YAML Schema Guidelines

**Consistent Structure**:
```yaml
entity_type: "type_name"
entity_id: "unique-identifier"
created_at: "2025-11-03T10:30:00Z"
updated_at: "2025-11-03T10:30:00Z"
version: "1.0"

metadata:
  source: "where_this_came_from"
  confidence: 0.95

data:
  field_1: "value"
  field_2: 42
  nested:
    field_a: "value"
```

**File Naming**:
- Use kebab-case: `entity-name.yaml`
- Include type prefix: `company-acme.yaml`
- Use timestamps for logs: `2025-11-03-operation.yaml`

---

## Python Utilities

### Available Scripts
Located in `skill-package/scripts/`:

1. **yaml_utils.py** - YAML file operations
   ```python
   from scripts.yaml_utils import read_yaml, write_yaml
   
   data = read_yaml('path/to/file.yaml')
   write_yaml(data, 'path/to/output.yaml')
   ```

2. **config_loader.py** - Configuration management
   ```python
   from scripts.config_loader import load_user_config
   
   config = load_user_config()
   ```

3. **storage_utils.py** - File storage helpers
   ```python
   from scripts.storage_utils import ensure_dir, safe_write
   
   ensure_dir('/path/to/directory')
   safe_write(data, '/path/to/file.yaml')
   ```

---

## Workflow Patterns

### Standard Operation Flow

```markdown
1. INITIALIZE
   - Load configuration
   - Validate paths
   - Check token budget
   
2. INPUT PROCESSING
   - Parse user request
   - Validate inputs
   - Check cache

3. RESEARCH (if needed)
   - Load required modules
   - Execute research
   - Cache results

4. ANALYSIS
   - Load analysis modules
   - Process data
   - Generate insights

5. OUTPUT
   - Format results
   - Save to user-data
   - Provide links

6. CLEANUP
   - Update logs
   - Save state
   - Report token usage
```

### Error Handling

```python
try:
    # Attempt operation
    result = perform_operation()
except FileNotFoundError:
    # Handle missing file
    print("❌ File not found. Check path configuration.")
except yaml.YAMLError:
    # Handle YAML parsing error
    print("❌ Invalid YAML format. Check file syntax.")
except Exception as e:
    # Catch-all for unexpected errors
    print(f"❌ Unexpected error: {e}")
    # Log error for debugging
    log_error(e)
```

---

## Session State Management

### DEV_SESSION_STATE.md

Track conversation state in `/DEV_SESSION_STATE.md`:

```markdown
**Last Updated:** 2025-11-03
**Session:** 7
**Token Usage:** 95K / 190K (50%)

## Current Context
- Active task: [Description]
- Progress: [X/Y steps complete]
- Blockers: [Any issues]

## Next Steps
1. Step 1
2. Step 2
3. Step 3

## Archive Policy
- Archive when file > 500 lines
- Archive when session > 50% tokens
```

### State Continuity

At start of each session:
1. Read DEV_SESSION_STATE.md
2. Understand current context
3. Resume from last checkpoint
4. Update state after major milestones

---

## Output Templates

### Template Structure
Located in `skill-package/templates/`:

```yaml
# output-template.yaml
template_metadata:
  name: "Output Template"
  version: "1.0"
  format: "yaml"

sections:
  - name: "Summary"
    fields:
      - title
      - description
      - key_points
  
  - name: "Details"
    fields:
      - detailed_analysis
      - recommendations
      - next_steps

formatting:
  date_format: "%Y-%m-%d"
  number_format: ",.2f"
```

### Using Templates

```python
from scripts.template_loader import load_template, render_template

template = load_template('output-template.yaml')
output = render_template(template, data)
```

---

## Version Management

### Current Version
Tracked in `/version.yaml`:

```yaml
version: "1.0.0"
release_date: "2025-11-03"
status: "stable"
codename: "Initial Release"
```

### Version History
See `/CHANGELOG.md` for detailed release history.

### Semantic Versioning
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

---

## Testing & Validation

### Pre-Deployment Checklist

```bash
# Run validation script
python host_scripts/validate.py

# Check structure
[ ] Directory structure correct
[ ] All required files present
[ ] Paths configured correctly

# Check configuration
[ ] user-config.yaml valid
[ ] All paths accessible
[ ] MCP servers configured

# Check documentation
[ ] SKILL.md complete
[ ] Modules documented
[ ] Examples provided

# Check functionality
[ ] Test basic operations
[ ] Verify output format
[ ] Check error handling
```

---

## Troubleshooting

### Common Issues

**1. "File not found" errors**
- Check paths.py configuration
- Verify MCP filesystem access
- Ensure directories exist

**2. Token budget exceeded**
- Load modules incrementally
- Clear conversation and restart
- Reduce scope of operation

**3. YAML parsing errors**
- Validate YAML syntax
- Check indentation (use spaces, not tabs)
- Verify file encoding (UTF-8)

**4. MCP connection issues**
- Restart Claude Desktop
- Check MCP server configuration
- Verify server logs

### Debug Mode

Enable verbose logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

---

## Performance Optimization

### Token Optimization
- Use core modules + references pattern
- Load detailed docs only when needed
- Cache expensive operations
- Batch similar operations

### Speed Optimization
- Cache research results
- Use local data when possible
- Minimize API calls
- Parallel processing where safe

### Memory Optimization
- Clear large data structures after use
- Use generators for large datasets
- Stream file operations
- Limit cache size

---

## Security & Privacy

### Data Protection
- Never commit user data to git
- Use .gitignore for sensitive files
- Store credentials in environment variables
- Encrypt sensitive data at rest

### Access Control
- Verify file permissions
- Validate user inputs
- Sanitize file paths
- Check for directory traversal

---

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Read feature specification
2. Create feature branch
3. Implement with tests
4. Update documentation
5. Submit pull request

---

## Support

- **Documentation**: See `/docs` directory
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

---

## License

MIT License - See [LICENSE](../../LICENSE)

---

## Acknowledgments

Built with the Claude Skills SDK Template  
https://github.com/yourusername/claude-skills-sdk

---

**Last Updated:** 2025-11-03  
**Skill Version:** 1.0.0  
**SDK Version:** 1.0.0

---

## Quick Reference

**Essential Paths:**
- Config: `skill-package/config/paths.py`
- Modules: `skill-package/modules/`
- User Data: `user-data/`
- Docs: `docs/`

**Essential Commands:**
```bash
# Validate skill
python host_scripts/validate.py

# Create release
./host_scripts/release.sh 1.0.0

# Run setup
./host_scripts/setup.sh
```

**Essential Functions:**
```python
# Load config
from scripts.config_loader import load_user_config
config = load_user_config()

# Read/Write YAML
from scripts.yaml_utils import read_yaml, write_yaml
data = read_yaml('file.yaml')
write_yaml(data, 'output.yaml')
```

---

*End of SKILL.md*
