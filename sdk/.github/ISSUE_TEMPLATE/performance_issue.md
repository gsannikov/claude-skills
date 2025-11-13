---
name: Performance Issue
about: Report slow performance or resource usage problems
title: '[PERFORMANCE] '
labels: performance
assignees: ''
---

## Performance Problem
A clear description of the performance issue:

## Affected Operation
What operation is slow?
- [ ] Validation (`validate.py`)
- [ ] Storage operations (save/load)
- [ ] Module loading
- [ ] Skill execution
- [ ] CI/CD workflows
- [ ] Other: [describe]

## To Reproduce
Steps to reproduce the performance issue:
1. Run command '...'
2. With configuration '...'
3. Observe slow performance

## Performance Metrics
Provide measurements if available:
- **Current Performance**: [e.g., 30 seconds to complete]
- **Expected Performance**: [e.g., should be < 5 seconds]
- **Dataset Size**: [e.g., 1000 records, 50KB file]

## Environment
- **OS**: [e.g., macOS 14.0, Windows 11, Ubuntu 22.04]
- **Python Version**: [e.g., 3.10]
- **Storage Backend**: [e.g., Local, GitHub, etc.]
- **Hardware**: [e.g., CPU, RAM, SSD vs HDD]

## Profiling Data (optional)
If you've profiled the operation, share the results:
```
Paste profiling output here
```

## Impact
- [ ] Blocking - Makes the tool unusable
- [ ] Severe - Significantly impacts workflow
- [ ] Moderate - Noticeable delay but manageable
- [ ] Minor - Slight inconvenience

## Workarounds
Have you found any workarounds?

## Additional Context
Add any other context, logs, or screenshots about the performance issue here.

## Possible Optimization (optional)
If you have ideas on how to improve performance, describe them here:
