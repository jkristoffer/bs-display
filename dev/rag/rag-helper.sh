#!/bin/bash
# RAG Helper Script - Simplified Management for BS Display Project
# Usage: ./rag-helper.sh [command] [collection]

set -e

# Configuration
PROJECT_ROOT="/Users/kristoffersanio/git/bs-display/dev"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RAG_SCRIPT="${SCRIPT_DIR}/gemini_rag_wrapper.sh"

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Collection information function
get_collection_info() {
    case "$1" in
        codebase) echo "Core development files (TypeScript, React, docs) - ~250 files, 15-20 min" ;;
        product-data) echo "Product specifications and data (JSON files) - 7 files, 1-2 min" ;;
        blog) echo "Blog posts and marketing content - ~50 files, 5-10 min" ;;
        all) echo "Complete project (everything) - ~500+ files, 30+ min" ;;
        *) echo "Unknown collection" ;;
    esac
}

# Functions
show_header() {
    echo -e "${CYAN}╭─────────────────────────────────────────────────────────────╮${NC}"
    echo -e "${CYAN}│                    🤖 RAG Helper Script                    │${NC}"
    echo -e "${CYAN}│                BS Display Project Context Manager           │${NC}"
    echo -e "${CYAN}╰─────────────────────────────────────────────────────────────╯${NC}"
    echo
}

show_collections() {
    echo -e "${BLUE}📚 Available Collections:${NC}"
    echo
    for collection in codebase product-data blog all; do
        echo -e "  ${YELLOW}${collection}${NC}: $(get_collection_info $collection)"
    done
    echo
}

show_usage() {
    show_header
    echo -e "${GREEN}Usage:${NC}"
    echo "  ./rag-helper.sh ingest [collection]     # Ingest a collection"
    echo "  ./rag-helper.sh query [collection]      # Query a collection interactively"
    echo "  ./rag-helper.sh status                  # Show collection status"
    echo "  ./rag-helper.sh menu                    # Interactive menu"
    echo
    show_collections
    echo -e "${GREEN}Examples:${NC}"
    echo "  ./rag-helper.sh ingest product-data     # Quick product specs ingestion"
    echo "  ./rag-helper.sh ingest codebase         # Main development context"
    echo "  ./rag-helper.sh query codebase          # Ask about code"
    echo "  ./rag-helper.sh menu                    # Interactive mode"
    echo
}

check_prerequisites() {
    if [[ ! -f "$RAG_SCRIPT" ]]; then
        echo -e "${RED}❌ Error: RAG script not found at $RAG_SCRIPT${NC}"
        exit 1
    fi
    
    if [[ ! -x "$RAG_SCRIPT" ]]; then
        echo -e "${YELLOW}⚠️  Making RAG script executable...${NC}"
        chmod +x "$RAG_SCRIPT"
    fi
    
    if [[ ! -d "$PROJECT_ROOT" ]]; then
        echo -e "${RED}❌ Error: Project root not found at $PROJECT_ROOT${NC}"
        exit 1
    fi
}

ingest_collection() {
    local collection="$1"
    
    if [[ -z "$collection" ]]; then
        echo -e "${RED}❌ Error: Collection name required${NC}"
        echo "Available: codebase, product-data, blog, all"
        exit 1
    fi
    
    if [[ ! "$collection" =~ ^(codebase|product-data|blog|all)$ ]]; then
        echo -e "${RED}❌ Error: Invalid collection '$collection'${NC}"
        echo "Available: codebase, product-data, blog, all"
        exit 1
    fi
    
    echo -e "${GREEN}🚀 Starting ingestion for collection: ${YELLOW}$collection${NC}"
    echo -e "${BLUE}ℹ️  $(get_collection_info $collection)${NC}"
    echo
    
    # Confirm for large collections
    if [[ "$collection" == "all" ]]; then
        echo -e "${YELLOW}⚠️  WARNING: 'all' collection is very large and may take 30+ minutes${NC}"
        read -p "Continue? (y/N): " confirm
        if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
            echo "Cancelled."
            exit 0
        fi
    fi
    
    echo -e "${CYAN}📥 Running ingestion...${NC}"
    "$RAG_SCRIPT" ingest --project-root "$PROJECT_ROOT" --collection "$collection" --force
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}✅ Ingestion completed successfully!${NC}"
        echo -e "${BLUE}You can now query with: ./rag-helper.sh query $collection${NC}"
    else
        echo -e "${RED}❌ Ingestion failed${NC}"
        exit 1
    fi
}

query_collection() {
    local collection="$1"
    
    if [[ -z "$collection" ]]; then
        echo -e "${RED}❌ Error: Collection name required${NC}"
        echo "Available: codebase, product-data, blog, all"
        exit 1
    fi
    
    echo -e "${GREEN}🔍 Querying collection: ${YELLOW}$collection${NC}"
    echo -e "${BLUE}ℹ️  $(get_collection_info $collection)${NC}"
    echo
    echo -e "${CYAN}Enter your query (or 'quit' to exit):${NC}"
    
    while true; do
        echo -n "> "
        read -r query
        
        if [[ "$query" == "quit" || "$query" == "exit" ]]; then
            echo "Goodbye!"
            break
        fi
        
        if [[ -n "$query" ]]; then
            echo -e "${CYAN}🤖 Searching...${NC}"
            "$RAG_SCRIPT" query --query "$query" --collection "$collection"
            echo
        fi
    done
}

show_status() {
    echo -e "${GREEN}📊 Collection Status:${NC}"
    echo
    
    # Check which collections exist by looking at ChromaDB
    local chroma_path="${SCRIPT_DIR}/chroma_db"
    
    if [[ -d "$chroma_path" ]]; then
        echo -e "${BLUE}Database found at: $chroma_path${NC}"
        
        # Try to query each collection to see if it exists
        for collection in codebase product-data blog all; do
            local collection_name
            case $collection in
                codebase) collection_name="codebase_memory" ;;
                product-data) collection_name="product_data" ;;
                blog) collection_name="blog_content" ;;
                all) collection_name="complete_project" ;;
            esac
            
            echo -e "  ${YELLOW}$collection${NC} ($collection_name): $(get_collection_info $collection)"
        done
    else
        echo -e "${YELLOW}⚠️  No database found. Run ingestion first.${NC}"
    fi
    echo
}

interactive_menu() {
    while true; do
        show_header
        echo -e "${GREEN}Select an option:${NC}"
        echo "1. Ingest product data (fastest - 2 minutes)"
        echo "2. Ingest codebase (recommended - 20 minutes)"  
        echo "3. Ingest blog content (5-10 minutes)"
        echo "4. Ingest everything (slow - 30+ minutes)"
        echo "5. Query existing collection"
        echo "6. Show collection status"
        echo "7. Show usage help"
        echo "8. Exit"
        echo
        echo -n "Enter choice (1-8): "
        read -r choice
        
        case $choice in
            1) ingest_collection "product-data" ;;
            2) ingest_collection "codebase" ;;
            3) ingest_collection "blog" ;;
            4) ingest_collection "all" ;;
            5) 
                echo "Available collections: codebase, product-data, blog, all"
                echo -n "Enter collection name: "
                read -r collection
                query_collection "$collection"
                ;;
            6) show_status ;;
            7) show_usage ;;
            8) echo "Goodbye!"; exit 0 ;;
            *) echo -e "${RED}Invalid choice. Please enter 1-8.${NC}" ;;
        esac
        
        echo
        echo -e "${YELLOW}Press Enter to continue...${NC}"
        read -r
    done
}

# Main script logic
check_prerequisites

case "${1:-}" in
    ingest)
        ingest_collection "$2"
        ;;
    query)
        query_collection "$2"
        ;;
    status)
        show_status
        ;;
    menu)
        interactive_menu
        ;;
    help|--help|-h)
        show_usage
        ;;
    "")
        interactive_menu
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo
        show_usage
        exit 1
        ;;
esac