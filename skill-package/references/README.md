# Reference Documentation

**Detailed documentation for skill features and modules.**

---

## 🎯 Purpose

References provide **detailed, comprehensive documentation** that:
- Explains complex features in depth
- Loaded only when needed (token optimization)
- Contains technical details and edge cases
- Serves as authoritative documentation

---

## 📚 Reference Pattern

### Core + Reference Split

**Core Module (loaded always):**
- Essential logic (2-5K tokens)
- Common use cases
- Quick reference

**Reference Doc (loaded on demand):**
- Full details (10-30K tokens)
- Advanced features
- Edge cases and troubleshooting

### Example Structure

```
modules/
  analysis-core.md          # 3K tokens - essential logic

references/
  analysis-detailed.md      # 20K tokens - full documentation
  analysis-algorithms.md    # 15K tokens - technical details
  analysis-examples.md      # 10K tokens - comprehensive examples
```

---

## 🔄 When to Load References

**Load Core Module First:**
```
Use the analysis feature to score companies
```

**Load Reference When Needed:**
```
I need more details about the scoring algorithm
→ Load references/analysis-algorithms.md

Show me more examples of analysis output
→ Load references/analysis-examples.md
```

---

## 📐 Reference Guidelines

### ✅ Good References

- **Comprehensive:** Cover all aspects
- **Structured:** Clear sections and hierarchy
- **Searchable:** Easy to find specific info
- **Examples:** Abundant, real-world examples

### ❌ Avoid

- Duplicating core module content
- Essential info (put in core instead)
- Outdated information
- Mixing multiple topics

---

## 📋 Reference Types

### 1. Technical Documentation
- Algorithms and implementations
- Data structures
- Performance considerations

### 2. API Documentation
- Function signatures
- Parameters and return values
- Error handling

### 3. Usage Examples
- Common scenarios
- Edge cases
- Troubleshooting

### 4. Design Documentation
- Architecture decisions
- Trade-offs
- Future improvements

---

## 🎯 Token Budget Strategy

| Load Phase | Content | Tokens |
|------------|---------|--------|
| Initial | Core modules only | 10-20K |
| Feature Use | Core + specific reference | 30-40K |
| Deep Dive | Core + multiple references | 50-80K |
| Research | Full documentation | 100K+ |

**Pro Tip:** Design references to be loaded independently

---

## 🔗 Related

- **Modules:** `../modules/` - Core logic that references point to
- **SKILL.md:** Main skill file - references available modules
- **Docs:** `../../docs/guides/` - User-facing documentation

---

**Last Updated:** 2025-11-05
