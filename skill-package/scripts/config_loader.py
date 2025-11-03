"""Configuration Loader for Claude Skills"""

from pathlib import Path
import sys

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from config import paths
from scripts import yaml_utils

def load_user_config():
    """Load user configuration from YAML file."""
    try:
        paths.validate_paths()
        config = yaml_utils.read_yaml(paths.USER_CONFIG_FILE)
        return config
    except Exception as e:
        print(f"❌ Error loading config: {e}")
        return None

def get_config_value(key, default=None):
    """Get specific config value with default."""
    config = load_user_config()
    return config.get(key, default) if config else default
