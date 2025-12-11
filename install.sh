#!/bin/bash
#
# Exocortex One-Line Installer
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/gsannikov/exocortex/main/install.sh | bash
#
# Or download and run:
#   chmod +x install.sh && ./install.sh
#

set -e

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

REPO_URL="https://github.com/gsannikov/exocortex.git"
# Default install directory - can be overridden with EXOCORTEX_DIR env var
INSTALL_DIR="${EXOCORTEX_DIR:-$HOME/Projects/exocortex}"
DATA_DIR="${EXOCORTEX_DATA:-$HOME/exocortex-data}"
BRANCH="${EXOCORTEX_BRANCH:-main}"
VENV_DIR=".venv"
RUN_TESTS="${RUN_TESTS:-1}"  # Set RUN_TESTS=0 to skip pytest during install
PY_VERSION_MIN="3.11"
PY_VERSION_MAX_EXCLUSIVE="3.14"  # Avoid 3.14+ due to wheel gaps (onnxruntime/ocrmypdf)

# ═══════════════════════════════════════════════════════════════════════════════
# COLORS
# ═══════════════════════════════════════════════════════════════════════════════

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m' # No Color

# Disable colors if not terminal
if [ ! -t 1 ]; then
    RED='' GREEN='' YELLOW='' BLUE='' CYAN='' BOLD='' DIM='' NC=''
fi

# ═══════════════════════════════════════════════════════════════════════════════
# HELPERS
# ═══════════════════════════════════════════════════════════════════════════════

print_header() {
    echo ""
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${CYAN}  $1${NC}"
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo ""
}

print_step() {
    echo -e "${BOLD}${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ $1${NC}"
}

check_command() {
    if command -v "$1" &> /dev/null; then
        return 0
    else
        return 1
    fi
}

version_ge() {
    # Compare two dotted versions, returns 0 if $1 >= $2
    [ "$(printf '%s\n' "$2" "$1" | sort -V | head -n1)" = "$2" ]
}

ensure_python() {
    print_step "Checking Python version (${PY_VERSION_MIN}+ < ${PY_VERSION_MAX_EXCLUSIVE})..."

    PYTHON_CMD=""
    if check_command python3.11; then
        PYTHON_CMD="python3.11"
    elif check_command python3; then
        PYTHON_CMD="python3"
    elif check_command python; then
        PYTHON_CMD="python"
    fi

    if [ -z "$PYTHON_CMD" ]; then
        print_error "Python 3 is not installed. Please install Python ${PY_VERSION_MIN} (recommended)."
        exit 1
    fi

    PY_VERSION="$($PYTHON_CMD -c 'import sys; print(".".join(map(str, sys.version_info[:3])))')"
    PY_MAJOR="$($PYTHON_CMD -c 'import sys; print(sys.version_info.major)')"
    PY_MINOR="$($PYTHON_CMD -c 'import sys; print(sys.version_info.minor)')"

    if [ "$PY_MAJOR" -ne 3 ]; then
        print_error "Python 3 is required (found $PY_VERSION)."
        exit 1
    fi
    if ! version_ge "$PY_VERSION" "$PY_VERSION_MIN"; then
        print_error "Python >= ${PY_VERSION_MIN} is required (found $PY_VERSION)."
        exit 1
    fi
    if version_ge "$PY_VERSION" "$PY_VERSION_MAX_EXCLUSIVE"; then
        print_error "Python >= ${PY_VERSION_MAX_EXCLUSIVE} is not supported yet (found $PY_VERSION). Please install Python ${PY_VERSION_MIN}."
        exit 1
    fi

    print_success "Using $PYTHON_CMD ($PY_VERSION)"
}

install_system_deps() {
    print_step "Installing system dependencies for OCR (tesseract, qpdf, ghostscript, poppler, antiword)..."
    local system="$1"
    if [ "$system" = "darwin" ]; then
        if check_command brew; then
            if ! brew install tesseract qpdf ghostscript poppler antiword; then
                print_warning "Homebrew install failed. Install manually: brew install tesseract qpdf ghostscript poppler antiword"
            fi
        else
            print_warning "Homebrew not found. Install it from https://brew.sh, then run: brew install tesseract qpdf ghostscript poppler antiword"
        fi
    elif [ "$system" = "linux" ]; then
        if check_command apt-get; then
            if ! sudo apt-get update; then
                print_warning "apt-get update failed. Install system deps manually."
            else
                if ! sudo apt-get install -y tesseract-ocr tesseract-ocr-heb qpdf ghostscript poppler-utils antiword; then
                    print_warning "apt-get install failed. Ensure you have sudo access and try manually."
                fi
            fi
        else
            print_warning "Unsupported package manager. Install manually: tesseract-ocr qpdf ghostscript poppler-utils antiword"
        fi
    else
        print_warning "Unknown platform. Please install system packages manually: tesseract, qpdf, ghostscript, poppler-utils, antiword"
    fi

    # Verify critical binaries
    for cmd in tesseract qpdf gs pdfinfo; do
        if ! check_command "$cmd"; then
            print_warning "$cmd not found after installation. Some OCR features may fail until installed."
        fi
    done
}

create_virtualenv() {
    print_step "Creating virtual environment at ${VENV_DIR}..."
    cd "$INSTALL_DIR"
    if [ -d "$VENV_DIR" ]; then
        print_info "Removing existing ${VENV_DIR}..."
        rm -rf "$VENV_DIR"
    fi
    $PYTHON_CMD -m venv "$VENV_DIR"
    print_success "Virtualenv created."
}

install_python_deps() {
    print_step "Installing Python dependencies..."
    local pip_bin="$INSTALL_DIR/$VENV_DIR/bin/pip"
    "$pip_bin" install -U pip
    "$pip_bin" install -r packages/local-rag/requirements-dev.txt
    print_success "Python dependencies installed."
}

run_tests() {
    if [ "$RUN_TESTS" = "0" ]; then
        print_info "Skipping tests (RUN_TESTS=0)."
        return
    fi
    print_step "Running Local RAG test suite..."
    local pytest_bin="$INSTALL_DIR/$VENV_DIR/bin/pytest"
    LOCAL_RAG_REAL_OCR_DEPS=1 "$pytest_bin" packages/local-rag/tests -q
    print_success "Tests passed."
}

create_data_dirs() {
    print_step "Creating data directory structure at ${DATA_DIR}..."
    
    mkdir -p "$DATA_DIR/career/analyses"
    mkdir -p "$DATA_DIR/career/interview-prep/negotiations"
    mkdir -p "$DATA_DIR/reading-list/summaries"
    mkdir -p "$DATA_DIR/ideas-capture/expanded"
    mkdir -p "$DATA_DIR/voice-memos/transcripts"
    mkdir -p "$DATA_DIR/voice-memos/analyzed"
    mkdir -p "$DATA_DIR/local-rag/vectordb"
    mkdir -p "$DATA_DIR/recipe-manager/recipes"
    mkdir -p "$DATA_DIR/social-media-post/posts"
    
    print_success "Data directories created at $DATA_DIR"
}

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN INSTALLATION
# ═══════════════════════════════════════════════════════════════════════════════

main() {
    print_header "Exocortex Installer"

    echo -e "This script will:"
    echo -e "  1. Check prerequisites (git, Python ${PY_VERSION_MIN}+ < ${PY_VERSION_MAX_EXCLUSIVE})"
    echo -e "  2. Clone or update the Exocortex repository"
    echo -e "  3. Install system OCR dependencies (tesseract/qpdf/ghostscript/poppler/antiword)"
    echo -e "  4. Create a fresh virtualenv at ${VENV_DIR} and install Python deps"
    echo -e "  5. Create data directories at ${DATA_DIR}"
    echo -e "  6. Run Local RAG tests (set RUN_TESTS=0 to skip)"
    echo -e "  7. Run the setup wizard"
    echo ""
    echo -e "${BOLD}Skills included (9):${NC}"
    echo -e "  💼 Job Analyzer      - Job scoring & tracking"
    echo -e "  🎯 Interview Prep    - STAR stories & negotiation"
    echo -e "  📚 Reading List      - Article capture & summarization"
    echo -e "  💡 Ideas Capture     - Idea expansion & scoring"
    echo -e "  🎙️ Voice Memos       - Transcription & analysis"
    echo -e "  🔍 Local RAG         - Semantic document search"
    echo -e "  📱 Social Media      - Platform-optimized posts"
    echo -e "  🍳 Recipe Manager    - Recipe extraction & tracking"
    echo -e "  🔧 Setup Manager     - Environment management"
    echo ""

    # ─────────────────────────────────────────────────────────────────────────
    # Check prerequisites
    # ─────────────────────────────────────────────────────────────────────────

    print_step "Checking prerequisites..."

    # Check git
    if check_command git; then
        print_success "git is installed"
    else
        print_error "git is not installed"
        echo ""
        echo "Please install git first:"
        case "$(uname -s)" in
            Darwin)
                echo "  brew install git"
                echo "  or: xcode-select --install"
                ;;
            Linux)
                echo "  sudo apt install git"
                echo "  or: sudo yum install git"
                ;;
            *)
                echo "  Please install git for your platform"
                ;;
        esac
        exit 1
    fi

    ensure_python

    # ─────────────────────────────────────────────────────────────────────────
    # Confirm installation directory
    # ─────────────────────────────────────────────────────────────────────────

    print_step "Installation directory"

    echo -e "Skills will be installed to: ${CYAN}${INSTALL_DIR}${NC}"
    echo -e "User data will be stored at: ${CYAN}${DATA_DIR}${NC}"
    echo ""

    # Check if directory exists
    if [ -d "$INSTALL_DIR" ]; then
        if [ -d "$INSTALL_DIR/.git" ]; then
            print_warning "Directory exists and is a git repository"
            echo ""
            read -p "Update existing installation? [Y/n] " -n 1 -r
            echo ""
            if [[ $REPLY =~ ^[Nn]$ ]]; then
                print_info "Installation cancelled"
                exit 0
            fi

            # Pull latest changes
            print_step "Updating existing installation..."
            cd "$INSTALL_DIR"
            git fetch origin "$BRANCH"
            git checkout "$BRANCH"
            git pull origin "$BRANCH"
            print_success "Updated to latest version"
        else
            print_error "Directory exists but is not an Exocortex repository"
            echo "Please remove it or set EXOCORTEX_DIR to a different location:"
            echo "  EXOCORTEX_DIR=~/other/path ./install.sh"
            exit 1
        fi
    else
        # Clone repository
        print_step "Cloning repository..."

        # Create parent directory if needed
        mkdir -p "$(dirname "$INSTALL_DIR")"

        git clone --branch "$BRANCH" "$REPO_URL" "$INSTALL_DIR"
        print_success "Repository cloned"

        cd "$INSTALL_DIR"
    fi

    SYSTEM="$(uname -s | tr '[:upper:]' '[:lower:]')"
    install_system_deps "$SYSTEM"
    create_virtualenv
    install_python_deps
    create_data_dirs
    run_tests

    # ─────────────────────────────────────────────────────────────────────────
    # Run setup script
    # ─────────────────────────────────────────────────────────────────────────

    print_step "Running setup wizard..."
    echo ""

    PY_BIN="$INSTALL_DIR/$VENV_DIR/bin/python"
    if [ ! -x "$PY_BIN" ]; then
        PY_BIN="$PYTHON_CMD"
    fi

    # Install setup-manager
    print_step "Installing Setup Manager..."
    "$INSTALL_DIR/$VENV_DIR/bin/pip" install -e packages/setup-manager

    if [ -f "packages/setup-manager/setup_manager/cli.py" ]; then
        "$PY_BIN" -m setup_manager.cli
    else
        print_error "Setup Manager CLI not found"
        exit 1
    fi

    print_success "Environment ready."
    echo ""
    echo "Next steps:"
    echo "  1) Activate the virtualenv: source ${INSTALL_DIR}/${VENV_DIR}/bin/activate"
    echo "  2) (Optional) Re-run tests anytime: LOCAL_RAG_REAL_OCR_DEPS=1 pytest packages/local-rag/tests -q"
    echo "  3) Start augmenting your mind with Exocortex!"
    echo ""
    echo "Data location: ${DATA_DIR}"
    echo "  - career/          Job analysis & interview prep"
    echo "  - reading-list/    Articles & summaries"
    echo "  - ideas-capture/   Ideas & expansions"
    echo "  - voice-memos/     Transcripts & analysis"
    echo "  - local-rag/       Vector database"
    echo "  - recipe-manager/  Recipes"
}

# ═══════════════════════════════════════════════════════════════════════════════
# Error handling
# ═══════════════════════════════════════════════════════════════════════════════

trap 'print_error "Installation failed!"; exit 1' ERR

# ═══════════════════════════════════════════════════════════════════════════════
# Run
# ═══════════════════════════════════════════════════════════════════════════════

main "$@"
