# RAG-Powered Project Memory MVP

This directory contains the MVP implementation of a Retrieval-Augmented Generation (RAG) system that enables persistent project memory for the Gemini CLI. This allows Gemini to answer queries with context derived from the entire BS Display codebase.

## 🎯 Overview

The RAG system transforms Gemini from a stateless LLM into a project-aware assistant by:
1. **Ingesting** the entire codebase into a vector database
2. **Retrieving** relevant context for user queries  
3. **Augmenting** Gemini prompts with project-specific context
4. **Generating** comprehensive, project-aware responses

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Navigate to the rag directory
cd /Users/kristoffersanio/git/bs-display/dev/rag

# Activate virtual environment
source venv/bin/activate

# Create .env file with your Gemini API key
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 2. Ingest Project

```bash
# Ingest the entire BS Display project
python3 gemini_rag_cli.py ingest --project-root /Users/kristoffersanio/git/bs-display/dev
```

### 3. Query with Context

```bash
# Ask questions about the project
python3 gemini_rag_cli.py query --query "How does the ProductCard component work?"

# Debug issues
python3 gemini_rag_cli.py query --query "DEBUG ANALYSIS: images 404 on product pages"

# Code review
python3 gemini_rag_cli.py query --query "CODE REVIEW: ProductCard functional programming standards"

# Architecture decisions
python3 gemini_rag_cli.py query --query "ARCHITECTURE: how to implement new filter feature"
```

## 🛠️ Claude Integration

The system integrates with Claude through custom slash commands:

### Available Commands

- **`gemini-context`** - Ingest entire project into vector database
- **`gemini "your query"`** - General project queries
- **`debug "issue description"`** - Debugging with project context
- **`review "component/code"`** - Code review against project standards
- **`architect "feature/decision"`** - Architectural guidance
- **`gemini-update`** - Re-ingest project after changes

### Usage Examples

```bash
# In Claude CLI
/gemini-context                              # Ingest project
/gemini "How does quiz scoring work?"        # General query
/debug "TypeScript errors in FilterUI"      # Debug issue
/review "ProductCard component"              # Code review
/architect "new user authentication"        # Architecture
/gemini-update                              # Update context
```

## 📁 System Architecture

```
rag/
├── gemini_rag_cli.py     # Main RAG CLI script
├── requirements.txt      # Python dependencies
├── venv/                 # Virtual environment
├── chroma_db/           # Vector database (created after ingestion)
├── .env                 # Environment variables (create from .env.example)
└── README.md            # This file
```

### Core Components

1. **File Processing**: Scans project for relevant files (.tsx, .ts, .astro, .md, .json, .scss, etc.)
2. **Text Chunking**: Splits large files into semantic chunks using LangChain
3. **Embedding Generation**: Creates vector embeddings using Gemini's text-embedding-004
4. **Vector Storage**: Stores embeddings in ChromaDB for fast similarity search
5. **Context Retrieval**: Finds relevant code snippets for user queries
6. **Response Generation**: Augments Gemini prompts with retrieved context

## ⚙️ Configuration

### Environment Variables

```bash
# Required
GEMINI_API_KEY=your_gemini_api_key_here
```

### Supported File Types

- **Frontend**: .tsx, .ts, .js, .jsx, .astro
- **Styles**: .scss, .css  
- **Data**: .json, .yml, .yaml
- **Documentation**: .md
- **Scripts**: .py, .sh

### Chunking Strategy

- **Chunk Size**: 500 characters
- **Overlap**: 100 characters
- **Method**: Recursive character splitting for semantic coherence

## 🔧 Advanced Usage

### Direct Script Usage

```bash
# Activate environment
source venv/bin/activate

# Ingest with custom settings
python3 gemini_rag_cli.py ingest --project-root /path/to/project

# Query with debugging
python3 gemini_rag_cli.py query --query "Your question here"

# Update/re-ingest
python3 gemini_rag_cli.py update --project-root /path/to/project
```

### Monitoring Ingestion

The system provides detailed logging during ingestion:
- Files processed count
- Chunks created count
- Progress updates every 10 files
- Error handling for problematic files

### Context Retrieval Details

- **Default Retrieval**: Top 5 most relevant chunks
- **Similarity Metric**: Cosine similarity in embedding space
- **Context Assembly**: Includes file paths and chunk content
- **Metadata**: File extension, chunk index, and file path preserved

## 🎯 Success Criteria (MVP)

✅ **Completed Features:**
- [x] Ingest BS Display project files into ChromaDB
- [x] Generate embeddings using Gemini text-embedding-004
- [x] Retrieve relevant context for queries
- [x] Integrate with Claude CLI commands
- [x] Support debugging, code review, and architecture workflows
- [x] Error handling and progress logging
- [x] Update/re-ingestion capability

✅ **Validated Workflows:**
- [x] Project ingestion (hundreds of files)
- [x] Context-aware query responses
- [x] Integration with Claude command structure
- [x] Specialized workflows (debug, review, architect)

## 🚀 Next Steps

### Phase 2 Enhancements
- Incremental updates (only changed files)
- Multiple project support
- Advanced filtering options
- Performance optimizations

### Phase 3 Features
- Code change tracking
- Semantic code analysis
- Integration with development tools
- Advanced prompt engineering

## 🐛 Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY not set"**
   - Create `.env` file from `.env.example`
   - Add your Gemini API key

2. **"Failed to initialize vector database"**
   - Ensure write permissions in rag directory
   - Check available disk space

3. **"No relevant context found"**
   - Run `gemini-update` to refresh embeddings
   - Check query is related to project content

4. **Import errors**
   - Ensure virtual environment is activated
   - Run `pip install -r requirements.txt`

### Performance Notes

- **Initial Ingestion**: 2-5 minutes for BS Display project
- **Query Response**: 3-10 seconds depending on context size
- **Storage**: ~50MB for typical project embeddings

## 📊 Expected Outcomes

### Development Velocity
- **Faster Debugging**: Instant access to project-wide context
- **Better Code Reviews**: Consistency checking against project patterns
- **Informed Architecture**: Decisions based on existing patterns

### Code Quality
- **Pattern Consistency**: Recommendations align with project standards
- **Reduced Technical Debt**: Better integration with existing systems
- **Enhanced Documentation**: Context-aware explanations

### Developer Experience
- **Reduced Context Switching**: All information in one place
- **Faster Onboarding**: New developers get instant project knowledge
- **Confident Decisions**: Full project context for every choice

---

**The RAG-powered project memory system transforms development from context-limited operations into comprehensive, project-aware workflows.**