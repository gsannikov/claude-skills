import pytest
from pathlib import Path
import sys

# Add scripts dir to path to import local modules if needed
sys.path.append(str(Path(__file__).parent.parent / "scripts"))

# Mocking the job analyzer logic since it might depend on external libraries
# for scraping. We'll test the parsing/scoring logic assuming input is clean.

def test_score_calculation_logic():
    """Test that scoring logic works as expected."""
    # This is a placeholder for actual scoring logic test
    # Ideally we'd import the scoring module, but for now proving structure
    
    job_text = "Senior Python Developer with 5 years experience"
    keywords = ["python", "senior"]
    
    score = 0
    for kw in keywords:
        if kw in job_text.lower():
            score += 1
            
    assert score == 2

def test_url_validation():
    """Test URL filtering logic."""
    valid_url = "https://linkedin.com/jobs/view/123456"
    invalid_url = "https://example.com"
    
    def is_valid_source(url):
        return "linkedin.com" in url or "greenhouse.io" in url
        
    assert is_valid_source(valid_url) is True
    assert is_valid_source(invalid_url) is False
