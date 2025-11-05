# Output Templates

**Templates for formatting skill output consistently.**

---

## 🎯 Purpose

Templates define the structure and format of skill outputs:
- Consistent formatting across features
- Reusable output patterns
- Easy to customize for different users
- Support multiple output formats (YAML, Markdown, JSON)

---

## 📋 Template Types

### Report Templates
Structured reports with sections:
- Summary
- Detailed analysis
- Recommendations
- Next steps

### Data Templates
YAML/JSON structures for:
- Entities (companies, roles, etc.)
- Analysis results
- Cached data

### Export Templates
Formatted exports:
- Markdown documents
- CSV/Excel formats
- PDF-ready layouts

---

## 🆕 Creating Templates

### 1. Define Template Structure

```yaml
# template-name.yaml
template_metadata:
  name: "Report Template"
  version: "1.0"
  format: "markdown"

sections:
  - name: "Summary"
    fields:
      - title
      - date
      - key_points

  - name: "Details"
    fields:
      - analysis
      - recommendations
```

### 2. Use Template in Code

```python
from scripts.template_loader import load_template, render_template

template = load_template('template-name.yaml')
output = render_template(template, {
    'title': 'Analysis Report',
    'date': '2025-11-05',
    'key_points': ['Point 1', 'Point 2']
})
```

---

## 📐 Template Guidelines

### ✅ Good Templates

- **Flexible:** Work with various data
- **Clear:** Obvious structure
- **Documented:** Include examples
- **Versioned:** Track changes

### ❌ Avoid

- Hardcoded data
- User-specific formatting
- Complex logic (keep in modules)
- Undocumented fields

---

## 🎨 Formatting Options

### Markdown Templates
```markdown
# {{title}}
**Date:** {{date}}

## Summary
{{summary}}

## Details
{{#items}}
- **{{name}}**: {{description}}
{{/items}}
```

### YAML Templates
```yaml
output:
  title: "{{title}}"
  generated_at: "{{timestamp}}"
  data:
    {{#items}}
    - id: "{{id}}"
      value: "{{value}}"
    {{/items}}
```

---

## 🔗 Related

- **Modules:** `../modules/` - Logic that uses templates
- **User Config:** `../../user-data/config/` - Output preferences
- **Examples:** `../../docs/guides/` - Template usage examples

---

**Last Updated:** 2025-11-05
