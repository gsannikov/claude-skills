# [Module Name] v1.0

**Type:** Core Module  
**Last Updated:** 2025-11-03  
**Token Cost:** ~5-10K tokens  
**Dependencies:** [List any required modules]  

---

## Quick Reference

**Full Documentation:** [Link to references/module-name-detailed.md]

**When to Use:**
- Use case 1
- Use case 2
- Use case 3

**Don't Use When:**
- Scenario 1
- Scenario 2

---

## Overview

[2-3 paragraph description of what this module does, its purpose, and how it fits into the overall skill]

### Key Capabilities

1. **Capability 1**: Brief description
2. **Capability 2**: Brief description
3. **Capability 3**: Brief description

### Input Requirements

```yaml
# Example input structure
input:
  required_field_1: "value"
  required_field_2: 42
  optional_field: "optional value"
```

### Output Format

```yaml
# Example output structure
output:
  result_field_1: "value"
  result_field_2: 42
  metadata:
    processed_at: "2025-11-03T10:30:00Z"
    confidence: 0.95
```

---

## Core Functions

### Function 1: [Primary Operation]

**Purpose:** [What this function does]

**Usage:**
```python
from scripts.module_helpers import function_1

result = function_1(
    param1="value",
    param2=42
)
```

**Parameters:**
- `param1` (str): Description of parameter
- `param2` (int): Description of parameter

**Returns:**
- `result` (dict): Description of return value

**Example:**
```python
result = function_1(
    param1="example",
    param2=10
)
# Output: {'status': 'success', 'data': [...]}
```

**See:** [references/module-name-detailed.md#function-1]

---

### Function 2: [Secondary Operation]

**Purpose:** [What this function does]

**Usage:**
```python
from scripts.module_helpers import function_2

result = function_2(
    input_data=data,
    options={'setting': 'value'}
)
```

**Parameters:**
- `input_data` (dict): Description
- `options` (dict, optional): Configuration options

**Returns:**
- `result` (dict): Processed data

**Example:**
```python
result = function_2(
    input_data={'field': 'value'},
    options={'format': 'yaml'}
)
# Output: {'processed': True, 'output': '...'}
```

**See:** [references/module-name-detailed.md#function-2]

---

### Function 3: [Utility Operation]

**Purpose:** [What this function does]

**Usage:**
```python
from scripts.module_helpers import function_3

is_valid = function_3(data)
```

**Parameters:**
- `data` (any): Data to validate

**Returns:**
- `is_valid` (bool): Whether data is valid

**Example:**
```python
is_valid = function_3({'field': 'value'})
# Output: True
```

---

## Integration Patterns

### With Other Modules

**Module A Integration:**
```python
from scripts.module_a import process_a
from scripts.module_name import function_1

# Process with module A first
intermediate = process_a(input_data)

# Then apply this module
result = function_1(
    param1=intermediate['output'],
    param2=42
)
```

**Module B Integration:**
```python
from scripts.module_b import validate_b
from scripts.module_name import function_2

# Validate first
if validate_b(input_data):
    result = function_2(input_data)
```

---

## Configuration

### Module-Specific Settings

In `user-data/config/user-config.yaml`:

```yaml
module_name:
  enabled: true
  settings:
    option_1: "value"
    option_2: 42
    advanced:
      nested_option: true
```

### Loading Configuration

```python
from scripts.config_loader import load_user_config

config = load_user_config()
module_config = config.get('module_name', {})
enabled = module_config.get('enabled', False)
```

---

## Data Storage

### Storage Structure

```
user-data/db/module-name/
├── entities/
│   ├── entity-1.yaml
│   ├── entity-2.yaml
│   └── ...
├── cache/
│   ├── cache-key-1.yaml
│   └── ...
└── index.yaml
```

### Entity Schema

```yaml
# entity-name.yaml
entity_type: "type_name"
entity_id: "unique-id"
created_at: "2025-11-03T10:30:00Z"
updated_at: "2025-11-03T10:30:00Z"
version: "1.0"

data:
  field_1: "value"
  field_2: 42
  nested:
    field_a: "value"

metadata:
  source: "where_from"
  confidence: 0.95
```

### CRUD Operations

```python
from scripts.storage_utils import read_entity, write_entity, update_entity

# Create
entity = {'entity_id': 'id-123', 'data': {...}}
write_entity('module-name/entities', entity)

# Read
entity = read_entity('module-name/entities', 'id-123')

# Update
update_entity('module-name/entities', 'id-123', {'data': {...}})

# Delete
delete_entity('module-name/entities', 'id-123')
```

---

## Error Handling

### Common Errors

**1. Invalid Input**
```python
try:
    result = function_1(param1="", param2=-1)
except ValueError as e:
    print(f"❌ Invalid input: {e}")
    # Handle error gracefully
```

**2. Missing Configuration**
```python
try:
    config = load_module_config()
except FileNotFoundError:
    print("⚠️ Using default configuration")
    config = get_default_config()
```

**3. Processing Failure**
```python
try:
    result = function_2(data)
except ProcessingError as e:
    print(f"❌ Processing failed: {e}")
    # Log error and return partial result
    log_error(e)
    result = get_partial_result(data)
```

---

## Performance Considerations

### Token Usage

**Estimated Token Costs:**
- Module load: ~5K tokens
- Function 1 execution: ~2K tokens
- Function 2 execution: ~3K tokens
- Total operation: ~10K tokens

**Optimization:**
- Load module only when needed
- Cache results when possible
- Unload after use in long sessions

### Execution Time

**Typical Performance:**
- Small dataset (< 100 items): < 1 second
- Medium dataset (100-1000 items): 1-5 seconds
- Large dataset (> 1000 items): 5-30 seconds

**Optimization:**
- Batch operations when possible
- Use parallel processing for independent tasks
- Cache expensive computations

---

## Testing

### Unit Tests

```python
# test_module_name.py
import pytest
from scripts.module_name import function_1, function_2

def test_function_1_basic():
    result = function_1(param1="test", param2=10)
    assert result['status'] == 'success'
    assert 'data' in result

def test_function_1_edge_cases():
    # Test empty input
    with pytest.raises(ValueError):
        function_1(param1="", param2=0)
    
    # Test invalid type
    with pytest.raises(TypeError):
        function_1(param1=123, param2="invalid")

def test_function_2_integration():
    # Test with real data
    data = {'field': 'value'}
    result = function_2(data)
    assert result['processed'] is True
```

### Integration Tests

```python
def test_full_workflow():
    # Setup
    input_data = prepare_test_data()
    
    # Execute full workflow
    result1 = function_1(param1=input_data, param2=42)
    result2 = function_2(result1['data'])
    
    # Validate
    assert result2['status'] == 'success'
    assert len(result2['data']) > 0
```

---

## Examples

### Example 1: Basic Usage

```python
from scripts.module_name import function_1

# Simple operation
result = function_1(
    param1="example input",
    param2=10
)

print(f"Status: {result['status']}")
print(f"Data: {result['data']}")
```

**Output:**
```
Status: success
Data: [processed results...]
```

---

### Example 2: Advanced Usage

```python
from scripts.module_name import function_1, function_2
from scripts.config_loader import load_user_config

# Load configuration
config = load_user_config()
module_config = config.get('module_name', {})

# Process with custom settings
intermediate = function_1(
    param1="complex input",
    param2=module_config.get('option_2', 42)
)

# Further processing
final_result = function_2(
    input_data=intermediate['data'],
    options={'format': 'yaml'}
)

# Save result
from scripts.yaml_utils import write_yaml
write_yaml(final_result, 'user-data/db/output.yaml')
```

---

### Example 3: Error Recovery

```python
from scripts.module_name import function_1

try:
    result = function_1(param1=user_input, param2=value)
except ValueError as e:
    print(f"⚠️ Input validation failed: {e}")
    # Use default values
    result = function_1(param1="default", param2=10)
except Exception as e:
    print(f"❌ Unexpected error: {e}")
    # Log for debugging
    import logging
    logging.error(f"Module error: {e}", exc_info=True)
    result = {'status': 'error', 'message': str(e)}

print(f"Final status: {result['status']}")
```

---

## Troubleshooting

### Common Issues

**Issue 1: Function returns unexpected results**
- **Cause:** Invalid input format
- **Solution:** Validate input structure before calling function
- **Check:** Input matches expected schema

**Issue 2: Performance degradation**
- **Cause:** Large dataset without optimization
- **Solution:** Enable caching or batch processing
- **Check:** Dataset size and processing options

**Issue 3: Module not loading**
- **Cause:** Missing dependencies
- **Solution:** Install required packages or check imports
- **Check:** Error messages in logs

---

## Further Reading

### Detailed Documentation
- **Full Specification:** [references/module-name-detailed.md]
- **API Reference:** [references/module-name-api.md]
- **Examples:** [references/module-name-examples.md]

### Related Modules
- **Module A:** Related functionality
- **Module B:** Complementary features
- **Module C:** Alternative approach

### External Resources
- [Relevant documentation link]
- [Tutorial or guide]
- [Research paper or article]

---

## Changelog

### v1.0 (2025-11-03)
- Initial release
- Core functions implemented
- Basic examples provided

---

## Support

- **Issues:** [GitHub Issues](link)
- **Documentation:** [Module docs](link)
- **Examples:** [examples directory](link)

---

## License

Part of the Claude Skills SDK Template  
Licensed under MIT License

---

**Module Version:** 1.0  
**Last Updated:** 2025-11-03  
**Maintained By:** [Your Name]

---

*End of module documentation*
