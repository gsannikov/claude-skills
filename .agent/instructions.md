# Agent Instructions

## Local RAG Package

**CRITICAL: Never create or use local Python virtual environments (`venv`, `.venv`, `env`) for the `packages/local-rag` package.**

This package is fully Dockerized. All dependencies are managed within the Docker container. Use the following approach:

- **Development**: Use Docker for all testing and execution
- **CI/CD**: Docker-based workflows only
- **Installation**: Users install via Docker, not local pip

If you need to test changes:
1. Build the Docker image: `docker build -t local-rag-mcp packages/local-rag`
2. Run via the wrapper script: `packages/local-rag/run_mcp_docker.sh`

Do not create venvs to avoid bloating the repository (PyTorch alone is ~800MB).
