# Testing Quick Reference

This project includes comprehensive automated testing through GitHub Actions.

---

## 🚀 Quick Start

### Run Tests Locally
```bash
# Basic validation (required before commit)
python host_scripts/validate.py

# Python syntax check
python -m py_compile skill-package/scripts/*.py host_scripts/*.py

# Shell script validation (install shellcheck first)
shellcheck *.sh host_scripts/*.sh

# Code style
pip install flake8
flake8 skill-package/scripts/ host_scripts/
```

### Run Full Test Suite
Tests run automatically on push/PR via GitHub Actions.

---

## 📋 The 10 Test Types

| # | Test | Purpose | Runs On |
|---|------|---------|---------|
| 1 | **Python Syntax** | Validate Python code compiles | Every push |
| 2 | **Shell Scripts** | Validate bash scripts (ShellCheck) | Every push |
| 3 | **Markdown Links** | Check for broken documentation links | Every push |
| 4 | **Storage Config** | Validate configuration templates | Every push |
| 5 | **Unit Tests** | Test storage backend functionality | Every push |
| 6 | **Documentation** | Verify required sections exist | Every push |
| 7 | **Security Scan** | Find security vulnerabilities (Bandit) | Every push |
| 8 | **Dependencies** | Check for vulnerable packages (Safety) | Every push |
| 9 | **Code Style** | Enforce PEP 8 standards (Flake8) | Every push |
| 10 | **E2E Test** | Test complete template workflow | Every push |

---

## 🔍 GitHub Workflows

### 1. Basic Validation (`validate.yml`)
- Runs on: `main`, `develop`, all PRs
- Duration: ~2 minutes
- Tests:
  - ✅ Directory structure
  - ✅ SKILL.md validation
  - ✅ YAML syntax

### 2. Comprehensive Tests (`comprehensive-tests.yml`)
- Runs on: `main`, `develop`, `claude/**`, all PRs
- Duration: ~5-7 minutes
- Tests: All 10 test types listed above
- Artifacts: Security and vulnerability reports

### 3. Release (`release.yml`)
- Runs on: Tags matching `v*` (e.g., `v1.1.0`)
- Creates GitHub release with packaged skill

---

## 📊 Test Reports

After workflow runs, download reports from **Actions > Artifacts**:

- 🔒 **bandit-security-report.json** - Security issues
- 🛡️ **safety-vulnerability-report.json** - Dependency vulnerabilities

---

## 🎯 Before Committing

```bash
# 1. Run validation
python host_scripts/validate.py

# 2. Check Python syntax
python -m py_compile skill-package/scripts/*.py

# 3. Check style (optional but recommended)
pip install flake8
flake8 skill-package/scripts/ host_scripts/

# 4. Commit if all pass ✅
git add .
git commit -m "Your commit message"
git push
```

---

## 🔧 Installing Test Tools

### Python Tools
```bash
pip install pyyaml pytest bandit safety flake8
```

### ShellCheck
```bash
# macOS
brew install shellcheck

# Ubuntu/Debian
sudo apt-get install shellcheck

# Windows (via Chocolatey)
choco install shellcheck
```

### Markdown Link Checker
```bash
npm install -g markdown-link-check
```

---

## 📚 Full Documentation

See [docs/guides/developer-guide/testing-guide.md](docs/guides/developer-guide/testing-guide.md) for:
- Detailed test descriptions
- How to run each test
- How to add new tests
- Troubleshooting guide
- Best practices

---

## 🐛 Common Issues

### "ModuleNotFoundError" in tests
```bash
pip install -r requirements.txt
```

### ShellCheck not found
```bash
# Install per platform instructions above
```

### Flake8 errors
```bash
# Auto-fix some issues
pip install autopep8
autopep8 --in-place --aggressive skill-package/scripts/*.py
```

---

## ✅ Test Status Badge

Add to README.md:
```markdown
![Tests](https://github.com/yourusername/claude-skill-template/workflows/Comprehensive%20Tests/badge.svg)
```

---

**Quick Links:**
- [Testing Guide](docs/guides/developer-guide/testing-guide.md) - Full documentation
- [Contributing](CONTRIBUTING.md) - How to contribute
- [GitHub Actions](https://github.com/yourusername/claude-skill-template/actions) - View test runs

---

**Last Updated**: 2025-11-05 | **v1.1.0**
