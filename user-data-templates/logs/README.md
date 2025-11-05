# Logs Directory

**Operation logs, error logs, and audit trails.**

---

## 🎯 Purpose

This directory stores **logs and operational data**:
- Operation logs (what happened)
- Error logs (what went wrong)
- Audit trails (who did what)
- Session histories
- Debug information

---

## 📁 Recommended Structure

```
logs/
├── operations/           # Daily operation logs
│   ├── 2025-11-05.log
│   ├── 2025-11-06.log
│   └── ...
├── errors/              # Error logs
│   ├── 2025-11-05-errors.log
│   └── ...
├── sessions/            # Session transcripts
│   ├── session-2025-11-05-001.md
│   └── ...
└── debug/               # Debug logs
    └── ...
```

---

## 📝 Log Formats

### Operation Log Format

```
[2025-11-05 10:30:15] [INFO] Operation started: company_analysis
[2025-11-05 10:30:16] [INFO] Loading configuration from user-config.yaml
[2025-11-05 10:30:17] [INFO] Researching company: Acme Corp
[2025-11-05 10:30:45] [INFO] Analysis complete. Score: 85/100
[2025-11-05 10:30:46] [INFO] Saved results to db/analysis-001.yaml
[2025-11-05 10:30:46] [INFO] Operation completed successfully
```

### Error Log Format

```
[2025-11-05 14:22:33] [ERROR] Failed to load company data
  File: company-xyz.yaml
  Error: FileNotFoundError
  Stack trace:
    File "storage.py", line 105, in load
      return file_path.read_text()
  Context: User requested analysis of company-xyz
  Resolution: Created company-xyz.yaml with template data
```

---

## 💾 Logging Operations

### Python Logging

```python
import logging
from datetime import datetime

# Setup logging
log_file = f"logs/operations/{datetime.now().strftime('%Y-%m-%d')}.log"
logging.basicConfig(
    filename=log_file,
    level=logging.INFO,
    format='[%(asctime)s] [%(levelname)s] %(message)s'
)

# Log operations
logging.info("Starting analysis")
logging.warning("Config file not found, using defaults")
logging.error("Failed to connect to API", exc_info=True)
```

### Using Storage System

```python
from scripts.storage import save_data
from datetime import datetime

log_entry = f"[{datetime.now().isoformat()}] [INFO] Operation completed\n"
log_file = f"logs/operations/{datetime.now().strftime('%Y-%m-%d')}.log"

# Append to log
existing_log = load_data(log_file) or ""
save_data(log_file, existing_log + log_entry)
```

---

## 🔄 Log Rotation

### Automatic Rotation

Implement log rotation to prevent files from growing too large:

```python
import os
from datetime import datetime, timedelta

def rotate_logs(log_dir, retention_days=30):
    """Delete logs older than retention_days"""
    cutoff = datetime.now() - timedelta(days=retention_days)

    for log_file in list_data(log_dir):
        # Parse date from filename (e.g., 2025-11-05.log)
        try:
            date_str = log_file.split('/')[-1].replace('.log', '')
            log_date = datetime.strptime(date_str, '%Y-%m-%d')

            if log_date < cutoff:
                delete_data(log_file)
                print(f"Rotated old log: {log_file}")
        except:
            pass  # Skip files that don't match pattern
```

---

## 📊 Log Analysis

### Useful Log Queries

**Count errors:**
```bash
grep -c "\[ERROR\]" logs/operations/2025-11-05.log
```

**Find specific operation:**
```bash
grep "company_analysis" logs/operations/2025-11-05.log
```

**Extract all errors:**
```bash
grep "\[ERROR\]" logs/operations/*.log > errors-summary.txt
```

---

## 🔐 Security & Privacy

### DO:
- ✅ Log operations and errors
- ✅ Include timestamps and context
- ✅ Rotate logs regularly
- ✅ Monitor for errors

### DON'T:
- ❌ Log sensitive data (passwords, tokens)
- ❌ Log personal information (PII)
- ❌ Keep logs forever (rotate)
- ❌ Commit logs to git (in .gitignore)

---

## 🎯 Log Levels

| Level | When to Use | Example |
|-------|-------------|---------|
| DEBUG | Development details | "Loaded config: {'key': 'value'}" |
| INFO | Normal operations | "Analysis started for company X" |
| WARNING | Recoverable issues | "API rate limit reached, retrying" |
| ERROR | Operation failures | "Failed to save data: IO error" |
| CRITICAL | System failures | "Database connection lost" |

---

## 🔗 Related

- **Storage System:** `../../../skill-package/scripts/storage.py`
- **Configuration:** `../config/storage-config-template.yaml`
- **User Config:** `../../user-data/config/user-config-template.yaml`

---

**Last Updated:** 2025-11-05
