# Troubleshooting Guide

**Purpose:** Solutions to common problems when building Claude skills
**Audience:** Skill developers using this template
**Last Updated:** 2025-11-13

---

## 🔍 Quick Diagnostic

### First Steps for Any Issue

1. **Run validation:**
   ```bash
   python developer-tools/validate.py
   ```

2. **Check logs:**
   ```bash
   ls -la user-data/logs/
   cat user-data/logs/operations.log
   ```

3. **Verify storage configuration:**
   ```bash
   cat user-data/config/storage-config.yaml
   ```

4. **Check file permissions:**
   ```bash
   ls -la user-data/
   ls -la skill-package/
   ```

---

## 🚨 Common Issues & Solutions

### Category: Setup & Installation

#### Issue: `validate.py` fails with import errors

**Symptom:**
```
ImportError: No module named 'yaml'
```

**Cause:** Missing Python dependencies

**Solution:**
```bash
# Install required dependencies
pip3 install pyyaml

# Or install all requirements
pip3 install -r requirements.txt
```

**Prevention:** Always run `pip3 install -r requirements.txt` after cloning

---

#### Issue: `user-data/` directory doesn't exist

**Symptom:**
```
FileNotFoundError: [Errno 2] No such file or directory: 'user-data/config'
```

**Cause:** Templates not copied to user-data

**Solution:**
```bash
# Copy templates
cp -r skill-package/user-data-templates/* user-data/

# Create directories if needed
mkdir -p user-data/config user-data/db user-data/logs
```

**Prevention:** Run `bash developer-tools/setup.sh` for automated setup

---

#### Issue: Permission denied errors

**Symptom:**
```
PermissionError: [Errno 13] Permission denied: 'user-data/db/data.yaml'
```

**Cause:** Incorrect file permissions

**Solution:**
```bash
# Fix permissions for user-data directory
chmod -R 755 user-data/

# For specific file
chmod 644 user-data/db/data.yaml
```

**Prevention:** Don't run scripts with `sudo` unless absolutely necessary

---

### Category: Storage Configuration

#### Issue: Storage configuration not found

**Symptom:**
```
Error: Storage configuration file not found at user-data/config/storage-config.yaml
```

**Cause:** Storage config not created from template

**Solution:**
```bash
# Copy template
cd user-data/config
cp storage-config-template.yaml storage-config.yaml

# Edit with your settings
nano storage-config.yaml
```

**Prevention:** Follow [QUICK_SETUP.md](../getting-started/QUICK_SETUP.md) carefully

---

#### Issue: GitHub storage authentication fails

**Symptom:**
```
Error: Authentication failed for GitHub API
```

**Cause:** Invalid or missing GitHub token

**Solution:**
```bash
# 1. Generate new personal access token at:
#    https://github.com/settings/tokens
#    Required scopes: repo (full control)

# 2. Update storage-config.yaml
storage:
  backend: github
  github:
    token: "ghp_YourNewTokenHere"
    repo: "username/repo-name"
    branch: "main"

# 3. Test connection
python skill-package/scripts/storage.py
```

**Prevention:**
- Use tokens with correct scopes
- Store tokens in gitignored user-data/config/
- Never commit tokens to version control

---

#### Issue: Local storage path not found

**Symptom:**
```
Error: Storage directory does not exist: /path/to/user-data
```

**Cause:** Relative or incorrect path in configuration

**Solution:**
```bash
# Get absolute path
pwd  # Note the full path

# Update storage-config.yaml with absolute path
storage:
  backend: local
  local:
    base_path: /absolute/path/to/claude-skill-template/user-data
```

**Prevention:** Always use absolute paths in storage configuration

---

#### Issue: Email storage not sending/receiving

**Symptom:**
```
Error: Failed to send email via SMTP
```

**Cause:** Incorrect SMTP configuration or app password

**Solution:**
```yaml
# For Gmail, use App Password (not regular password)
# 1. Enable 2FA on your Google account
# 2. Generate App Password at: https://myaccount.google.com/apppasswords
# 3. Update storage-config.yaml

storage:
  backend: email
  email:
    smtp_server: smtp.gmail.com
    smtp_port: 587
    username: your.email@gmail.com
    password: "your-app-password-here"  # Use App Password
    from_address: your.email@gmail.com
    to_address: your.email@gmail.com
```

**Prevention:** Use app-specific passwords, not account passwords

---

### Category: Claude Integration

#### Issue: Claude doesn't recognize storage commands

**Symptom:**
Claude responds with "I don't have access to storage operations"

**Cause:** MCP Filesystem server not configured or SKILL.md not loaded

**Solution:**
```bash
# 1. Verify MCP server is running in Claude Desktop
# 2. Re-upload skill-package/ to Claude
# 3. In Claude, say: "Load the skill from SKILL.md"
# 4. Test with: "Save test data"
```

**Prevention:**
- Ensure MCP Filesystem is configured in Claude Desktop
- Always upload entire skill-package/ directory

---

#### Issue: Token budget exceeded error

**Symptom:**
Claude says "I've reached my token limit"

**Cause:** Too much content loaded at once

**Solution:**
```
# In Claude conversation:
1. Ask Claude to "Archive current session state"
2. Start a new conversation
3. Upload skill-package/ again
4. Say: "Load previous session state"
5. Continue working
```

**Prevention:**
- Keep SKILL.md under 3K tokens
- Use optional modules for large features
- Enable automatic archiving at 50% threshold

---

#### Issue: Claude can't find configuration files

**Symptom:**
```
Error: Could not load configuration from skill-package/config/
```

**Cause:** Configuration files not uploaded or paths incorrect

**Solution:**
```bash
# 1. Verify files exist locally
ls -la skill-package/config/

# 2. Check paths.py has correct paths
cat skill-package/config/paths.py

# 3. Re-upload entire skill-package/ to Claude

# 4. In Claude, verify with:
#    "Show me the contents of paths.py"
```

**Prevention:** Always upload the complete skill-package/ directory

---

### Category: Validation Errors

#### Issue: Validation fails on YAML syntax

**Symptom:**
```
Error: Invalid YAML syntax in user-data/config/storage-config.yaml
```

**Cause:** Incorrect YAML formatting (indentation, quotes, etc.)

**Solution:**
```bash
# Test YAML syntax
python3 -c "import yaml; yaml.safe_load(open('user-data/config/storage-config.yaml'))"

# Common fixes:
# - Use 2 spaces for indentation (not tabs)
# - Quote strings with special characters
# - Ensure proper nesting
```

**Example of correct YAML:**
```yaml
storage:
  backend: local
  local:
    base_path: /path/to/directory
```

**Prevention:** Use a YAML validator or editor with syntax highlighting

---

#### Issue: Validation fails on Python imports

**Symptom:**
```
Error: Python script has invalid imports: skill-package/scripts/storage.py
```

**Cause:** Missing dependencies or circular imports

**Solution:**
```bash
# 1. Check imports in file
cat skill-package/scripts/storage.py | grep "^import\|^from"

# 2. Install missing dependencies
pip3 install -r requirements.txt

# 3. Test imports directly
python3 -c "from skill-package.scripts.storage import StorageBackend"
```

**Prevention:** Keep imports clean and dependencies documented in requirements.txt

---

#### Issue: Markdown links broken in docs

**Symptom:**
```
Warning: Broken link in docs/skill-developers/README.md
```

**Cause:** File moved or renamed without updating links

**Solution:**
```bash
# Find all markdown files with links to moved file
grep -r "old-file-name.md" docs/

# Update links in each file
# Use relative paths from the linking file's location
```

**Prevention:**
- Use validation before committing
- Update all references when moving files
- Use relative paths in markdown links

---

### Category: Module Loading

#### Issue: Optional module fails to load

**Symptom:**
Claude says "Module X could not be loaded"

**Cause:** Module file missing or incorrect path

**Solution:**
```bash
# 1. Verify module exists
ls -la skill-package/modules/

# 2. Check SKILL.md references correct path
grep "modules/" skill-package/SKILL.md

# 3. Ensure module follows naming convention
# Good: feature-name.md
# Bad: Feature Name.md (spaces), FeatureName.md (capitals)

# 4. Re-upload to Claude if needed
```

**Prevention:**
- Use lowercase-with-dashes for module filenames
- Document all modules in SKILL.md

---

#### Issue: Module dependencies create circular load

**Symptom:**
Infinite loop or "Maximum recursion depth exceeded"

**Cause:** Module A loads Module B, which loads Module A

**Solution:**
```bash
# 1. Map module dependencies
grep -A5 "Dependencies:" skill-package/modules/*.md

# 2. Refactor to remove circular dependency:
#    - Move shared code to a utility module
#    - Have both modules import from utilities
#    - Or merge the two modules if tightly coupled

# 3. Update module headers with correct dependencies
```

**Prevention:** Document and review module dependencies before creating

---

### Category: Data & Files

#### Issue: Data file corruption

**Symptom:**
```
Error: Could not parse YAML file: user-data/db/data.yaml
```

**Cause:** File corruption, invalid data, or concurrent write access

**Solution:**
```bash
# 1. Check file contents
cat user-data/db/data.yaml

# 2. Look for common issues:
#    - Truncated file
#    - Non-YAML content
#    - Mixed indentation

# 3. Restore from backup if available
ls -la user-data/db/.backup/
cp user-data/db/.backup/data.yaml.backup user-data/db/data.yaml

# 4. If no backup, recreate from template
```

**Prevention:**
- Implement backup strategy
- Validate data before writing
- Use atomic write operations

---

#### Issue: Storage backend returns empty data

**Symptom:**
Claude says "No data found" when data should exist

**Cause:** Wrong storage key, backend misconfiguration, or data loss

**Solution:**
```bash
# 1. List all storage keys
python3 << EOF
from skill-package.scripts.storage import get_storage_backend
backend = get_storage_backend('user-data/config/storage-config.yaml')
keys = backend.list_keys()
print("Available keys:", keys)
EOF

# 2. Verify data exists in storage
# For local: ls -la user-data/db/
# For GitHub: Check repository on github.com
# For email: Check inbox

# 3. Test load operation
python3 << EOF
from skill-package.scripts.storage import get_storage_backend
backend = get_storage_backend('user-data/config/storage-config.yaml')
data = backend.load('your-key')
print("Data:", data)
EOF
```

**Prevention:**
- Use consistent storage keys
- Implement data validation
- Regular backups

---

### Category: Git & Version Control

#### Issue: User data accidentally committed

**Symptom:**
Git status shows `user-data/config/*.yaml` as staged

**Cause:** .gitignore not working or files added with --force

**Solution:**
```bash
# 1. Remove from staging
git reset user-data/

# 2. Verify .gitignore includes user-data
cat .gitignore | grep "user-data"

# 3. If already committed, remove from history (careful!)
git rm --cached -r user-data/
git commit -m "Remove accidentally committed user data"

# 4. For sensitive data already pushed, consider rotating secrets
```

**Prevention:**
- Check `git status` before committing
- Never use `git add --force` in user-data/
- Review .gitignore regularly

---

#### Issue: Merge conflicts in documentation

**Symptom:**
```
CONFLICT (content): Merge conflict in docs/shared/CHANGELOG.md
```

**Cause:** Multiple changes to same documentation file

**Solution:**
```bash
# 1. View conflict
cat docs/shared/CHANGELOG.md

# 2. Edit file to resolve (remove <<<, ===, >>> markers)
nano docs/shared/CHANGELOG.md

# 3. Stage resolved file
git add docs/shared/CHANGELOG.md

# 4. Complete merge
git commit
```

**Prevention:**
- Pull before starting work
- Communicate with team about doc changes
- Use feature branches

---

### Category: Performance

#### Issue: Slow storage operations

**Symptom:**
Save/load operations take >5 seconds

**Cause:** Network latency (GitHub/email) or large data files

**Solution:**
```bash
# 1. Measure operation time
time python3 -c "
from skill-package.scripts.storage import get_storage_backend
backend = get_storage_backend()
backend.save('test', {'data': 'value'})
"

# 2. For GitHub storage:
#    - Use smaller data chunks
#    - Cache frequently accessed data
#    - Consider local storage for temporary data

# 3. For large data:
#    - Split into multiple files
#    - Compress data before saving
#    - Use pagination for lists

# 4. Profile to find bottleneck
python3 -m cProfile skill-package/scripts/storage.py
```

**Prevention:**
- Design for small, frequent operations
- Cache when appropriate
- Use local storage for temporary data

---

#### Issue: validate.py takes too long

**Symptom:**
Validation takes >30 seconds to complete

**Cause:** Large codebase or too many files to check

**Solution:**
```bash
# 1. Profile validation
time python developer-tools/validate.py

# 2. Skip expensive checks during development
#    (Edit validate.py to comment out slow checks temporarily)

# 3. Optimize validation logic
#    - Add early returns
#    - Cache file reads
#    - Parallelize independent checks
```

**Prevention:**
- Keep skill-package reasonably sized
- Run validation before committing, not after every change

---

## 🔧 Debugging Techniques

### Enable Verbose Logging

```python
# Add to skill-package/scripts/storage.py or other scripts
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### Test Storage Operations Directly

```bash
python3 << EOF
from skill-package.scripts.storage import get_storage_backend

# Initialize
backend = get_storage_backend('user-data/config/storage-config.yaml')

# Test save
success = backend.save('test-key', {'test': 'data'})
print(f"Save: {success}")

# Test load
data = backend.load('test-key')
print(f"Load: {data}")

# Test list
keys = backend.list_keys()
print(f"Keys: {keys}")

# Test delete
success = backend.delete('test-key')
print(f"Delete: {success}")
EOF
```

### Check File Integrity

```bash
# Verify all required files exist
required_files=(
    "skill-package/SKILL.md"
    "skill-package/config/paths.py"
    "user-data/config/storage-config.yaml"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file exists"
    else
        echo "✗ $file missing"
    fi
done
```

### Validate YAML Files

```bash
# Check all YAML files
find . -name "*.yaml" -o -name "*.yml" | while read file; do
    python3 -c "import yaml; yaml.safe_load(open('$file'))" && \
        echo "✓ $file valid" || \
        echo "✗ $file invalid"
done
```

---

## 📞 Getting Help

### Before Asking for Help

1. **Search existing issues** on GitHub
2. **Check documentation** in docs/
3. **Run validation** and include output
4. **Collect error messages** with full stack traces
5. **Note your environment**:
   - OS and version
   - Python version
   - Storage backend used
   - Steps to reproduce

### How to Ask for Help

**Good Issue Report:**
```markdown
## Problem
Brief description of the issue

## Environment
- OS: macOS 13.0
- Python: 3.11.0
- Storage: GitHub
- Template Version: 1.1.0

## Steps to Reproduce
1. Run setup.sh
2. Configure GitHub storage
3. Run validate.py

## Expected Behavior
Validation should pass

## Actual Behavior
Error: Authentication failed

## Error Messages
[Full error output here]

## What I've Tried
- Regenerated GitHub token
- Verified token permissions
- Checked storage-config.yaml syntax
```

### Where to Get Help

- **GitHub Issues:** Bug reports and specific problems
- **GitHub Discussions:** General questions and ideas
- **Documentation:** Check docs/ directory first
- **Examples:** Look at example skills in skill-package/examples/

---

## 🎓 Learning Resources

### Recommended Reading Order

1. [QUICK_SETUP.md](../getting-started/QUICK_SETUP.md) - Initial setup
2. [architecture.md](../guides/architecture.md) - System design
3. [storage-selection.md](../guides/storage-selection.md) - Choose storage
4. [testing-guide.md](../guides/testing-guide.md) - Testing strategies
5. This troubleshooting guide

### External Resources

- **Claude Documentation:** [claude.ai/docs](https://claude.ai/docs)
- **Python YAML:** [pyyaml.org](https://pyyaml.org)
- **Git Documentation:** [git-scm.com/doc](https://git-scm.com/doc)
- **GitHub API:** [docs.github.com/rest](https://docs.github.com/rest)

---

## 🔄 Common Workflows

### Recovery from Corrupted State

```bash
# 1. Backup current state
cp -r user-data user-data.backup

# 2. Reset to templates
rm -rf user-data/*
cp -r skill-package/user-data-templates/* user-data/

# 3. Restore configuration
cp user-data.backup/config/storage-config.yaml user-data/config/

# 4. Validate
python developer-tools/validate.py

# 5. Restore data if possible
cp -r user-data.backup/db/* user-data/db/
```

### Switching Storage Backends

```bash
# 1. Export data from current backend
python3 << EOF
from skill-package.scripts.storage import get_storage_backend

old_backend = get_storage_backend('user-data/config/storage-config.yaml')
keys = old_backend.list_keys()

export_data = {}
for key in keys:
    export_data[key] = old_backend.load(key)

import json
with open('data-export.json', 'w') as f:
    json.dump(export_data, f)
EOF

# 2. Update storage-config.yaml with new backend settings

# 3. Import data to new backend
python3 << EOF
import json
from skill-package.scripts.storage import get_storage_backend

with open('data-export.json') as f:
    export_data = json.load(f)

new_backend = get_storage_backend('user-data/config/storage-config.yaml')
for key, data in export_data.items():
    new_backend.save(key, data)
EOF

# 4. Validate
python developer-tools/validate.py
```

---

**Layer:** 2 (Skill Development)
**Audience:** Skill developers
**Last Updated:** 2025-11-13

**Questions not answered here?** Open an issue or check the [FAQ](faq.md)!
