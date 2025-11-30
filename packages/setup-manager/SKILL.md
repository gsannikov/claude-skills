---
name: Setup & Maintenance Manager
description: Manages the setup, discovery, and maintenance of the Claude Skills ecosystem.
version: 0.1.0
---

# Setup & Maintenance Manager

This skill helps users set up their environment, discover other available skills, and maintain the health of the `claude-skills` project.

## Capabilities

1.  **Environment Setup**: Checks for required tools (Python, uv, npm, git) and helps configure the environment.
2.  **Skill Discovery**: Scans the `packages/` directory to find and describe other skills.
3.  **Maintenance**: Provides tools to update dependencies and clean up logs.

## Tools

- `check_environment`: Checks if the necessary system tools are installed and configured.
- `install_dependencies`: Runs the appropriate commands to install dependencies for the project or specific skills.
- `list_skills`: Lists all available skills in the `packages/` directory with brief descriptions.
- `get_skill_guide`: Retrieves detailed usage information for a specific skill.
- `perform_maintenance`: Performs routine maintenance tasks like log rotation and dependency updates.
