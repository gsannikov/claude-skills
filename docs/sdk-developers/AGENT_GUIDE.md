# Agent Guide for Claude Skills SDK

**Purpose:** Guide AI agents (Claude, etc.) working on this codebase
**Audience:** AI agents performing development, refactoring, or maintenance
**Last Updated:** 2025-11-13

---

## 🤖 Context Primer

### What is This Repository?

This is the **Claude Skills SDK Template** - a production-ready framework for building Claude Skills with multi-backend storage, automation tools, and best practices.

**Key Facts:**
- **Version:** 1.1.0 (Production Ready)
- **License:** MIT
- **Primary Language:** Python 3.8+, Bash, Markdown
- **Architecture:** Three-tier separation (SDK, Skill Development Tools, Skill Package)
- **Purpose:** Enable developers to build robust Claude skills with persistent storage

### What Makes This Unique?

1. **Multi-Backend Storage Abstraction** - Supports 5 storage backends (Local, GitHub, Checkpoint, Email, Notion)
2. **Token Budget Management** - Progressive loading patterns for Claude's 190K context limit
3. **Three-Layer Architecture** - Clean separation between SDK infrastructure, developer tools, and skill code
4. **Battle-Tested Patterns** - Derived from production skills (Israeli Tech Career Consultant v9.3.0+)
5. **Comprehensive Automation** - Validation, testing, and release automation built-in

---

## 📂 Navigation Guide

### Directory Structure Logic

```
claude-skill-template/
├── sdk/                          # LAYER 1: SDK Infrastructure
│   ├── .github/workflows/        # CI/CD automation (12 comprehensive tests)
│   ├── config/                   # Version management, security configs
│   └── scripts/                  # Release automation
│
├── developer-tools/              # LAYER 2: Skill Developer Tools
│   ├── validate.py               # Structure & config validation
│   ├── setup.sh                  # Initial project setup
│   └── setup-storage.sh          # Storage backend configuration
│
├── skill-package/                # LAYER 3: The Skill Itself
│   ├── SKILL.md                  # Main skill definition (Claude reads this)
│   ├── config/                   # Static configuration
│   ├── scripts/                  # Python utilities (storage.py, config_loader.py)
│   ├── modules/                  # Optional feature modules (lazy-loaded)
│   └── user-data-templates/      # Templates for user-specific data
│
├── user-data/                    # User's Local Data (GITIGNORED)
│   ├── config/                   # User-specific configuration
│   ├── db/                       # Dynamic data storage
│   └── logs/                     # Operation logs
│
├── docs/                         # Documentation Hub
│   ├── skill-developers/         # For skill builders
│   │   ├── getting-started/      # Onboarding (WELCOME, QUICK_SETUP, etc.)
│   │   ├── guides/               # Development guides (architecture, testing)
│   │   └── user-guide/           # End-user documentation
│   ├── sdk-developers/           # For SDK maintainers (YOU ARE HERE)
│   │   ├── architecture/         # Design docs (SDK_DESIGN, STORAGE_DESIGN)
│   │   └── AGENT_GUIDE.md        # This file
│   ├── shared/                   # Shared resources
│   │   ├── CHANGELOG.md          # Version history
│   │   ├── features/roadmap.md   # Product roadmap
│   │   └── resources/            # Blog posts, presentations
│   └── archives/                 # Historical documentation
│
├── releases/                     # Release artifacts (gitignored)
├── README.md                     # Main entry point
├── SDK_DEVELOPMENT.md            # SDK maintainer guide
└── CONTRIBUTING.md               # Contribution guidelines
```

### Quick File Locator

**Need to find...**
- **Storage backend implementation?** → `skill-package/scripts/storage.py`
- **Validation logic?** → `developer-tools/validate.py`
- **CI/CD workflows?** → `sdk/.github/workflows/`
- **Architecture documentation?** → `docs/sdk-developers/architecture/`
- **User onboarding?** → `docs/skill-developers/getting-started/`
- **Version number?** → `sdk/config/version.yaml`
- **Release automation?** → `sdk/scripts/release.sh`
- **Testing documentation?** → `docs/skill-developers/guides/testing-guide.md`

---

## 🏗️ Development Patterns

### 1. Three-Layer Separation Principle

**CRITICAL:** Always respect layer boundaries. Don't mix concerns.

| Layer | Purpose | Who Uses | Can Modify |
|-------|---------|----------|------------|
| **Layer 1: SDK** | Template infrastructure | SDK maintainers | `sdk/`, SDK docs |
| **Layer 2: Dev Tools** | Skill development tools | Skill developers | `developer-tools/`, skill dev docs |
| **Layer 3: Skill Package** | The skill itself | End users (Claude) | `skill-package/` |

**Examples:**
- ✅ Adding a new storage backend → Modify `skill-package/scripts/storage.py` (Layer 3)
- ✅ Adding a new validation check → Modify `developer-tools/validate.py` (Layer 2)
- ✅ Adding a new CI test → Modify `sdk/.github/workflows/` (Layer 1)
- ❌ Putting CI logic in skill-package → WRONG LAYER
- ❌ Putting storage logic in sdk/ → WRONG LAYER

### 2. Storage Abstraction Pattern

All storage operations use the **StorageBackend** abstract class:

```python
# Location: skill-package/scripts/storage.py

class StorageBackend(ABC):
    @abstractmethod
    def save(self, key: str, data: Any) -> bool: pass

    @abstractmethod
    def load(self, key: str) -> Optional[Any]: pass

    @abstractmethod
    def delete(self, key: str) -> bool: pass

    @abstractmethod
    def list_keys(self, prefix: str = "") -> List[str]: pass
```

**When adding a new backend:**
1. Create class inheriting from `StorageBackend`
2. Implement all 4 required methods
3. Add to factory method `get_storage_backend()`
4. Update configuration templates
5. Document in `docs/skill-developers/getting-started/DEPENDENCIES.md`

### 3. Token Budget Management

**Problem:** Claude has 190K token limit. Loading everything exhausts tokens quickly.

**Solution:** Progressive loading pattern

```
Bootstrap (Always):
- SKILL.md (~2K tokens)
- Core config (~1K tokens)
Total: ~3K tokens

On-Demand (When Needed):
- Individual modules (~5-15K each)
- Load only when user requests feature

Archive (At 50% threshold):
- At 95K tokens, save state and start fresh
```

**When creating new content:**
- Keep core SKILL.md under 3K tokens
- Break features into optional modules (5-15K each)
- Add token estimates to module headers
- Document load strategy (always vs on-demand)

### 4. Configuration Management

**Centralized Config:** `sdk/config/config_loader.py`

```python
# Usage pattern:
from sdk.config.config_loader import get_config

config = get_config()
version = config['version']
```

**Configuration Files:**
- `sdk/config/version.yaml` - Template version
- `skill-package/config/paths.py` - File system paths
- `user-data/config/storage-config.yaml` - User's storage setup (gitignored)

**When modifying configuration:**
1. Update schema in `config_loader.py` if needed
2. Update templates in `skill-package/user-data-templates/config/`
3. Update validation in `developer-tools/validate.py`
4. Document changes in CHANGELOG.md

### 5. Validation Pattern

All changes should pass validation: `python developer-tools/validate.py`

**Validation Checks:**
- Directory structure integrity
- SKILL.md format compliance
- Configuration file syntax (YAML)
- Python script imports and syntax
- Template completeness
- Documentation completeness

**CI/CD has 12 additional tests:**
- Python syntax validation
- Shell script validation
- Markdown link checking
- Storage configuration testing
- Documentation completeness
- Security scanning (gitleaks)
- Code linting
- YAML syntax validation
- Path validation
- Import validation
- Template validation
- Release process validation

---

## 🛠️ Common Tasks

### Task 1: Adding a New Storage Backend

**Example: Adding Redis backend**

1. **Implement backend class** in `skill-package/scripts/storage.py`:
```python
class RedisBackend(StorageBackend):
    def __init__(self, config: dict):
        self.host = config.get('host', 'localhost')
        self.port = config.get('port', 6379)
        # Initialize Redis connection

    def save(self, key: str, data: Any) -> bool:
        # Implementation

    def load(self, key: str) -> Optional[Any]:
        # Implementation

    def delete(self, key: str) -> bool:
        # Implementation

    def list_keys(self, prefix: str = "") -> List[str]:
        # Implementation
```

2. **Update factory method**:
```python
def get_storage_backend(config_path: str = None) -> StorageBackend:
    # ... existing code ...
    if backend_type == 'redis':
        return RedisBackend(config['storage']['redis'])
```

3. **Create config template** in `skill-package/user-data-templates/config/storage-config-redis-template.yaml`

4. **Update validation** in `developer-tools/validate.py`

5. **Add CI test** in `sdk/.github/workflows/comprehensive-tests.yml`

6. **Document** in:
   - `docs/skill-developers/getting-started/DEPENDENCIES.md`
   - `docs/sdk-developers/architecture/STORAGE_DESIGN.md`
   - `docs/shared/CHANGELOG.md`

### Task 2: Adding a New Validation Check

**Example: Validate Python docstrings**

1. **Add check method** in `developer-tools/validate.py`:
```python
def validate_docstrings(self) -> bool:
    """Validate that all Python functions have docstrings"""
    print("Checking docstrings...")
    # Implementation
    if errors:
        self.errors.extend(errors)
        return False
    return True
```

2. **Add to validation suite**:
```python
checks = [
    # ... existing checks ...
    ("Python Docstrings", self.validate_docstrings),
]
```

3. **Update documentation** in `docs/skill-developers/guides/testing-guide.md`

### Task 3: Creating a Release

1. **Update version** in `sdk/config/version.yaml`:
```yaml
version: "1.2.0"
```

2. **Update CHANGELOG** in `docs/shared/CHANGELOG.md`:
```markdown
## [1.2.0] - 2025-11-13

### Added
- New feature X
- New validation Y

### Changed
- Improved Z

### Fixed
- Bug fix A
```

3. **Run release script**:
```bash
bash sdk/scripts/release.sh
```

4. **Create GitHub release** with tag `v1.2.0`

### Task 4: Adding Documentation

**Guidelines:**
- Use clear, concise language
- Include code examples
- Add navigation links
- Update last modified date
- Follow existing markdown style
- Add to documentation structure map in `docs/shared/DOCUMENTATION_STRUCTURE.md`

**Structure:**
```markdown
# Title

**Purpose:** One-line description
**Audience:** Who should read this
**Last Updated:** YYYY-MM-DD

---

## Section 1
Content...

## Section 2
Content...

---

**Layer:** [1/2/3/Shared]
```

### Task 5: Refactoring Code

**When refactoring:**

1. **Understand layer boundaries** - Don't move code across layers without reason
2. **Run validation** - Before and after changes
3. **Update tests** - Ensure CI passes
4. **Update documentation** - Reflect changes in docs
5. **Check backward compatibility** - Don't break existing skills
6. **Follow naming conventions** - Match existing patterns

**Naming Conventions:**
- Files: `lowercase_with_underscores.py`, `UPPERCASE_FOR_IMPORTANT.md`
- Classes: `PascalCase`
- Functions: `snake_case`
- Constants: `UPPER_SNAKE_CASE`
- Private: `_leading_underscore`

---

## 🚫 Constraints & Guidelines

### What You MUST NOT Do

1. **❌ Never modify user-data/ in version control**
   - This directory is gitignored for a reason
   - Contains user-specific secrets and data
   - Only modify templates in `skill-package/user-data-templates/`

2. **❌ Never hardcode paths or secrets**
   - Use configuration files
   - Read from `skill-package/config/paths.py`
   - Store secrets in gitignored user-data/config/

3. **❌ Never break backward compatibility without version bump**
   - Breaking changes require MAJOR version bump
   - Provide migration guide in CHANGELOG
   - Announce breaking changes prominently

4. **❌ Never skip validation**
   - Always run `python developer-tools/validate.py`
   - Ensure CI passes before merging
   - Fix all errors, not just warnings

5. **❌ Never commit without updating documentation**
   - Update relevant docs
   - Update CHANGELOG if user-facing
   - Add inline comments for complex logic

6. **❌ Never create files outside the established structure**
   - Respect three-layer architecture
   - Use existing directories
   - If new structure needed, document rationale

### What You SHOULD Do

1. **✅ Always respect layer separation**
   - Understand which layer you're modifying
   - Don't mix concerns
   - Follow existing patterns

2. **✅ Always add tests**
   - Add validation checks for new features
   - Update CI workflows
   - Test locally before pushing

3. **✅ Always document**
   - Update relevant documentation
   - Add inline comments
   - Update CHANGELOG for user-facing changes

4. **✅ Always follow existing patterns**
   - Match code style
   - Use established naming conventions
   - Follow architectural principles

5. **✅ Always consider token budget**
   - Keep SKILL.md lean
   - Use progressive loading
   - Add token estimates

6. **✅ Always validate configuration**
   - Check YAML syntax
   - Validate required fields
   - Provide clear error messages

---

## 🧪 Testing & Validation

### Local Validation

**Always run before committing:**
```bash
python developer-tools/validate.py
```

**Expected output:**
```
🔍 Validating Claude Skill Structure...

✓ Directory Structure passed
✓ SKILL.md Format passed
✓ Configuration Files passed
✓ Python Scripts passed
✓ Templates passed
✓ Documentation passed

✨ All checks passed!
```

### CI/CD Tests (GitHub Actions)

**Comprehensive Tests** (`sdk/.github/workflows/comprehensive-tests.yml`):

1. Python syntax validation
2. Python import checking
3. Shell script validation
4. Markdown link checking
5. YAML syntax validation
6. Storage configuration testing
7. Path validation
8. Template validation
9. Documentation completeness
10. Security scanning (gitleaks)
11. Code linting
12. Release process validation

**When these run:**
- On pull requests
- On pushes to main branch
- On release tags

### Manual Testing

**For SDK changes:**
1. Create a test skill using the template
2. Test all storage backends
3. Verify automation scripts work
4. Check documentation accuracy

**For skill changes:**
1. Upload to Claude Desktop
2. Test all features
3. Verify storage operations
4. Check error handling

---

## 📋 Best Practices

### Code Quality

1. **Follow PEP 8** for Python code
2. **Use type hints** for function signatures
3. **Add docstrings** to all functions and classes
4. **Handle errors gracefully** - Don't crash, inform user
5. **Log appropriately** - Help with debugging

### Documentation Quality

1. **Write for your audience** - Different docs for different users
2. **Use examples** - Show, don't just tell
3. **Keep it updated** - Stale docs are worse than no docs
4. **Link liberally** - Connect related documentation
5. **Use consistent formatting** - Follow existing patterns

### Git Practices

1. **Use conventional commits**:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `refactor:` - Code refactoring
   - `test:` - Test additions/updates
   - `chore:` - Maintenance tasks

2. **Write clear commit messages**:
   ```
   feat: add Redis storage backend

   - Implement RedisBackend class
   - Add configuration template
   - Update documentation
   - Add validation tests
   ```

3. **Keep commits focused** - One logical change per commit

4. **Test before pushing** - Don't break CI

### Security Practices

1. **Never commit secrets** - Use .gitignore, check with gitleaks
2. **Validate all inputs** - Don't trust user input
3. **Use secure defaults** - Fail closed, not open
4. **Document security considerations** - Help users stay secure
5. **Scan dependencies** - Keep requirements up to date

---

## 🔧 Troubleshooting

### Common Issues

**Issue: Validation fails on import checks**
```
Solution: Ensure all Python scripts have correct imports
Check: sys.path modifications in scripts
```

**Issue: CI tests fail but local validation passes**
```
Solution: Run tests in clean environment
Check: Dependencies in requirements.txt
```

**Issue: Storage configuration not found**
```
Solution: User needs to copy templates to user-data/
Check: Documentation in DEPENDENCIES.md
```

**Issue: Token budget exceeded in Claude**
```
Solution: Break content into optional modules
Check: Progressive loading pattern in architecture.md
```

### Debugging Tips

1. **Check validation output** - Run `validate.py` first
2. **Review CI logs** - GitHub Actions provides detailed logs
3. **Test in isolation** - Create minimal reproduction
4. **Check documentation** - Often answers are in docs
5. **Review recent changes** - Use `git log` and `git blame`

---

## 📚 Key Documentation References

### For SDK Development

- [SDK_DEVELOPMENT.md](../../SDK_DEVELOPMENT.md) - SDK maintainer guide
- [SDK_DESIGN.md](architecture/SDK_DESIGN.md) - Design philosophy
- [STORAGE_DESIGN.md](architecture/STORAGE_DESIGN.md) - Storage architecture

### For Understanding the Project

- [README.md](../../README.md) - Project overview
- [WELCOME.md](../skill-developers/getting-started/WELCOME.md) - New user intro
- [architecture.md](../skill-developers/guides/architecture.md) - System architecture

### For Contributors

- [CONTRIBUTING.md](../../CONTRIBUTING.md) - Contribution guidelines
- [CODE_OF_CONDUCT.md](../../CODE_OF_CONDUCT.md) - Community standards
- [CHANGELOG.md](../shared/CHANGELOG.md) - Version history

---

## 🎯 Quick Reference

### File Path Patterns

```python
# SDK Infrastructure
sdk/.github/workflows/*.yml          # CI/CD workflows
sdk/config/*.yaml                     # SDK configuration
sdk/scripts/*.sh                      # Release automation

# Developer Tools
developer-tools/*.py                  # Validation, setup scripts
developer-tools/*.sh                  # Shell automation

# Skill Package
skill-package/SKILL.md                # Main skill definition
skill-package/config/*.py             # Static configuration
skill-package/scripts/*.py            # Python utilities
skill-package/modules/*.md            # Optional feature modules
skill-package/user-data-templates/    # User data templates

# Documentation
docs/skill-developers/                # For skill builders
docs/sdk-developers/                  # For SDK maintainers
docs/shared/                          # Shared resources
```

### Command Reference

```bash
# Validation
python developer-tools/validate.py

# Setup
bash developer-tools/setup.sh
bash developer-tools/setup-storage.sh

# Release
bash sdk/scripts/release.sh

# Git
git checkout -b feature/your-feature
git commit -m "feat: description"
git push origin feature/your-feature
```

### Version Management

```yaml
# sdk/config/version.yaml
version: "MAJOR.MINOR.PATCH"

# Semantic Versioning:
# MAJOR: Breaking changes
# MINOR: New features (backward compatible)
# PATCH: Bug fixes
```

---

## 🤝 Working with This Guide

### When to Consult This Guide

- Starting work on this codebase
- Unsure about architectural decisions
- Adding new features
- Refactoring existing code
- Creating documentation
- Debugging issues

### How to Update This Guide

1. Keep it current with codebase changes
2. Add new patterns as they emerge
3. Document common pitfalls
4. Include examples from real situations
5. Update last modified date

---

## 🎓 Learning Path for AI Agents

### Phase 1: Understanding (30 minutes)

1. Read this entire guide
2. Review README.md for project overview
3. Explore directory structure
4. Read architecture documentation

### Phase 2: Familiarization (1 hour)

1. Read key Python scripts (storage.py, validate.py, config_loader.py)
2. Review CI/CD workflows
3. Understand validation patterns
4. Study documentation structure

### Phase 3: Practice (2+ hours)

1. Make a small documentation update
2. Add a new validation check
3. Create a new storage backend
4. Write a new test
5. Update CHANGELOG appropriately

---

**Layer:** 1 (SDK Development)
**Audience:** AI Agents
**Maintenance:** Update when architectural patterns change
**Last Updated:** 2025-11-13
