# Skill Modules

**Markdown-based modules containing skill logic and features.**

---

## 🎯 Purpose

Modules are the building blocks of your skill. Each module:
- Defines a specific feature or capability
- Written in markdown for Claude to read
- Can be loaded progressively (token budget management)
- Self-contained and reusable

---

## 📋 Current Modules

- **module-template.md** - Template for creating new modules

---

## 🆕 Creating a New Module

### 1. Copy the Template
```bash
cp module-template.md my-new-module.md
```

### 2. Edit Module Content

Structure your module with:
- **Purpose:** What does this module do?
- **Inputs:** What data does it need?
- **Process:** How does it work?
- **Outputs:** What does it produce?
- **Examples:** Usage examples

### 3. Register in SKILL.md

Add your module to the main SKILL.md:
```markdown
## Available Modules
- **my-new-module**: Brief description
```

### 4. Test the Module

Upload to Claude and test:
```
Load the my-new-module and test feature X
```

---

## 📐 Module Design Guidelines

### ✅ Good Module Design

- **Single Responsibility:** One feature per module
- **Self-Contained:** Minimal dependencies
- **Well-Documented:** Clear purpose and examples
- **Token-Aware:** Consider size (aim for < 5K tokens)

### ❌ Avoid

- Multiple unrelated features in one module
- Hardcoded paths or user-specific data
- Excessive length (split into core + reference)
- Dependencies on other modules without documentation

---

## 🏗️ Module Patterns

### Pattern 1: Core + Reference

For complex features:
- `modules/feature-core.md` - Essential logic (5K tokens)
- `references/feature-detailed.md` - Full docs (20K tokens)

Load core by default, reference only when needed.

### Pattern 2: Progressive Disclosure

```markdown
## Quick Usage
[Essential info - always show]

## Advanced Features
[Load only when user asks]

## Implementation Details
[Load only for debugging]
```

### Pattern 3: Modular Components

Break large features into composable modules:
- `analysis-scoring.md` - Scoring logic
- `analysis-report.md` - Report generation
- `analysis-export.md` - Export functionality

---

## 📏 Token Budget Guidelines

| Module Type | Target Size | Max Size |
|-------------|-------------|----------|
| Core Module | 2-5K tokens | 10K tokens |
| Reference | 10-20K tokens | 30K tokens |
| Template | < 1K tokens | 2K tokens |

**Pro Tip:** Use `wc -w filename.md` to estimate tokens (≈ 1.3 tokens per word)

---

## 🔗 Related

- **SKILL.md:** Main entry point that loads modules
- **references/:** Detailed documentation for modules
- **templates/:** Output templates for module results

---

**Last Updated:** 2025-11-05
