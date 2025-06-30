#!/bin/bash
# Wrapper script to run Gemini RAG CLI with virtual environment

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Activate virtual environment
source "${SCRIPT_DIR}/venv/bin/activate"

# Run the Gemini RAG CLI with all arguments
python3 "${SCRIPT_DIR}/gemini_rag_cli.py" "$@"