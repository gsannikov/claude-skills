# Frequently Asked Questions (FAQ)

**Purpose:** Quick answers to common questions about Claude Skills SDK
**Audience:** Skill developers, new users, and curious explorers
**Last Updated:** 2025-11-13

---

## 🎯 Getting Started

### What is the Claude Skills SDK Template?

A production-ready framework for building Claude Skills with multi-backend storage, automation tools, and best practices. It provides:
- Complete architecture for skill development
- 5 storage backend options
- Validation and testing automation
- Comprehensive documentation
- Battle-tested patterns from real production skills

Think of it as "create-react-app" for Claude skills—a solid foundation to start from.

---

### Do I need programming experience?

**Yes, basic Python knowledge is required.**

You should be comfortable with:
- Python syntax and basic programming concepts
- Command line / terminal usage
- Git basics (clone, commit, push)
- YAML configuration files
- Markdown documentation

**Learning resources:**
- Python: [python.org/about/gettingstarted](https://www.python.org/about/gettingstarted/)
- Git: [git-scm.com/book](https://git-scm.com/book)
- Command line: [linuxcommand.org](http://linuxcommand.org/)

---

### How long does setup take?

**Quick setup: 5-10 minutes** (with local storage)
**Complete setup: 15-30 minutes** (with GitHub storage and customization)

**Timeline:**
- Clone repository: 1 min
- Install dependencies: 2 min
- Run setup script: 1 min
- Configure storage: 2-5 min
- Validate setup: 1 min
- Create first skill: 5-15 min

---

### Which storage backend should I choose?

**Quick recommendation:**

| Use Case | Backend | Why |
|----------|---------|-----|
| **Just testing** | Local or Checkpoint | Simplest setup |
| **Personal use, single device** | Local | No dependencies |
| **Multi-device sync** | GitHub | Version control + sync |
| **Team collaboration** | GitHub or Notion | Shared access |
| **Mobile access** | Email | Works anywhere |

**Detailed comparison:** See [storage-selection.md](../guides/storage-selection.md)

---

### Is this officially from Anthropic?

**No, this is a community project.**

- Built **with** Anthropic best practices
- Not **by** or **officially supported by** Anthropic
- Open source (MIT license)
- Community-maintained

**However:** It follows official Anthropic guidelines and patterns from Claude documentation.

---

## 🏗️ Architecture & Design

### Why three layers (SDK, Tools, Skill)?

**Clear separation of concerns:**

1. **Layer 1 (SDK)** - Template infrastructure
   - Who: SDK maintainers
   - What: CI/CD, releases, template architecture
   - Changes: Affect all template users

2. **Layer 2 (Tools)** - Developer tools
   - Who: Skill developers
   - What: Validation, setup, testing
   - Changes: Affect your workflow

3. **Layer 3 (Skill)** - Your skill code
   - Who: You and end users
   - What: Skill logic, features
   - Changes: Affect only your skill

**Benefits:**
- Clean boundaries
- Easy to maintain
- Upgrade SDK without breaking your skill
- Clear documentation per audience

---

### What's the difference between skill-package and user-data?

**skill-package/** → "Read-only" skill code (committed to Git)
- Uploaded to Claude
- Version controlled
- Shared across users
- Contains skill logic
- No secrets or personal data

**user-data/** → Your personal data (gitignored)
- Not uploaded to Claude
- Not version controlled
- Unique to you
- Contains your data
- Can include secrets/API keys

**Analogy:** skill-package is like an app you install, user-data is like your app settings and documents.

---

### Why so many documentation files?

**Different audiences need different docs:**

- **New users** → Getting started guides
- **Active developers** → Development guides
- **SDK maintainers** → Architecture docs
- **Contributors** → Contributing guidelines
- **Troubleshooting** → FAQ + troubleshooting guide

**Progressive disclosure:** You only read what you need, when you need it.

---

### What's "token budget management"?

**The problem:**
Claude has a 190K token context window. Loading your entire skill + data at once can exhaust tokens mid-conversation.

**The solution:**
1. **Core** (~3K tokens): SKILL.md and essentials—always loaded
2. **Modules** (~5-15K each): Optional features—loaded on-demand
3. **Archive** (at 50% threshold): Save state and start fresh

**Benefit:** Your skill can grow large without hitting token limits.

**Learn more:** [architecture.md](../guides/architecture.md#token-budget-system)

---

## 💾 Storage & Data

### Can I use multiple storage backends?

**Not simultaneously, but you can switch.**

One storage backend active at a time, configured in `user-data/config/storage-config.yaml`.

**To switch backends:**
1. Export data from current backend
2. Update storage-config.yaml
3. Import data to new backend
4. Validate

**See:** [troubleshooting.md](troubleshooting.md#switching-storage-backends) for step-by-step guide

---

### Where is my data actually stored?

**Depends on your backend choice:**

| Backend | Location |
|---------|----------|
| **Local** | `user-data/db/*.yaml` on your computer |
| **GitHub** | GitHub repository files |
| **Checkpoint** | In-memory (lost when Claude session ends) |
| **Email** | Email inbox (sent to yourself) |
| **Notion** | Notion database pages |

**All backends:** Data is structured as YAML for readability and Git compatibility.

---

### Is my data secure?

**Security depends on your storage choice:**

✅ **Local:** Most secure—never leaves your machine
✅ **GitHub (private repo):** Very secure—encrypted in transit and at rest
⚠️ **GitHub (public repo):** Anyone can read—don't use for sensitive data
⚠️ **Email:** Depends on email provider security
⚠️ **Notion:** Depends on Notion workspace permissions

**Best practices:**
- Use environment variables for API keys
- Never commit secrets to Git
- Use private repos for sensitive skills
- Encrypt sensitive data before storing

**Built-in protection:**
- `.gitignore` prevents committing user-data
- Validation warns about common security issues
- gitleaks scans for accidentally committed secrets

---

### What happens if I lose my data?

**Prevention is key:**

1. **For Local storage:** Backup `user-data/db/` regularly
2. **For GitHub storage:** Data is version-controlled (built-in backup)
3. **For Email storage:** Don't delete emails (or use archive)
4. **For Notion:** Use Notion's export feature

**Recovery options:**
- Git history (if using GitHub storage)
- Email history (if using Email storage)
- File backups (if you made them)
- Notion page history

**No automatic backups for Local/Checkpoint backends** - you must implement yourself.

---

### Can Claude access my user-data/?

**No, by design.**

- `user-data/` is **not** uploaded to Claude
- Claude only sees `skill-package/` content
- Claude interacts with data **via** MCP Filesystem tools
- MCP tools provide controlled access to specific files

**This separation ensures:**
- Security: Secrets stay local
- Portability: skill-package works for all users
- Privacy: Your data is yours

---

## 🔧 Development

### How do I add a new feature to my skill?

**For small features (<15K tokens):**

1. Add logic to `skill-package/SKILL.md`
2. Test in Claude
3. Validate with `python developer-tools/validate.py`
4. Done!

**For large features (>15K tokens):**

1. Create module: `skill-package/modules/feature-name.md`
2. Document in module header:
   ```markdown
   # Module: Feature Name
   **Token Estimate:** ~8K tokens
   **Load Strategy:** On-demand
   ```
3. Reference in SKILL.md: "For Feature X, load modules/feature-name.md"
4. Test in Claude
5. Validate
6. Done!

**See:** [architecture.md](../guides/architecture.md#module-pattern) for module guidelines

---

### Can I modify the template itself?

**Yes, but understand what you're modifying:**

| Layer | Modify? | Impact |
|-------|---------|--------|
| `skill-package/` | ✅ Encouraged | Your skill only |
| `user-data/` | ✅ Expected | Your data only |
| `developer-tools/` | ⚠️ Carefully | Your workflow |
| `sdk/` | ⚠️ Rarely | Your template updates |
| `docs/` | ✅ Improve it | Documentation quality |

**For SDK changes:** Consider contributing back to the community!

**See:** [CONTRIBUTING.md](../../../CONTRIBUTING.md)

---

### How do I test my skill?

**Testing strategies:**

1. **Manual testing** (recommended for getting started)
   - Upload skill-package to Claude
   - Interact with Claude as end user would
   - Test all features
   - Check error handling

2. **Validation testing** (always do this)
   ```bash
   python developer-tools/validate.py
   ```

3. **CI/CD testing** (for production skills)
   - GitHub Actions run 12 comprehensive tests
   - Automatic on pull requests
   - Catches issues early

**See:** [testing-guide.md](../guides/testing-guide.md) for comprehensive testing strategies

---

### How do I debug issues in Claude?

**Debugging techniques:**

1. **Ask Claude to show state:**
   - "Show me the current configuration"
   - "What files can you see?"
   - "Display the last error message"

2. **Add logging:**
   ```python
   # In skill-package/scripts/
   import logging
   logging.basicConfig(level=logging.DEBUG)
   logging.debug(f"Variable value: {variable}")
   ```

3. **Test storage directly:**
   ```bash
   python3 -c "
   from skill-package.scripts.storage import get_storage_backend
   backend = get_storage_backend()
   print(backend.list_keys())
   "
   ```

4. **Check logs:**
   ```bash
   cat user-data/logs/operations.log
   ```

**See:** [troubleshooting.md](troubleshooting.md#debugging-techniques)

---

### Can I use this for commercial projects?

**Yes! MIT License allows commercial use.**

**You can:**
- ✅ Use for commercial skills
- ✅ Modify and distribute
- ✅ Charge for skills built with it
- ✅ Use in proprietary projects

**You must:**
- ✅ Include the original MIT license
- ✅ Preserve copyright notice

**You cannot:**
- ❌ Hold authors liable
- ❌ Use Anthropic's trademarks without permission

**Full license:** [LICENSE](../../../LICENSE)

---

## 🚀 Deployment & Usage

### How do I share my skill with others?

**Option 1: Share skill-package/**
```bash
# Package for distribution
zip -r my-skill.zip skill-package/

# Recipients:
1. Unzip package
2. Run setup.sh
3. Configure their storage
4. Upload to Claude
```

**Option 2: GitHub repository**
```bash
# Create public repo
git init
git add .
git commit -m "Initial skill"
git push

# Share repo URL
# Recipients can clone and follow setup
```

**Option 3: GitHub Release (recommended for versioned skills)**
```bash
bash sdk/scripts/release.sh
# Creates versioned release with ZIP
```

**Important:** Never include `user-data/` in distributions (contains personal data)

---

### Can users customize my skill?

**Yes, skills are designed for customization:**

**Users can:**
- Modify SKILL.md for their needs
- Add custom modules
- Change configuration
- Extend functionality

**To support this:**
- Document customization points
- Provide clear examples
- Use configuration files for settings
- Keep documentation updated

**To restrict this:**
- Use copyright/license notices
- Obfuscate code (but defeats open-source spirit)
- Provide as service instead of distributing

---

### How do I update my skill for new template versions?

**Minor updates (1.x.x → 1.y.y):**

```bash
# 1. Check CHANGELOG for changes
cat docs/shared/CHANGELOG.md

# 2. Backup your skill
cp -r skill-package skill-package.backup

# 3. Pull template updates
git remote add template https://github.com/gsannikov/claude-skill-template.git
git fetch template
git merge template/main

# 4. Resolve conflicts if any
# 5. Test thoroughly
# 6. Validate
python developer-tools/validate.py
```

**Major updates (1.x.x → 2.x.x):**

Follow migration guide in CHANGELOG (breaking changes require careful migration).

---

### What's the performance impact?

**Template overhead:**
- Validation: <1 second
- Storage operations: <500ms (local), 1-3s (network backends)
- Token usage: ~3K for core, 5-15K per module
- Memory: Negligible

**Optimization tips:**
- Use local storage for fastest operations
- Cache frequently accessed data
- Lazy-load modules
- Profile your specific bottlenecks

---

## 🤝 Community & Contribution

### How can I contribute?

**Many ways to help:**

1. **Use and provide feedback**
   - Report bugs
   - Request features
   - Share experiences

2. **Improve documentation**
   - Fix typos
   - Add examples
   - Clarify confusing sections
   - Translate to other languages

3. **Add features**
   - New storage backends
   - Better validation
   - Automation tools
   - Example skills

4. **Help others**
   - Answer questions in issues/discussions
   - Write tutorials
   - Share your skills

**See:** [CONTRIBUTING.md](../../../CONTRIBUTING.md) for detailed guide

---

### Where can I get help?

**Resources in order:**

1. **Documentation:** Check docs/ first
   - [QUICK_SETUP.md](../getting-started/QUICK_SETUP.md)
   - [troubleshooting.md](troubleshooting.md)
   - This FAQ

2. **GitHub Issues:** For bugs and problems
   - Search existing issues first
   - Provide full details (see troubleshooting.md)

3. **GitHub Discussions:** For questions and ideas
   - General questions
   - Feature ideas
   - Show & tell

4. **Examples:** Look at example skills
   - `skill-package/examples/`
   - Community-shared skills

---

### Can I create a skill based on this template and sell it?

**Yes! MIT License permits commercial use.**

**Recommended:**
- Clearly state it's based on Claude Skills SDK Template
- Include attribution in your documentation
- Link back to original template
- Consider contributing improvements back

**Not required, but appreciated:**
- Mention in skill documentation
- Share success story with community
- Contribute features back upstream

---

### How is this project maintained?

**Current model:**
- Community-driven open source
- Multiple maintainers review contributions
- Regular updates and improvements
- Responsive to issues and feedback

**Governance:**
- Open contribution model
- PRs reviewed by maintainers
- Issues triaged by priority
- Community input valued

**Sustainability:**
- MIT license ensures longevity
- Multiple maintainers prevent single points of failure
- Active community helps with maintenance
- Documentation reduces maintenance burden

---

## 🔮 Future & Roadmap

### What's planned for future versions?

**See:** [roadmap.md](../../shared/features/roadmap.md) for detailed roadmap

**Highlights:**
- Visual skill builder
- More storage backends (Redis, PostgreSQL, S3)
- IDE integration (VS Code extension)
- Automated testing framework
- Skill marketplace/registry
- Performance profiling tools

**Timelines:** See PROBLEM_AND_VISION.md for short/mid/long-term goals

---

### Will this work with future Claude versions?

**We aim for compatibility:**

**Commitment:**
- Follow Anthropic's official guidelines
- Adapt to new Claude features
- Provide migration guides for breaking changes
- Semantic versioning for transparency

**Best effort:**
- Monitor Claude updates
- Test with new versions
- Update template as needed
- Community reports issues

**No guarantee:** Claude is developed by Anthropic, independent of this template

---

### Can this be used with other AI models?

**Currently:** Designed specifically for Claude

**Possible:** With modifications, could work with other models that support:
- Long context windows
- File system access
- Markdown-based instructions

**Challenges:**
- Different token limits
- Different tool/API interfaces
- Different prompt patterns
- Model-specific optimizations

**Not currently planned, but contributions welcome!**

---

## 🎓 Learning & Best Practices

### What are the most common beginner mistakes?

1. **❌ Using relative paths**
   - ✅ Always use absolute paths in configuration

2. **❌ Committing user-data/ to Git**
   - ✅ Check .gitignore, never force-add user-data

3. **❌ Hardcoding secrets in skill-package/**
   - ✅ Use configuration in user-data/config/

4. **❌ Loading everything in SKILL.md**
   - ✅ Use progressive loading with modules

5. **❌ Not running validation before committing**
   - ✅ Always run `python developer-tools/validate.py`

6. **❌ Mixing layers (SDK, Tools, Skill)**
   - ✅ Understand and respect layer boundaries

7. **❌ Skipping documentation**
   - ✅ Document as you code, update README

---

### What should I read first?

**Recommended learning path:**

**Day 1: Getting Started (30 min)**
1. [README.md](../../../README.md) - Overview
2. [WELCOME.md](../getting-started/WELCOME.md) - Introduction
3. [QUICK_SETUP.md](../getting-started/QUICK_SETUP.md) - Setup guide

**Day 2: Understanding (1 hour)**
4. [architecture.md](../guides/architecture.md) - System design
5. [storage-selection.md](../guides/storage-selection.md) - Choose storage
6. [DEPENDENCIES.md](../getting-started/DEPENDENCIES.md) - Storage setup

**Day 3: Development (2 hours)**
7. Create your first skill
8. [testing-guide.md](../guides/testing-guide.md) - Test your skill
9. This FAQ + [troubleshooting.md](troubleshooting.md) - As needed

**Ongoing:**
- [CHANGELOG.md](../../shared/CHANGELOG.md) - Stay updated
- [CONTRIBUTING.md](../../../CONTRIBUTING.md) - If contributing

---

### Where can I find example skills?

**Built-in examples:**
```bash
ls skill-package/examples/
```

**Community skills:**
- Check GitHub topics: `claude-skill`
- Community showcase in discussions
- Blog posts and tutorials

**Example projects using this template:**
- Israeli Tech Career Consultant (original, private)
- [Add yours here by contributing!]

---

### How do I stay updated?

**Ways to follow along:**

1. **GitHub Watch** - Get notifications of releases
2. **Star the repo** - Support and bookmark
3. **Read CHANGELOG** - Review before updating
4. **Follow discussions** - See what community is building
5. **Subscribe to releases** - Email notifications

---

## 💡 Advanced Topics

### Can I contribute a new storage backend?

**Yes! We'd love new backends.**

**Requirements:**
1. Implement `StorageBackend` abstract class
2. All 4 methods: save, load, delete, list_keys
3. Configuration template
4. Documentation in DEPENDENCIES.md
5. Tests pass
6. Example usage

**See:** [AGENT_GUIDE.md](../../sdk-developers/AGENT_GUIDE.md#task-1-adding-a-new-storage-backend) for step-by-step guide

---

### How do I create a custom validator?

**Add to `developer-tools/validate.py`:**

```python
def validate_custom_check(self) -> bool:
    """Your custom validation logic"""
    print("Running custom check...")

    # Your logic here
    if something_wrong:
        self.errors.append("Error message")
        return False

    return True

# Add to checks list in validate_all()
checks = [
    # ... existing checks ...
    ("Custom Check", self.validate_custom_check),
]
```

**Run:** `python developer-tools/validate.py`

---

### Can I integrate with CI/CD?

**Yes! GitHub Actions ready out of the box.**

**Included workflows:**
- `sdk/.github/workflows/validate.yml` - Quick validation
- `sdk/.github/workflows/comprehensive-tests.yml` - 12 comprehensive tests
- `sdk/.github/workflows/release.yml` - Automated releases

**Custom CI/CD:**
```yaml
# .github/workflows/my-skill-ci.yml
name: My Skill CI
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
      - run: pip install -r requirements.txt
      - run: python developer-tools/validate.py
```

---

### How do I create a multi-user skill?

**Approach 1: Separate user-data per user**
- Each user has own user-data/ directory
- Skill-package shared
- Each user configures own storage

**Approach 2: Shared storage with user namespacing**
```python
# In storage operations, prefix keys with user ID
def save_user_data(user_id, key, data):
    storage_key = f"{user_id}/{key}"
    backend.save(storage_key, data)
```

**Approach 3: Database-backed storage**
- Use Notion or custom database backend
- Implement user authentication
- Store user ID in session

**Security:** Always implement proper authentication and authorization

---

## ❓ Still Have Questions?

### Question not answered here?

**Next steps:**

1. **Search GitHub Issues:**
   - [github.com/gsannikov/claude-skill-template/issues](https://github.com/gsannikov/claude-skill-template/issues)

2. **Check documentation:**
   - Browse docs/ directory
   - Use search in GitHub

3. **Ask in Discussions:**
   - [github.com/gsannikov/claude-skill-template/discussions](https://github.com/gsannikov/claude-skill-template/discussions)

4. **Open an issue:**
   - Use "question" label
   - Provide context
   - Be specific

---

### How can I improve this FAQ?

**Contributions welcome!**

```bash
# 1. Fork repository
# 2. Edit docs/skill-developers/user-guide/faq.md
# 3. Add your Q&A in appropriate section
# 4. Submit pull request
```

**Good additions:**
- Questions you had while learning
- Questions from community discussions
- Clarifications on confusing topics
- Links to helpful resources

---

**Layer:** 2 (Skill Development)
**Audience:** Skill developers, all levels
**Last Updated:** 2025-11-13

**Happy skill building! 🚀**
