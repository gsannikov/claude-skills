---
name: shared-preview
type: shared
description: Shared preview system for rendering beautiful cards, reports, and summaries across all skills. Supports React artifacts, HTML export, and themed output.
---

# Shared Preview System

Universal preview rendering for all Claude skills. Generates beautiful, RTL-compatible output in multiple formats.

## 🌟 Key Capabilities

1. **Card Preview**: Single-item display (recipe, job, idea)
2. **Report Preview**: Multi-section detailed view (job analysis, research)
3. **Summary Preview**: Compact overview (list items, quick stats)
4. **Timeline Preview**: Step-by-step or chronological view
5. **Multi-format Export**: React artifact, HTML file, PDF-ready

## 📦 Output Formats

| Command | Format | Use Case |
|---------|--------|----------|
| `"Preview X"` | React artifact | In-chat beautiful display |
| `"Export X as HTML"` | HTML file | Save, share, print |
| `"Export X as PDF"` | PDF via HTML | Print-ready document |
| `"Show X"` | Markdown | Simple text view |

## 🎨 Available Themes

| Theme | Colors | Best For |
|-------|--------|----------|
| `cooking` | Orange/Red/Warm | Recipes, food |
| `professional` | Blue/Gray | Career, jobs, business |
| `finance` | Green/Teal | Money, investments |
| `creative` | Purple/Pink | Ideas, projects |
| `neutral` | Gray/White | Generic, minimal |

## 🔗 Integration Pattern

### Step 1: Define Preview Mapping

Each skill creates a `preview-mapping.yaml` in its templates folder:

```yaml
# templates/preview-mapping.yaml
default_preview: card
theme: cooking

mappings:
  recipe:
    preview_type: card
    theme: cooking
    data_path: "recipes/{status}/{id}.yaml"
    
    header:
      icon: "{{icon}}"
      title: "{{name}}"
      badges:
        - field: status
          color_map:
            "To try": "amber"
            "Perfected": "purple"
        - field: type
      rating:
        field: rating
        max: 5
        symbol: "⭐"
    
    quick_stats:
      - icon: "⏱️"
        label: "הכנה"
        field: prep_time
      - icon: "🔥"
        label: "בישול"
        field: cook_time
      - icon: "👥"
        label: "מנות"
        field: servings
    
    sections:
      - type: tag_list
        title: "אוהבים"
        icon: "👨‍👩‍👧‍👦"
        field: relevant
        style: pills
        color: blue
        
      - type: bullet_list
        title: "מצרכים"
        icon: "🥗"
        field: ingredients
        bullet: "●"
        bullet_color: green
        
      - type: numbered_steps
        title: "אופן הכנה"
        icon: "👨‍🍳"
        field: instructions
        number_style: gradient
        
      - type: callout
        title: "טיפים"
        icon: "💡"
        field: notes
        style: warning
        condition: "notes.length > 0"
    
    footer:
      tags:
        field: tags
        prefix: "#"
```

### Step 2: Invoke Preview

```python
# In your skill's workflow
from shared.preview import render_preview

# Load your data
recipe = load_yaml(f"{USER_DATA_BASE}/recipes/to-try/arais-tortilla.yaml")

# Render preview
render_preview(
    data=recipe,
    mapping="recipe",           # From preview-mapping.yaml
    skill="recipe-manager",     # Source skill
    format="artifact"           # artifact | html | markdown
)
```

## 📋 Preview Types

### 1. Card Preview

Best for: Single items, recipes, job postings

```
┌─────────────────────────────────────┐
│  🌮  Recipe Name        ⭐⭐⭐⭐⭐  │  ← Header
│      [Status] [Type]               │
├─────────────────────────────────────┤
│  ⏱️ 15m  │  🔥 10m  │  👥 4  │ 📊  │  ← Quick Stats
├─────────────────────────────────────┤
│  👨‍👩‍👧‍👦 Tag1  Tag2  Tag3            │  ← Tag Section
├─────────────────────────────────────┤
│  🥗 Section Title                   │  ← List Section
│  ● Item 1                          │
│  ● Item 2                          │
├─────────────────────────────────────┤
│  👨‍🍳 Section Title                   │  ← Steps Section
│  ① Step one description            │
│  ② Step two description            │
├─────────────────────────────────────┤
│  💡 Callout text here               │  ← Callout
├─────────────────────────────────────┤
│  #tag1  #tag2  #tag3               │  ← Footer Tags
└─────────────────────────────────────┘
```

### 2. Report Preview

Best for: Job analysis, research summaries, comparisons

```
┌─────────────────────────────────────┐
│  🎯  Report Title                   │
│      Subtitle / Company             │
│      [Badge1] [Badge2] [Badge3]     │
├─────────────────────────────────────┤
│  Score: 78/100  ████████░░         │  ← Score Bar
│  Match: 85  ████████░░              │
│  Income: 70 ███████░░░              │
├─────────────────────────────────────┤
│  ✅ Pros          │  ⚠️ Cons        │  ← Pros/Cons
│  • Pro item 1     │  • Con item 1   │
│  • Pro item 2     │  • Con item 2   │
├─────────────────────────────────────┤
│  📋 Next Steps                      │  ← Action Items
│  □ Action item 1                    │
│  □ Action item 2                    │
└─────────────────────────────────────┘
```

### 3. Summary Preview

Best for: Lists, quick overviews, dashboards

```
┌─────────────────────────────────────┐
│  📊 Summary Title          [Badge]  │
├─────────────────────────────────────┤
│  Item 1          ⭐⭐⭐⭐⭐    →     │
│  Item 2          ⭐⭐⭐⭐      →     │
│  Item 3          ⭐⭐⭐        →     │
├─────────────────────────────────────┤
│  Total: 3 items    [Action Button]  │
└─────────────────────────────────────┘
```

### 4. Timeline Preview

Best for: Preparation plans, workflows, history

```
┌─────────────────────────────────────┐
│  📅 Timeline Title                  │
├─────────────────────────────────────┤
│  ●──── Step 1: Title               │
│  │     Description text             │
│  │     Duration: 2 hours            │
│  │                                  │
│  ●──── Step 2: Title               │
│  │     Description text             │
│  │                                  │
│  ◉──── Current: Step 3             │
│        In progress...               │
└─────────────────────────────────────┘
```

## 🛠️ Section Types Reference

| Type | Description | Required Fields |
|------|-------------|-----------------|
| `tag_list` | Horizontal pills/badges | field, style |
| `bullet_list` | Vertical bullet list | field, bullet |
| `numbered_steps` | Numbered instructions | field |
| `pros_cons` | Two-column comparison | pros_field, cons_field |
| `score_bar` | Progress bar with score | field, max |
| `score_breakdown` | Multiple score bars | scores_field |
| `callout` | Highlighted box | field, style |
| `key_value` | Label: Value pairs | fields[] |
| `timeline` | Vertical timeline | field |
| `action_items` | Checkbox list | field |
| `table` | Data table | columns[], rows_field |

## 🎯 Usage Examples

### Recipe Card (recipe-manager)

```
User: "Preview arais-tortilla"
Claude: [Renders beautiful recipe card artifact]
```

### Job Analysis Report (career-consultant)

```
User: "Preview job nvidia-tpm"
Claude: [Renders job analysis with scores, pros/cons]
```

### Ideas Summary (ideas-capture)

```
User: "Show my startup ideas"
Claude: [Renders summary list with ratings]
```

### Export to HTML

```
User: "Export arais-tortilla as HTML"
Claude: [Creates HTML file, provides download link]
```

## 📁 File Structure

```
shared/preview/
├── SKILL.md                    # This file
├── templates/
│   ├── card-base.jsx           # Card component
│   ├── report-base.jsx         # Report component
│   ├── summary-base.jsx        # Summary component
│   └── timeline-base.jsx       # Timeline component
├── themes/
│   ├── cooking.yaml            # Recipe colors
│   ├── professional.yaml       # Career colors
│   ├── finance.yaml            # Money colors
│   ├── creative.yaml           # Ideas colors
│   └── neutral.yaml            # Minimal colors
└── examples/
    ├── recipe-preview.yaml     # Recipe mapping example
    └── job-preview.yaml        # Job mapping example
```

## ⚙️ Theme Configuration

```yaml
# themes/cooking.yaml
name: cooking
colors:
  primary: "#f97316"      # Orange 500
  secondary: "#ef4444"    # Red 500
  accent: "#ec4899"       # Pink 500
  background: "#fff7ed"   # Orange 50
  surface: "#ffffff"
  text: "#1f2937"         # Gray 800
  text_muted: "#6b7280"   # Gray 500

gradients:
  header: "from-orange-500 via-red-500 to-pink-500"
  button: "from-orange-500 to-red-500"

badges:
  default: "bg-gray-100 text-gray-800"
  success: "bg-green-100 text-green-800"
  warning: "bg-amber-100 text-amber-800"
  info: "bg-blue-100 text-blue-800"
  
rtl: true
font_family: "system-ui, -apple-system, sans-serif"
```

## 🔧 Integration Checklist

For skill developers:

- [ ] Create `templates/preview-mapping.yaml` in your skill
- [ ] Define mappings for each previewable item type
- [ ] Choose appropriate theme
- [ ] Test with sample data
- [ ] Document preview commands in SKILL.md

---

**Version**: 1.0.0  
**Last Updated**: 2025-12-01  
**Status**: Initial Release
