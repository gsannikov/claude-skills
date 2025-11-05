# Releases

**Official release packages for distribution.**

---

## 🎯 Purpose

This directory contains **release packages** ready for distribution:
- Versioned skill packages
- Release notes
- Checksums for verification

---

## 📦 Release Contents

Each release includes:
- `skill-package-vX.Y.Z.zip` - Main skill package
- `CHECKSUMS-X.Y.Z.txt` - SHA256 checksums
- Release directory with unzipped contents

---

## 🚀 Using a Release

### Download Release

```bash
# Option 1: From GitHub Releases
# Visit: https://github.com/yourusername/claude-skill-template/releases

# Option 2: From releases directory
cd releases/
unzip skill-package-v1.0.0.zip
```

### Verify Integrity

```bash
# Check SHA256 checksum
shasum -a 256 -c CHECKSUMS-1.0.0.txt
```

### Install

```bash
# Extract
unzip skill-package-v1.0.0.zip

# Setup
cd skill-package-v1.0.0/
# Follow instructions in SETUP.md
```

---

## 🔧 Creating a Release

### Automated (Recommended)

```bash
# From project root
./host_scripts/release.sh 1.0.0
```

**This will:**
1. Update version.yaml
2. Create release directory
3. Package skill-package/ and user-data-templates/
4. Generate checksums
5. Create git tag
6. Prepare for GitHub release

### Manual Process

1. **Update Version**
   ```bash
   # Edit version.yaml
   version: "1.0.0"
   release_date: "2025-11-05"
   ```

2. **Create Package**
   ```bash
   mkdir -p releases/skill-package-v1.0.0
   cp -r skill-package/* releases/skill-package-v1.0.0/
   cp -r user-data-templates releases/skill-package-v1.0.0/
   ```

3. **Generate Checksum**
   ```bash
   cd releases/
   zip -r skill-package-v1.0.0.zip skill-package-v1.0.0/
   shasum -a 256 skill-package-v1.0.0.zip > CHECKSUMS-1.0.0.txt
   ```

4. **Tag Release**
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

---

## 📋 Release Checklist

Before creating a release:

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version numbers consistent
- [ ] No uncommitted changes
- [ ] Validation script passes: `python host_scripts/validate.py`

---

## 🔗 Related

- **Release Script:** `../host_scripts/release.sh`
- **Validation:** `../host_scripts/validate.py`
- **Changelog:** `../CHANGELOG.md`
- **Version:** `../version.yaml`

---

**Last Updated:** 2025-11-05
