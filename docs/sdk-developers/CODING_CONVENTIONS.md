# Coding Conventions

**Purpose:** Establish consistent coding standards across the project
**Audience:** Contributors, SDK developers, skill developers
**Last Updated:** 2025-11-13

---

## 🎯 Philosophy

**Consistency over cleverness.** Code should be:
- **Readable** - Clear and self-documenting
- **Maintainable** - Easy to modify and extend
- **Tested** - Validated and reliable
- **Documented** - Well-explained

**When in doubt, follow existing patterns in the codebase.**

---

## 🐍 Python Standards

### Style Guide

**Base:** Follow [PEP 8](https://pep8.org/) - Style Guide for Python Code

**Key Rules:**
- 4 spaces for indentation (never tabs)
- 79 characters maximum line length
- 2 blank lines between top-level definitions
- 1 blank line between method definitions
- UTF-8 encoding

### Naming Conventions

```python
# Modules and packages
lowercase_with_underscores.py

# Classes
class PascalCase:
    pass

# Functions and methods
def snake_case_function():
    pass

# Constants
UPPER_SNAKE_CASE = "value"

# Private variables/methods
_leading_underscore = "private"

# "Magic" methods
__double_leading_and_trailing__

# Instance variables
self.instance_variable = value
```

### Import Ordering

```python
# 1. Standard library imports
import os
import sys
from pathlib import Path

# 2. Related third-party imports
import yaml
from typing import Dict, List, Optional

# 3. Local application imports
from config_loader import get_config
from storage import StorageBackend
```

**Additional rules:**
- Group imports by category (standard lib, third-party, local)
- Sort alphabetically within each group
- Use absolute imports, not relative
- One import per line (except `from X import a, b, c`)

### Type Hints

**Always use type hints for function signatures:**

```python
from typing import Dict, List, Optional, Any

def process_data(
    input_data: Dict[str, Any],
    options: Optional[List[str]] = None
) -> bool:
    """Process data with given options.

    Args:
        input_data: Dictionary containing data to process
        options: Optional list of processing options

    Returns:
        True if processing succeeded, False otherwise
    """
    if options is None:
        options = []

    # Implementation
    return True
```

**Type hint guidelines:**
- Use for all function parameters
- Use for all return types
- Use `Optional[T]` for nullable types
- Use `List[T]`, `Dict[K, V]`, etc. for collections
- Use `Any` sparingly (prefer specific types)

### Docstrings

**Use Google-style docstrings:**

```python
def complex_function(param1: str, param2: int, param3: bool = False) -> Dict[str, Any]:
    """Brief description of what function does.

    More detailed explanation if needed. This can span
    multiple lines and paragraphs.

    Args:
        param1: Description of param1
        param2: Description of param2
        param3: Description of param3 (default: False)

    Returns:
        Dictionary containing:
            - key1: Description of key1
            - key2: Description of key2

    Raises:
        ValueError: If param2 is negative
        TypeError: If param1 is not a string

    Example:
        >>> result = complex_function("test", 42)
        >>> print(result['key1'])
        'value1'
    """
    if param2 < 0:
        raise ValueError("param2 must be non-negative")

    return {"key1": "value1", "key2": "value2"}
```

**Class docstrings:**

```python
class StorageBackend:
    """Abstract base class for storage backends.

    All storage backends must inherit from this class and implement
    the four required methods: save, load, delete, and list_keys.

    Attributes:
        config: Configuration dictionary for the backend
        initialized: Whether the backend has been initialized

    Example:
        class LocalBackend(StorageBackend):
            def save(self, key: str, data: Any) -> bool:
                # Implementation
                pass
    """

    def __init__(self, config: Dict[str, Any]):
        """Initialize storage backend.

        Args:
            config: Backend configuration dictionary
        """
        self.config = config
        self.initialized = False
```

### Error Handling

**Use specific exceptions:**

```python
# ❌ Bad - too generic
try:
    process_data(data)
except Exception as e:
    print(f"Error: {e}")

# ✅ Good - specific exceptions
try:
    process_data(data)
except ValueError as e:
    logger.error(f"Invalid data: {e}")
    return None
except KeyError as e:
    logger.error(f"Missing key: {e}")
    raise
except Exception as e:
    logger.error(f"Unexpected error: {e}")
    # Handle or re-raise as appropriate
```

**Always provide context:**

```python
# ❌ Bad - no context
raise ValueError("Invalid value")

# ✅ Good - clear context
raise ValueError(
    f"Expected positive integer for 'count', got {count} (type: {type(count).__name__})"
)
```

### Logging

**Use Python's logging module:**

```python
import logging

# Configure at module level
logger = logging.getLogger(__name__)

def process_file(filepath: str) -> bool:
    """Process a file."""
    logger.debug(f"Starting to process file: {filepath}")

    try:
        # Processing logic
        logger.info(f"Successfully processed {filepath}")
        return True
    except FileNotFoundError:
        logger.error(f"File not found: {filepath}")
        return False
    except Exception as e:
        logger.exception(f"Failed to process {filepath}: {e}")
        return False
```

**Logging levels:**
- `DEBUG` - Detailed information for diagnosing problems
- `INFO` - General informational messages
- `WARNING` - Warning messages (recoverable issues)
- `ERROR` - Error messages (operation failed)
- `CRITICAL` - Critical errors (system failure)

### Code Organization

**Function length:**
- Prefer functions under 50 lines
- If longer, consider breaking into smaller functions
- Each function should do one thing well

**File length:**
- Prefer files under 500 lines
- If longer, consider splitting into multiple modules

**Module structure:**
```python
"""Module docstring describing purpose."""

# Imports
import standard_lib
from third_party import something
from local import module

# Constants
MAX_RETRIES = 3
DEFAULT_TIMEOUT = 30

# Classes
class MyClass:
    pass

# Functions
def my_function():
    pass

# Main execution (if applicable)
if __name__ == "__main__":
    main()
```

---

## 📝 Markdown Standards

### File Naming

```
# Documentation files
UPPERCASE_FOR_IMPORTANT.md  # README, CONTRIBUTING, CHANGELOG
lowercase-with-dashes.md     # architecture, troubleshooting, faq
```

### Document Structure

```markdown
# Title (H1 - only one per document)

**Purpose:** One-line description
**Audience:** Who should read this
**Last Updated:** YYYY-MM-DD

---

## Section (H2)

Content here...

### Subsection (H3)

More specific content...

#### Sub-subsection (H4)

Rarely needed, but available...

---

**Footer metadata if needed**
*Last updated: YYYY-MM-DD*
```

### Formatting Guidelines

**Headers:**
- Use `#` style, not `===` or `---` underlines
- No trailing `#` marks
- One blank line before and after headers
- Sentence case (capitalize first word only)

```markdown
# ✅ Good header style
This is how headers should be formatted.

## Another section
Content follows.
```

**Lists:**

```markdown
# ✅ Unordered lists
- First item
- Second item
  - Nested item (2 spaces)
  - Another nested item
- Third item

# ✅ Ordered lists
1. First step
2. Second step
3. Third step

# ✅ Task lists
- [ ] Todo item
- [x] Completed item
```

**Code blocks:**

````markdown
# ✅ Fenced code blocks with language
```python
def hello():
    print("Hello, world!")
```

```bash
# Shell commands
ls -la
```

# ✅ Inline code
Use `backticks` for inline code.
````

**Links:**

```markdown
# ✅ Relative links in same repo
[Setup Guide](../getting-started/QUICK_SETUP.md)

# ✅ External links
[Python Documentation](https://docs.python.org/)

# ✅ Reference-style links
See the [setup guide][1] for details.

[1]: ../getting-started/QUICK_SETUP.md
```

**Emphasis:**

```markdown
# ✅ Italic
*italic* or _italic_

# ✅ Bold
**bold** or __bold__

# ✅ Bold italic
***bold italic*** or ___bold italic___

# ✅ Code
`inline code`
```

**Tables:**

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
| Value 4  | Value 5  | Value 6  |

# With alignment
| Left | Center | Right |
|:-----|:------:|------:|
| L    | C      | R     |
```

**Blockquotes:**

```markdown
> Single line quote

> Multi-line quote
> continues here
> and here
```

---

## 📄 YAML Standards

### Formatting

```yaml
# Indentation: 2 spaces (not tabs)
# Quotes: Use for strings with special characters
# Booleans: true/false (lowercase)
# Comments: # at start of line or after value

# ✅ Good YAML
storage:
  backend: github
  github:
    token: "ghp_abc123"  # Quoted because special chars
    repo: username/repo-name
    branch: main
    enabled: true  # Boolean
    retries: 3  # Integer

# Key ordering (alphabetical within sections)
config:
  api_key: "key"
  base_url: "https://example.com"
  timeout: 30
```

### Conventions

**Key naming:**
- Use `snake_case` for keys
- Be descriptive but concise
- Group related settings

**String quoting:**
```yaml
# Quote when needed
needs_quotes: "value with: colons"
also_quoted: "value with {special} chars"
path: "/absolute/path/with/slashes"

# Don't quote when not needed
no_quotes: simple_value
number: 42
boolean: true
```

**Comments:**
```yaml
# Section comment explaining group of settings
storage:
  backend: local  # Inline comment for specific value

  # Multi-line comment explaining
  # complex configuration option
  local:
    base_path: /path/to/data
```

---

## 🐚 Shell Script Standards

### Shebang and Options

```bash
#!/usr/bin/env bash
#
# Script description
#

set -euo pipefail  # Exit on error, undefined vars, pipe failures
```

### Style Guidelines

```bash
# Variables: UPPER_CASE for constants, lower_case for locals
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
script_name="$(basename "$0")"

# Functions: lowercase_with_underscores
function check_requirements() {
    local required_cmd="$1"

    if ! command -v "$required_cmd" &> /dev/null; then
        echo "Error: $required_cmd not found"
        return 1
    fi

    return 0
}

# Quotes: Always quote variables
echo "$variable"  # ✅ Good
echo $variable    # ❌ Bad

# Conditionals: Use [[ ]] not [ ]
if [[ "$var" == "value" ]]; then
    echo "Match"
fi

# Loops
for file in *.txt; do
    process_file "$file"
done

while read -r line; do
    echo "$line"
done < input.txt
```

### Error Handling

```bash
# Check exit codes
if ! command_that_might_fail; then
    echo "Error: Command failed" >&2
    exit 1
fi

# Or use || for short circuits
command_that_might_fail || {
    echo "Error: Command failed" >&2
    exit 1
}

# Trap for cleanup
trap cleanup EXIT

cleanup() {
    rm -f "$temp_file"
}
```

---

## 🗂️ File Organization

### Directory Structure

```
project/
├── sdk/                    # Layer 1: SDK infrastructure
│   ├── .github/           # CI/CD (workflows in subdirs)
│   ├── config/            # Configuration files
│   └── scripts/           # Automation scripts
│
├── developer-tools/       # Layer 2: Developer tools
│   ├── *.py              # Python tools
│   └── *.sh              # Shell tools
│
├── skill-package/         # Layer 3: Skill code
│   ├── SKILL.md          # Main skill
│   ├── config/           # Static config
│   ├── scripts/          # Python utilities
│   └── modules/          # Optional modules
│
└── docs/                  # Documentation
    ├── skill-developers/  # Skill dev docs
    ├── sdk-developers/    # SDK dev docs
    └── shared/           # Shared resources
```

### File Naming

**Python:**
```
storage.py              # Module (lowercase_with_underscores)
config_loader.py        # Module
validate.py             # Script
```

**Markdown:**
```
README.md               # Important (UPPERCASE)
CONTRIBUTING.md         # Important (UPPERCASE)
architecture.md         # Guide (lowercase-with-dashes)
troubleshooting.md      # Guide (lowercase-with-dashes)
```

**Shell:**
```
setup.sh                # Script (lowercase)
release.sh              # Script (lowercase)
```

**YAML:**
```
version.yaml            # Config (lowercase)
storage-config.yaml     # Config (lowercase-with-dashes)
```

---

## 💬 Comments

### When to Comment

**Do comment:**
- Why (rationale for approach)
- Gotchas and edge cases
- TODO items with context
- Complex algorithms
- Non-obvious code

**Don't comment:**
- What (code should be self-explanatory)
- Obvious operations
- Commented-out code (delete it)
- Redundant information

### Comment Style

**Python:**
```python
# ✅ Good - explains why
# Use SHA-256 for security (SHA-1 is deprecated)
hash_value = hashlib.sha256(data).hexdigest()

# ❌ Bad - states the obvious
# Calculate hash
hash_value = hashlib.sha256(data).hexdigest()

# ✅ Good - warns about gotcha
# WARNING: This modifies the list in-place
items.sort()

# ✅ Good - TODO with context
# TODO(username): Refactor to use async/await once Python 3.11+ required
```

**Markdown:**
```markdown
<!-- Comments in markdown (rarely needed) -->

<!-- TODO: Add diagram here -->
```

**YAML:**
```yaml
# Comments for configuration explanation
storage:
  backend: github  # Can be: local, github, checkpoint, email, notion
```

---

## 🧪 Testing Conventions

### Test File Naming

```
tests/
├── test_storage.py          # Tests for storage.py
├── test_config_loader.py    # Tests for config_loader.py
└── test_validation.py       # Tests for validate.py
```

### Test Structure

```python
import unittest
from storage import LocalBackend

class TestLocalBackend(unittest.TestCase):
    """Test cases for LocalBackend storage."""

    def setUp(self):
        """Set up test fixtures."""
        self.config = {
            'base_path': '/tmp/test-storage'
        }
        self.backend = LocalBackend(self.config)

    def tearDown(self):
        """Clean up after tests."""
        # Cleanup code
        pass

    def test_save_creates_file(self):
        """Test that save() creates a file."""
        result = self.backend.save('test-key', {'data': 'value'})

        self.assertTrue(result)
        self.assertTrue(os.path.exists('/tmp/test-storage/test-key.yaml'))

    def test_save_with_invalid_key_fails(self):
        """Test that save() fails with invalid key."""
        with self.assertRaises(ValueError):
            self.backend.save('', {'data': 'value'})

if __name__ == '__main__':
    unittest.main()
```

### Test Naming

```python
# Test method naming: test_<method>_<scenario>_<expected>

def test_save_valid_data_succeeds(self):
    pass

def test_load_missing_key_returns_none(self):
    pass

def test_delete_existing_key_returns_true(self):
    pass
```

---

## 🔒 Security Conventions

### Never Commit Secrets

```python
# ❌ Bad - hardcoded secret
API_KEY = "sk_live_abc123"

# ✅ Good - from environment
import os
API_KEY = os.environ.get('API_KEY')

# ✅ Good - from config file (gitignored)
from config_loader import get_config
API_KEY = get_config()['api_key']
```

### Input Validation

```python
def process_user_input(user_input: str) -> str:
    """Process user input safely."""
    # Validate type
    if not isinstance(user_input, str):
        raise TypeError("Input must be string")

    # Validate length
    if len(user_input) > 1000:
        raise ValueError("Input too long")

    # Sanitize
    sanitized = user_input.strip()

    # Validate content
    if not sanitized:
        raise ValueError("Input cannot be empty")

    return sanitized
```

### Path Handling

```python
from pathlib import Path

def safe_file_access(user_provided_path: str, base_dir: Path) -> Path:
    """Safely resolve user-provided path within base directory."""
    # Resolve to absolute path
    requested_path = (base_dir / user_provided_path).resolve()

    # Ensure it's within base directory (prevent path traversal)
    if not str(requested_path).startswith(str(base_dir.resolve())):
        raise ValueError(f"Path {user_provided_path} is outside base directory")

    return requested_path
```

---

## 📐 Git Conventions

### Branch Naming

```
# Format: type/short-description

feature/redis-storage
fix/validation-error
docs/update-readme
refactor/storage-abstraction
test/storage-tests
chore/update-deps
```

### Commit Messages

**Format: Conventional Commits**

```
type(scope): brief description

Longer explanation if needed. Wrap at 72 characters.
Explain the what and why, not the how.

Fixes #123
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `refactor` - Code refactoring
- `test` - Test additions/updates
- `chore` - Maintenance tasks
- `perf` - Performance improvements
- `ci` - CI/CD changes

**Examples:**

```
feat(storage): add Redis backend

Implement RedisBackend class with save, load, delete, and list_keys
methods. Includes configuration template and documentation.

Fixes #45

---

fix(validation): handle missing config file

Add proper error handling when storage-config.yaml doesn't exist.
Show helpful message directing user to setup guide.

Fixes #67

---

docs(guides): add troubleshooting guide

Comprehensive guide covering common issues with setup, storage,
and Claude integration. Includes debugging techniques.
```

### Pull Request Guidelines

**PR Title:**
```
[Type] Brief description of changes

Examples:
[Feature] Add PostgreSQL storage backend
[Fix] Resolve path handling on Windows
[Docs] Update architecture documentation
```

**PR Description:**
```markdown
## Summary
Brief description of what this PR does.

## Changes
- Change 1
- Change 2
- Change 3

## Testing
How this was tested:
- [ ] Local validation passes
- [ ] CI tests pass
- [ ] Manually tested feature X
- [ ] Added unit tests

## Breaking Changes
None / List any breaking changes

## Related Issues
Fixes #123
Related to #456
```

---

## 🎨 Code Review Checklist

### For Reviewers

**Functionality:**
- [ ] Code does what it's supposed to
- [ ] Edge cases are handled
- [ ] Error handling is appropriate

**Code Quality:**
- [ ] Follows style guidelines
- [ ] Well-structured and readable
- [ ] No unnecessary complexity
- [ ] DRY (Don't Repeat Yourself)

**Documentation:**
- [ ] Functions have docstrings
- [ ] Complex logic is commented
- [ ] README/docs updated if needed
- [ ] CHANGELOG updated if user-facing

**Testing:**
- [ ] Tests added for new code
- [ ] Tests pass locally and in CI
- [ ] Edge cases are tested

**Security:**
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] No SQL injection vectors
- [ ] Path traversal prevented

---

## 🛠️ Tools & Automation

### Linting

```bash
# Python
pip install flake8 black mypy
flake8 skill-package/
black --check skill-package/
mypy skill-package/

# Markdown
npm install -g markdownlint-cli
markdownlint docs/

# Shell
shellcheck developer-tools/*.sh
```

### Auto-formatting

```bash
# Python
black skill-package/

# Markdown (limited)
prettier --write "**/*.md"
```

### Pre-commit Hooks

```bash
# Install pre-commit
pip install pre-commit

# Setup (if .pre-commit-config.yaml exists)
pre-commit install

# Run manually
pre-commit run --all-files
```

---

## 📚 Additional Resources

### Python
- [PEP 8](https://pep8.org/) - Style Guide
- [PEP 257](https://www.python.org/dev/peps/pep-0257/) - Docstring Conventions
- [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html)
- [Real Python](https://realpython.com/) - Tutorials and best practices

### Markdown
- [CommonMark Spec](https://commonmark.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)

### Shell
- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
- [ShellCheck](https://www.shellcheck.net/) - Linting tool

### Git
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Best Practices](https://git-scm.com/book/en/v2)

---

## 🔄 Updating These Conventions

**These conventions evolve.** To propose changes:

1. Open GitHub issue with `conventions` label
2. Describe proposed change and rationale
3. Discuss with maintainers
4. Submit PR updating this document
5. Update after approval

**Review schedule:** Quarterly or as needed

---

**Layer:** 1 (SDK Development)
**Audience:** All contributors
**Last Updated:** 2025-11-13

**Follow these conventions to maintain a high-quality, consistent codebase!**
