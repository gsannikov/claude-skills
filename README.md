# Claude Skills SDK Template

**Version:** 1.0.0  
**Author:** Gur Sannikov  
**License:** MIT  
**Status:** Production Ready  

Build production-grade Claude skills with best practices, token optimization, and battle-tested patterns from real-world implementations.

---

## 🎯 What is This?

This SDK template provides a comprehensive framework for building Claude skills that:

✅ **Work reliably** across multiple conversations  
✅ **Manage token budgets** efficiently (avoiding context exhaustion)  
✅ **Scale gracefully** from simple to complex features  
✅ **Separate concerns** cleanly (skill logic vs. user data)  
✅ **Integrate smoothly** with MCP servers  
✅ **Release professionally** with version control and CI/CD  

**Based on:** Israeli Tech Career Consultant skill (v9.3.0) - a production skill with 30+ features, comprehensive documentation, and proven reliability across hundreds of analyses.

---

## 🚀 Quick Start

### Prerequisites

1. **macOS** (tested on macOS 14+)
2. **Claude Desktop** with MCP support
3. **Python 3.8+** (for automation scripts)
4. **Git** (for version control)

### Installation

```bash
# Clone or download this template
git clone https://github.com/yourusername/claude-skill-template.git my-skill

# Navigate to your skill directory
cd my-skill

# Run initial setup
./host_scripts/setup.sh

# Configure your user data path
# Edit skill-package/config/paths.py with your local path
```

### Configuration

1. **Update paths.py**:
   ```python
   # skill-package/config/paths.py
   USER_DATA_BASE = "/Users/YOUR_USERNAME/path/to/my-skill/user-data"
   ```

2. **Configure MCP Servers** (see [MCP Setup Guide](docs/guides/user-guide/mcp-servers.md)):
   - Filesystem MCP (required)
   - Firecrawl MCP (optional, for web scraping)
   - Bright Data MCP (optional, for advanced scraping)

3. **Upload to Claude**:
   - Upload the entire `skill-package/` directory
   - Or use the release package from GitHub releases

4. **Initialize user data**:
   ```bash
   cp user-data/config/user-config-template.yaml user-data/config/user-config.yaml
   # Edit user-config.yaml with your settings
   ```

---

## 📚 Documentation

### For Users
- **[Setup Guide](docs/guides/user-guide/setup.md)** - Complete setup instructions
- **[MCP Configuration](docs/guides/user-guide/mcp-servers.md)** - How to configure MCP servers
- **[Usage Guide](docs/guides/user-guide/usage.md)** - How to use the skill
- **[Troubleshooting](docs/guides/user-guide/troubleshooting.md)** - Common issues and solutions

### For Developers
- **[Architecture Guide](docs/guides/developer-guide/architecture.md)** - System design and patterns
- **[Module Creation Guide](docs/guides/developer-guide/module-guide.md)** - How to create new modules
- **[Testing Guide](docs/guides/developer-guide/testing.md)** - Testing strategies
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute

---

## 🏗️ Architecture

```
claude-skill-template/
├── skill-package/          # Logic uploaded to Claude (read-only)
│   ├── SKILL.md           # Main skill definition
│   ├── config/            # Static configuration
│   ├── modules/           # Core skill logic (markdown)
│   ├── references/        # Reference documentation
│   ├── scripts/           # Python utilities
│   └── templates/         # Output templates
│
├── user-data/             # Local user storage (read-write)
│   ├── config/           # User configuration
│   ├── db/               # Dynamic data (YAML)
│   └── logs/             # Operation logs
│
├── docs/                 # Project documentation
│   ├── guides/           # User & developer guides
│   └── project/          # Project management
│
├── host_scripts/         # Automation scripts
│   ├── validate.py       # Validation script
│   ├── release.sh        # Release automation
│   └── setup.sh          # Initial setup
│
└── .github/              # GitHub configuration
    ├── workflows/        # CI/CD pipelines
    └── ISSUE_TEMPLATE/   # Issue templates
```

### Key Design Principles

1. **Three-Tier Storage**: Clean separation between skill logic, user data, and documentation
2. **Token Budget Management**: Progressive disclosure, modular loading, smart caching
3. **Context Management**: DEV_SESSION_STATE.md for continuity across conversations
4. **MCP Integration**: Filesystem-first, with optional web scraping
5. **Documentation-Driven**: Write specs before code, maintain comprehensive docs
6. **Version Control**: Semantic versioning, automated releases, clean git history

---

## 🎨 Features

### Core Features
- ✅ **Modular Architecture** - Add/remove features easily
- ✅ **Token Budget Protection** - Never exceed context limits
- ✅ **Session State Management** - Maintain context across conversations
- ✅ **YAML Configuration** - Clean, readable configuration files
- ✅ **Python Utilities** - Automation scripts for common tasks
- ✅ **Template System** - Consistent output formatting

### Developer Experience
- ✅ **Comprehensive Documentation** - Every aspect documented
- ✅ **Validation Scripts** - Catch errors before deployment
- ✅ **Release Automation** - One-command releases
- ✅ **GitHub Integration** - CI/CD, issue templates, PR templates
- ✅ **Testing Framework** - Unit and integration test patterns

### Production Ready
- ✅ **Error Handling** - Graceful degradation
- ✅ **Logging System** - Track operations and debug issues
- ✅ **Version Management** - Semantic versioning
- ✅ **Backup Strategy** - Data preservation patterns
- ✅ **Security** - .gitignore prevents leaking sensitive data

---

## 💡 Use Cases

This template is perfect for building:

- **Domain-specific assistants** (career coaching, financial planning, etc.)
- **Research tools** (literature reviews, market analysis, etc.)
- **Analysis engines** (data processing, scoring systems, etc.)
- **Knowledge management** (personal wikis, note systems, etc.)
- **Workflow automation** (task management, reporting, etc.)

---

## 📖 Learning Path

### Beginner (0-2 hours)
1. Complete Quick Start above
2. Read Architecture Guide
3. Explore example modules
4. Make simple customizations

### Intermediate (2-8 hours)
1. Create your first module
2. Implement custom configuration
3. Add validation scripts
4. Write feature specification

### Advanced (8+ hours)
1. Design multi-module features
2. Optimize token usage
3. Create release automation
4. Contribute back improvements

---

## 🛠️ Customization Guide

### Creating Your First Module

1. **Write feature specification**:
   ```bash
   cp docs/project/features/TEMPLATE.md docs/project/features/my-feature.md
   # Edit my-feature.md with your requirements
   ```

2. **Create module file**:
   ```bash
   cp skill-package/modules/module-template.md skill-package/modules/my-feature.md
   # Edit my-feature.md with your logic
   ```

3. **Add to SKILL.md**:
   ```markdown
   ## Available Modules
   - **my-feature**: Description of what it does
   ```

4. **Test your module**:
   ```bash
   python host_scripts/validate.py
   ```

5. **Document usage**:
   Update user guide with examples

### Configuring for Your Domain

1. **Update configuration schema**:
   - Edit `user-data/config/user-config-template.yaml`
   - Add domain-specific settings

2. **Customize templates**:
   - Edit files in `skill-package/templates/`
   - Create new template types as needed

3. **Add domain data**:
   - Create YAML files in `user-data/db/`
   - Use consistent schema

4. **Update paths**:
   - Edit `skill-package/config/paths.py`
   - Add any new directory paths

---

## 🔧 Automation Scripts

### Validation
```bash
python host_scripts/validate.py
# Checks: structure, config, SKILL.md format
```

### Release
```bash
./host_scripts/release.sh 1.0.0
# Creates: git tag, release package, GitHub release
```

### Setup
```bash
./host_scripts/setup.sh
# Initializes: directories, config templates, git hooks
```

---

## 📦 Distribution

### As a Skill Package

1. Create release:
   ```bash
   ./host_scripts/release.sh 1.0.0
   ```

2. Share the generated `.skill` file from `releases/`

3. Users upload to Claude Desktop

### As a GitHub Repository

1. Fork this template
2. Customize for your domain
3. Push to GitHub
4. Users clone and follow Quick Start

### As a Tutorial

1. Write blog post explaining your skill
2. Link to your repository
3. Provide video walkthrough
4. Offer support in issues

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Ways to Contribute
- 🐛 Report bugs via issues
- 💡 Suggest features via issues
- 📖 Improve documentation
- 🔧 Submit pull requests
- ⭐ Star the repository

---

## 📊 Real-World Example

This template is based on the **Israeli Tech Career Consultant** skill:
- **30+ features** implemented and battle-tested
- **9.3.0 releases** with semantic versioning
- **Comprehensive documentation** (guides, specs, references)
- **Token-optimized** (handles 5-35K tokens per analysis)
- **Production-ready** (used for real career decisions)

See the [parent repository](https://github.com/gursannikov/israeli-tech-career-consultant) for the full implementation.

---

## 🎯 Design Philosophy

### Why This Approach?

**Problem**: Claude skills often fail because they:
- Exhaust token budgets mid-conversation
- Lose context between conversations
- Mix user data with skill logic
- Lack proper documentation
- Have no version control

**Solution**: This SDK enforces:
- Token budget protection through modular loading
- Context management via DEV_SESSION_STATE.md
- Clean separation of skill logic and user data
- Documentation-driven development
- Professional release management

### Key Insights

1. **Token efficiency is critical** - Most Claude failures are token exhaustion
2. **Separation of concerns matters** - Skill logic must be portable
3. **Documentation enables scale** - Specs prevent feature creep
4. **Automation prevents errors** - Scripts catch mistakes early
5. **Version control builds trust** - Users need reliable releases

---

## 🌟 Success Stories

*Add your success story! Submit a PR with your skill built using this template.*

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Anthropic** for Claude and MCP
- **Israeli Tech Career Consultant** for proving these patterns work
- **Open source community** for inspiration and feedback

---

## 📞 Support

- 📖 **Documentation**: See `docs/` directory
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/claude-skill-template/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/claude-skill-template/discussions)
- 📧 **Email**: your.email@example.com

---

## 🗺️ Roadmap

### v1.1 (Next Release)
- [ ] Example skill implementations
- [ ] Video tutorials
- [ ] VS Code extension for skill development
- [ ] Advanced testing framework

### v2.0 (Future)
- [ ] Multi-language support
- [ ] Cloud deployment options
- [ ] Real-time collaboration features
- [ ] Marketplace integration

---

**Built with ❤️ for the Claude developer community**

---

## Quick Links

- [Installation](#installation)
- [Documentation](#documentation)
- [Architecture](#architecture)
- [Customization](#customization-guide)
- [Contributing](#contributing)
- [License](#license)

---

*Last updated: 2025-11-03*
