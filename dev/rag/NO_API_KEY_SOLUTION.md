# Local Gemini CLI Solution (No API Key Required)

## Problem
The original RAG implementation requires `GEMINI_API_KEY` because it uses Google's Generative AI Python SDK for:
1. **Embeddings**: Generating vector embeddings via `text-embedding-004` model
2. **Chat Completion**: Sending requests to Gemini API

## Solution: Local CLI Version

I've created `gemini_rag_cli_local.py` that works with your locally installed Gemini CLI instead of requiring API keys.

### Key Differences

| Feature | API Version | Local CLI Version |
|---------|-------------|------------------|
| **Authentication** | Requires `GEMINI_API_KEY` | Uses local Gemini CLI |
| **Embeddings** | Gemini text-embedding-004 | Keyword-based TF-IDF similarity |
| **Vector DB** | ChromaDB with embeddings | SQLite with keyword indexing |
| **Dependencies** | ~40+ packages | Just `langchain` |
| **Setup** | Complex (API key, chromadb, etc.) | Simple (pip install langchain) |
| **Performance** | High accuracy with embeddings | Good accuracy with keywords |

### How the Local Version Works

1. **Text Processing**: Same chunking using LangChain
2. **Keyword Extraction**: Extracts important keywords from each chunk
3. **SQLite Storage**: Stores chunks with keywords in a simple database
4. **Similarity Search**: Matches query keywords against stored chunks
5. **Local Gemini**: Uses your local `gemini` CLI for response generation

## Setup Instructions

### 1. Install Minimal Dependencies
```bash
cd rag
source venv/bin/activate
pip install -r requirements_local.txt  # Just langchain
```

### 2. Ingest Project (No API Key)
```bash
python3 gemini_rag_cli_local.py ingest --project-root /Users/kristoffersanio/git/bs-display/dev
```

### 3. Query with Context
```bash
python3 gemini_rag_cli_local.py query --query "How does ProductCard work?"
```

## Claude Commands (Local Version)

I've created local versions of the Claude commands:

- **`/gemini-context-local`** - Ingest project without API key
- **`/gemini-local "query"`** - Query using local CLI

### Example Usage
```bash
# In Claude CLI
/gemini-context-local                    # Ingest project (no API key)
/gemini-local "How does ProductCard work?"  # Query with context
```

## Comparison: Which Should You Use?

### Use **API Version** (`gemini_rag_cli.py`) if:
- ✅ You have a Gemini API key
- ✅ You want maximum accuracy with vector embeddings
- ✅ You're building a production system
- ✅ You need advanced semantic search

### Use **Local Version** (`gemini_rag_cli_local.py`) if:
- ✅ You don't want to deal with API keys
- ✅ You want simple setup and minimal dependencies
- ✅ You're experimenting or testing
- ✅ Keyword-based search is sufficient for your use case

## Testing the Local Version

Let's test it with a small sample to verify it works:

```bash
# Test basic functionality
cd rag
source venv/bin/activate

# Check if it can detect your local Gemini CLI
python3 gemini_rag_cli_local.py query --query "test" 
# (This will fail but show if CLI detection works)

# Test ingestion on a small subset
mkdir test_project
echo "function ProductCard() { return <div>Card</div>; }" > test_project/ProductCard.tsx
python3 gemini_rag_cli_local.py ingest --project-root test_project

# Test query
python3 gemini_rag_cli_local.py query --query "How does ProductCard work?"
```

## Architecture Comparison

### API Version Architecture
```
User Query → ChromaDB Search → Gemini API → Response
            ↑ (embeddings)
```

### Local Version Architecture  
```
User Query → SQLite Keyword Search → Local Gemini CLI → Response
            ↑ (keyword extraction)
```

## Performance Expectations

### API Version:
- **Setup**: 5-10 minutes (dependencies + API key)
- **Ingestion**: 2-5 minutes for full project
- **Query**: 3-5 seconds
- **Accuracy**: High (semantic understanding)

### Local Version:
- **Setup**: 1 minute (minimal dependencies)
- **Ingestion**: 30 seconds - 2 minutes 
- **Query**: 1-3 seconds
- **Accuracy**: Good (keyword matching)

## Recommendation

**Start with the local version** to test the concept and workflow. If you find it useful and want higher accuracy, you can always upgrade to the API version later by getting a Gemini API key.

Both versions store their data separately, so you can have both installed and switch between them as needed.