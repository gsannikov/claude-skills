# Contributing to Claude Skills

Thank you for your interest in contributing to the Claude Skills Ecosystem! This document provides guidelines and instructions for contributing.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Creating a New Skill](#creating-a-new-skill)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)
- [Testing](#testing)
- [Release Process](#release-process)

---

## Code of Conduct

Please be respectful and constructive in all interactions. We're building tools to help people be more productive - let's embody that spirit in our collaboration.

---

## Getting Started

### Prerequisites

- **Git** for version control
- **Python 3.8+** for scripts and utilities
- **Claude.ai account** for testing skills
- **GitHub account** for contributions

### Fork & Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/claude-skills.git
cd claude-skills
```

---

## Development Setup

### 1. Install Dependencies

```bash
# Core dependencies
pip install pyyaml

# For local-rag skill
pip install chromadb sentence-transformers

# For career-consultant Excel features
pip install pandas openpyxl
```

### 2. Verify Structure

```bash
# Run validation
python -c "
import yaml
import glob
for f in glob.glob('packages/**/version.yaml', recursive=True):
    with open(f) as file:
        data = yaml.safe_load(file.read())
        print(f'✅ {data[\"skill\"]} v{data[\"version\"]}')
"
```

### 3. Test a Skill

1. Upload a skill folder to Claude.ai
2. Run basic commands
3. Verify expected behavior

---

## Project Structure

```
claude-skills/
├── packages/                      # Individual skills (one folder each)
│   └── {skill-name}/
│       ├── SKILL.md               # Main skill specification (REQUIRED)
│       ├── README.md              # Human documentation (REQUIRED)
│       ├── AI_GUIDE.md            # AI assistant guide (recommended)
│       ├── CHANGELOG.md           # Version history (REQUIRED)
│       ├── version.yaml           # Version info (REQUIRED)
│       ├── modules/               # On-demand modules
│       ├── scripts/               # Helper scripts
│       ├── config/                # Configuration files
│       └── templates/             # User templates
├── shared/
│   ├── scripts/                   # Cross-skill utilities
│   ├── templates/                 # Shared patterns
│   └── workflows/                 # Troubleshooting guides
├── .github/workflows/             # CI/CD
└── docs/                          # Additional documentation
```

### Required Files for Each Skill

| File | Purpose |
|------|---------|
| `SKILL.md` | Main specification loaded by Claude |
| `README.md` | Human-readable documentation |
| `CHANGELOG.md` | Version history |
| `version.yaml` | Version metadata |

### version.yaml Format

```yaml
version: 1.0.0
updated: 2025-11-25
skill: skill-name
codename: Descriptive Name
status: stable  # or: beta, alpha, deprecated
```

---

## Making Changes

### Branch Naming

```
feature/{skill-name}-{description}
fix/{skill-name}-{description}
docs/{description}
```

Examples:
- `feature/career-consultant-linkedin-parsing`
- `fix/reading-list-duplicate-detection`
- `docs/contributing-guide`

### Commit Messages

Follow conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance tasks

Examples:
```
feat(career-consultant): add STAR story builder module
fix(reading-list): handle URLs with special characters
docs: update contributing guidelines
```

---

## Creating a New Skill

### 1. Use the Generator (Recommended)

```bash
python shared/scripts/skill_generator.py --name "expense-tracker" --patterns inbox,database
```

### 2. Manual Creation

Create the minimum required structure:

```
packages/expense-tracker/
├── SKILL.md           # Main specification
├── README.md          # Documentation
├── AI_GUIDE.md        # AI assistant guide
├── CHANGELOG.md       # Version history
└── version.yaml       # Version info
```

### 3. SKILL.md Template

```markdown
---
name: expense-tracker
description: Brief description of what the skill does
---

# Expense Tracker

[Full skill specification following existing patterns]

## Key Capabilities
1. Feature 1
2. Feature 2

## Commands
- `process expenses` - Main command

## Workflow
[Detailed workflow steps]

---

**Version**: 1.0.0
**Status**: Stable
```

### 4. Add to Validation

Update `.github/workflows/validate.yml`:

```yaml
strategy:
  matrix:
    skill: [career-consultant, reading-list, ..., expense-tracker]
```

---

## Submitting Changes

### Pull Request Process

1. **Create a branch** from `main`
2. **Make changes** following style guidelines
3. **Test locally** with Claude
4. **Update documentation** if needed
5. **Submit PR** with clear description

### PR Description Template

```markdown
## Summary
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactoring

## Testing Done
- [ ] Tested with Claude.ai
- [ ] Ran validation scripts
- [ ] Updated relevant docs

## Related Issues
Fixes #123
```

### Review Process

1. Automated checks run (YAML validation, Python syntax)
2. Maintainer reviews code
3. Address feedback
4. Merge when approved

---

## Style Guidelines

### Markdown

- Use ATX headers (`#`, `##`, `###`)
- One sentence per line for easier diffs
- Use fenced code blocks with language hints
- Tables for structured data

### YAML

- 2-space indentation
- Quote strings with special characters
- Use comments for complex configurations

### Python

- Follow PEP 8
- Type hints encouraged
- Docstrings for public functions
- Keep scripts focused and simple

### Skill Documentation

- Clear, actionable commands
- Real examples
- Token usage estimates where relevant
- Troubleshooting sections

---

## Testing

### Manual Testing

1. Upload skill to Claude.ai
2. Test all documented commands
3. Verify file outputs
4. Check error handling

### Validation Scripts

```bash
# Validate all skills
python -c "
import yaml, glob, sys
errors = []
for f in glob.glob('packages/**/version.yaml', recursive=True):
    try:
        with open(f) as file:
            yaml.safe_load(file.read())
        print(f'✅ {f}')
    except Exception as e:
        errors.append(f'❌ {f}: {e}')
if errors:
    print('\\n'.join(errors))
    sys.exit(1)
"
```

### CI Checks

GitHub Actions automatically validates:
- Required files exist
- YAML syntax is valid
- Python scripts compile

---

## Release Process

### For Maintainers

1. **Update version.yaml**:
   ```yaml
   version: 1.1.0
   updated: 2025-11-25
   ```

2. **Update CHANGELOG.md**:
   ```markdown
   ## [1.1.0] - 2025-11-25
   ### Added
   - New feature X
   ### Fixed
   - Bug Y
   ```

3. **Create release**:
   ```bash
   python shared/scripts/release.py {skill-name} --minor
   ```

4. **Or use GitHub Actions**:
   - Go to Actions → Release Skill
   - Select skill and bump type
   - Run workflow

### Version Bumping

- **patch** (1.0.0 → 1.0.1): Bug fixes, minor docs
- **minor** (1.0.0 → 1.1.0): New features, non-breaking
- **major** (1.0.0 → 2.0.0): Breaking changes

---

## Questions?

- **Issues**: https://github.com/gsannikov/claude-skills/issues
- **Discussions**: https://github.com/gsannikov/claude-skills/discussions

---

Thank you for contributing!
