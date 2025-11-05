# Documentation

**Comprehensive documentation for users and developers.**

---

## 📚 Documentation Structure

```
docs/
├── README.md (this file)      # Documentation index
├── guides/                     # User & developer guides
│   ├── README.md
│   ├── QUICK_SETUP.md         # Quick start guide
│   ├── user-guide/            # For end users
│   │   ├── README.md
│   │   └── setup.md
│   └── developer-guide/       # For developers
│       ├── README.md
│       ├── architecture.md
│       └── storage-selection-guide.md
└── project/                    # Project management
    ├── README.md
    ├── roadmap.md
    ├── GITHUB_STORAGE.md
    ├── STORAGE_DESIGN.md
    └── features/
        ├── README.md
        └── TEMPLATE.md
```

---

## 🎯 Quick Links

### For Users
- **[Quick Setup](guides/QUICK_SETUP.md)** - Get started in 5 minutes
- **[Setup Guide](guides/user-guide/setup.md)** - Complete setup instructions
- **[Main README](../README.md)** - Project overview

### For Developers
- **[Architecture](guides/developer-guide/architecture.md)** - System design
- **[Storage Guide](guides/developer-guide/storage-selection-guide.md)** - Storage backends
- **[Contributing](../CONTRIBUTING.md)** - How to contribute

### For Project Management
- **[Roadmap](project/roadmap.md)** - Future plans
- **[Feature Template](project/features/TEMPLATE.md)** - Feature spec template

---

## 📖 Documentation Types

### Guides
**Purpose:** Step-by-step instructions

**For Users:**
- Installation and setup
- Configuration
- Usage examples
- Troubleshooting

**For Developers:**
- Architecture and design
- Development workflow
- Testing strategies
- Deployment procedures

### Reference
**Purpose:** Detailed technical information

**Located in:** `skill-package/references/`
- API documentation
- Module specifications
- Configuration reference
- Data schemas

### Project Docs
**Purpose:** Project management and planning

**Contains:**
- Roadmap and milestones
- Feature specifications
- Design decisions
- Architecture documents

---

## ✍️ Writing Documentation

### Documentation Standards

**Markdown Format:**
- Use GitHub-flavored Markdown
- Include table of contents for long docs
- Use code blocks with language specification
- Add visual hierarchy with headers

**Structure:**
```markdown
# Title

Brief description (1-2 sentences)

---

## Section 1

Content...

## Section 2

Content...

---

**Last Updated:** YYYY-MM-DD
```

### File Naming
- Use kebab-case: `quick-setup.md`
- Be descriptive: `storage-selection-guide.md` not `storage.md`
- Add README.md to every directory

### Content Guidelines
- **Clear:** Write for your target audience
- **Concise:** Remove unnecessary words
- **Complete:** Cover all important aspects
- **Current:** Keep up to date with code

---

## 🔄 Documentation Workflow

### Adding New Documentation

1. **Choose Location**
   - User-facing → `guides/user-guide/`
   - Developer-facing → `guides/developer-guide/`
   - Project management → `project/`

2. **Create File**
   ```bash
   touch docs/guides/user-guide/new-guide.md
   ```

3. **Write Content**
   - Follow documentation standards
   - Include examples
   - Add cross-references

4. **Update Index**
   - Add link to appropriate README.md
   - Update main README.md if needed

5. **Review & Commit**
   ```bash
   git add docs/
   git commit -m "docs: Add new user guide"
   ```

---

## 🔍 Finding Documentation

### By Topic
- **Installation:** `guides/QUICK_SETUP.md`
- **Configuration:** `guides/user-guide/setup.md`
- **Architecture:** `guides/developer-guide/architecture.md`
- **Storage:** `guides/developer-guide/storage-selection-guide.md`
- **Features:** `project/features/`

### By Audience
- **New Users:** Start with `guides/QUICK_SETUP.md`
- **Developers:** Start with `guides/developer-guide/README.md`
- **Contributors:** Start with `../CONTRIBUTING.md`

---

## 📊 Documentation Health

### Quality Checklist
- [ ] All guides have examples
- [ ] Code snippets are tested
- [ ] Links are not broken
- [ ] Screenshots are up to date
- [ ] Last updated dates are current

### Maintenance
- Review quarterly
- Update with each release
- Fix broken links
- Add new features

---

## 🔗 Related

- **README:** `../README.md` - Project overview
- **CONTRIBUTING:** `../CONTRIBUTING.md` - Contribution guide
- **CHANGELOG:** `../CHANGELOG.md` - Version history

---

**Last Updated:** 2025-11-05
