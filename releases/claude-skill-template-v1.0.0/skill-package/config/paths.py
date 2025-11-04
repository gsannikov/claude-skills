"""
Centralized path configuration for filesystem operations.

CRITICAL: Update USER_DATA_BASE to match your local setup before using the skill.

This module provides consistent path handling across the skill, ensuring:
- Clean separation between skill logic and user data
- Easy configuration for different users
- Safe file operations within defined boundaries
"""

import os
from pathlib import Path

# =============================================================================
# USER CONFIGURATION - EDIT THIS SECTION
# =============================================================================

# Base directory for all user data (REQUIRED - UPDATE THIS!)
USER_DATA_BASE = "/Users/YOUR_USERNAME/path/to/your-skill/user-data"

# Example paths (uncomment the one that matches your setup):
# USER_DATA_BASE = "/Users/john/MyDrive/my-skill/user-data"           # macOS with Google Drive
# USER_DATA_BASE = "/Users/john/Documents/my-skill/user-data"         # macOS local
# USER_DATA_BASE = "/Users/john/Dropbox/my-skill/user-data"          # macOS with Dropbox
# USER_DATA_BASE = "/home/john/my-skill/user-data"                    # Linux
# USER_DATA_BASE = "C:/Users/john/my-skill/user-data"                # Windows

# =============================================================================
# DERIVED PATHS - DO NOT EDIT BELOW THIS LINE
# =============================================================================

def get_user_data_base():
    """
    Get the base user data directory, with validation.
    
    Returns:
        str: Absolute path to user data directory
        
    Raises:
        ValueError: If USER_DATA_BASE is not configured
        FileNotFoundError: If directory doesn't exist
    """
    if USER_DATA_BASE == "/Users/YOUR_USERNAME/path/to/your-skill/user-data":
        raise ValueError(
            "❌ USER_DATA_BASE not configured!\n"
            "Please edit skill-package/config/paths.py and set your local path."
        )
    
    if not os.path.exists(USER_DATA_BASE):
        raise FileNotFoundError(
            f"❌ User data directory not found: {USER_DATA_BASE}\n"
            f"Please create the directory or update the path in paths.py"
        )
    
    return os.path.abspath(USER_DATA_BASE)


# Configuration directory
CONFIG_DIR = os.path.join(USER_DATA_BASE, "config")

# Database directory (for YAML data storage)
DB_DIR = os.path.join(USER_DATA_BASE, "db")

# Logs directory
LOGS_DIR = os.path.join(USER_DATA_BASE, "logs")

# Cache directory (for temporary data)
CACHE_DIR = os.path.join(USER_DATA_BASE, "cache")

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def ensure_directories():
    """
    Create all required directories if they don't exist.
    Should be called during initialization.
    """
    directories = [
        USER_DATA_BASE,
        CONFIG_DIR,
        DB_DIR,
        LOGS_DIR,
        CACHE_DIR
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)


def get_config_path(filename):
    """
    Get full path for a configuration file.
    
    Args:
        filename (str): Name of config file (e.g., 'user-config.yaml')
    
    Returns:
        str: Full path to config file
    """
    return os.path.join(CONFIG_DIR, filename)


def get_db_path(subdir=None, filename=None):
    """
    Get full path for a database file or directory.
    
    Args:
        subdir (str, optional): Subdirectory in db/ (e.g., 'entities')
        filename (str, optional): Name of file
    
    Returns:
        str: Full path to db location
    """
    if subdir is None:
        return DB_DIR
    
    path = os.path.join(DB_DIR, subdir)
    
    if filename is not None:
        path = os.path.join(path, filename)
    
    return path


def get_log_path(filename):
    """
    Get full path for a log file.
    
    Args:
        filename (str): Name of log file
    
    Returns:
        str: Full path to log file
    """
    return os.path.join(LOGS_DIR, filename)


def get_cache_path(filename):
    """
    Get full path for a cache file.
    
    Args:
        filename (str): Name of cache file
    
    Returns:
        str: Full path to cache file
    """
    return os.path.join(CACHE_DIR, filename)


def validate_path(path):
    """
    Validate that a path is within user data directory.
    Prevents directory traversal attacks.
    
    Args:
        path (str): Path to validate
    
    Returns:
        bool: True if path is safe, False otherwise
    """
    abs_path = os.path.abspath(path)
    abs_base = os.path.abspath(USER_DATA_BASE)
    
    return abs_path.startswith(abs_base)


def safe_join(*parts):
    """
    Safely join path components and validate result.
    
    Args:
        *parts: Path components to join
    
    Returns:
        str: Joined path
    
    Raises:
        ValueError: If resulting path is outside user data directory
    """
    path = os.path.join(*parts)
    
    if not validate_path(path):
        raise ValueError(
            f"❌ Path outside user data directory: {path}\n"
            f"Must be within: {USER_DATA_BASE}"
        )
    
    return path


# =============================================================================
# PATH REGISTRY
# =============================================================================

PATHS = {
    # Base paths
    'base': USER_DATA_BASE,
    'config': CONFIG_DIR,
    'db': DB_DIR,
    'logs': LOGS_DIR,
    'cache': CACHE_DIR,
    
    # Common config files
    'user_config': get_config_path('user-config.yaml'),
    
    # Common db subdirectories
    'db_entities': get_db_path('entities'),
    'db_cache': get_db_path('cache'),
}


def get_path(key):
    """
    Get a path from the registry.
    
    Args:
        key (str): Path key from PATHS dictionary
    
    Returns:
        str: Path value
    
    Raises:
        KeyError: If key not found in registry
    """
    if key not in PATHS:
        raise KeyError(
            f"❌ Unknown path key: {key}\n"
            f"Available keys: {', '.join(PATHS.keys())}"
        )
    
    return PATHS[key]


# =============================================================================
# INITIALIZATION
# =============================================================================

def init():
    """
    Initialize path configuration.
    Creates required directories and validates setup.
    
    Should be called when skill first loads.
    """
    try:
        # Validate configuration
        base = get_user_data_base()
        print(f"✅ User data directory: {base}")
        
        # Create directories
        ensure_directories()
        print(f"✅ Directory structure verified")
        
        return True
        
    except (ValueError, FileNotFoundError) as e:
        print(f"❌ Path configuration error:\n{e}")
        return False


# =============================================================================
# AUTO-INITIALIZATION (optional)
# =============================================================================

# Uncomment to automatically initialize when module is imported
# init()


if __name__ == "__main__":
    # Test configuration when run directly
    print("Testing path configuration...")
    print(f"USER_DATA_BASE: {USER_DATA_BASE}")
    print(f"CONFIG_DIR: {CONFIG_DIR}")
    print(f"DB_DIR: {DB_DIR}")
    print(f"LOGS_DIR: {LOGS_DIR}")
    print(f"CACHE_DIR: {CACHE_DIR}")
    
    if init():
        print("\n✅ Configuration valid!")
    else:
        print("\n❌ Configuration invalid!")
