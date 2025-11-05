# Database Directory

**Storage for structured data in YAML format.**

---

## 🎯 Purpose

This directory stores **structured, persistent data**:
- Entity data (companies, people, items, etc.)
- Analysis results
- Cached research data
- Processed information

---

## 📁 Recommended Structure

```
db/
├── entities/           # Core entities
│   ├── company-acme.yaml
│   ├── person-john-doe.yaml
│   └── ...
├── cache/             # Cached data
│   ├── research-2025-11-05.yaml
│   └── ...
├── results/           # Analysis results
│   ├── analysis-001.yaml
│   └── ...
└── archive/           # Old data
    └── ...
```

---

## 📄 YAML Format Guidelines

### Consistent Structure

All YAML files should follow this pattern:

```yaml
entity_type: "company"
entity_id: "acme-corp"
created_at: "2025-11-05T10:30:00Z"
updated_at: "2025-11-05T10:30:00Z"
version: "1.0"

metadata:
  source: "web_research"
  confidence: 0.95
  tags: ["tech", "startup"]

data:
  name: "Acme Corporation"
  industry: "Technology"
  size: "50-200"
  location: "San Francisco, CA"

  # Add your domain-specific fields here
```

### File Naming

Use kebab-case with type prefix:
- `company-acme.yaml` (not `Acme.yaml`)
- `person-john-doe.yaml` (not `JohnDoe.yaml`)
- `analysis-2025-11-05.yaml` (not `analysis.yaml`)

---

## 💾 Storage Operations

### Save Data

```python
from scripts.storage import save_data
import yaml

data = {
    'entity_type': 'company',
    'entity_id': 'acme',
    'data': {
        'name': 'Acme Corp',
        'industry': 'Tech'
    }
}

save_data('db/entities/company-acme.yaml', yaml.dump(data))
```

### Load Data

```python
from scripts.storage import load_data
import yaml

content = load_data('db/entities/company-acme.yaml')
data = yaml.safe_load(content)
print(data['data']['name'])  # Acme Corp
```

### List All Entities

```python
from scripts.storage import list_data

companies = list_data('db/entities/')
for company_file in companies:
    print(f"Found: {company_file}")
```

---

## 🔄 Best Practices

### DO:
- ✅ Use consistent YAML schema
- ✅ Include metadata (created_at, updated_at)
- ✅ Version your data structures
- ✅ Use descriptive file names
- ✅ Organize in subdirectories

### DON'T:
- ❌ Mix different entity types without structure
- ❌ Use spaces or special characters in filenames
- ❌ Store binary data (use separate storage)
- ❌ Hardcode file paths in code

---

## 🔍 Data Schema Example

Here's a complete example for a company entity:

```yaml
# db/entities/company-acme.yaml
entity_type: "company"
entity_id: "acme-corp"
created_at: "2025-11-05T10:00:00Z"
updated_at: "2025-11-05T15:30:00Z"
version: "1.1"

metadata:
  source: "linkedin_research"
  researcher: "claude"
  confidence: 0.9
  last_verified: "2025-11-05"
  tags: ["tech", "b2b", "saas"]

data:
  basic:
    name: "Acme Corporation"
    legal_name: "Acme Corp Inc."
    website: "https://acme.example.com"
    founded: "2020"

  details:
    industry: "Enterprise Software"
    size: "50-200"
    funding: "Series A"
    location:
      hq: "San Francisco, CA"
      offices: ["NYC", "Austin"]

  products:
    - name: "Acme Platform"
      category: "SaaS"
    - name: "Acme API"
      category: "Developer Tools"

  notes: |
    Additional observations and notes about the company.
    Multi-line notes are supported.
```

---

## 🔗 Related

- **Storage System:** `../../../skill-package/scripts/storage.py`
- **YAML Utilities:** `../../../skill-package/scripts/yaml_utils.py`
- **Configuration:** `../config/storage-config-template.yaml`

---

**Last Updated:** 2025-11-05
