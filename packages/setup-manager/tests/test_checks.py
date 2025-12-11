import pytest
import sys
import shutil

def test_tool_presence_check():
    """Test logic for checking tool existence."""
    # We can test if python exists, which it should
    def check_tool(tool_name):
        return shutil.which(tool_name) is not None
        
    assert check_tool("python3") is True
    # Assumes 'made_up_tool' doesn't exist
    assert check_tool("made_up_tool_xyz") is False

def test_version_parsing():
    """Test logic for parsing version strings."""
    version_output = "Python 3.11.5"
    
    def clean_version(output):
        return output.split(" ")[1]
        
    assert clean_version(version_output) == "3.11.5"
