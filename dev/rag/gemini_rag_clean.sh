#!/bin/bash
# Clean wrapper script that suppresses ChromaDB telemetry errors

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Activate virtual environment
source "${SCRIPT_DIR}/venv/bin/activate"

# Run the Gemini RAG CLI with all arguments, filtering out telemetry errors
python3 "${SCRIPT_DIR}/gemini_rag_cli.py" "$@" 2>&1 | grep -v "Failed to send telemetry event" | grep -v "capture() takes 1 positional argument"