# Setup & Maintenance Manager

A Claude Skill designed to manage the lifecycle and health of your `claude-skills` ecosystem.

## Features

- **First Setup**: Validates environment requirements (Python, Node.js, etc.) and installs dependencies.
- **Skill Discovery**: Lists available skills and explains their capabilities.
- **Maintenance**: Updates dependencies, cleans logs, and performs health checks.

## Usage

This skill is intended to be used via Claude Desktop or an MCP client.

### Tools

- `check_environment`: Verify system requirements.
- `install_dependencies`: Install or update project dependencies.
- `list_skills`: Show installed skills and their status.
- `get_skill_guide`: Get usage instructions for a specific skill.
- `perform_maintenance`: Run cleanup and updates.
