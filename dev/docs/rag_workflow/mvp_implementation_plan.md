# MVP Implementation Plan: RAG-Powered Project Memory

### Goal

The goal of this MVP is to build the foundational components for a Retrieval-Augmented Generation (RAG) system that enables persistent project memory for the Gemini CLI. This will allow Gemini to answer queries with context derived from the entire codebase, overcoming its inherent statelessness.

### Assumptions

*   A Python 3.x environment is available.
*   `pip` is installed and functional.
*   A Google Gemini API key is obtained and configured (e.g., as an environment variable `GEMINI_API_KEY`).
*   The Claude CLI is set up and functional, capable of executing bash commands and custom scripts.

### Success Criteria for MVP

*   The `gemini_rag_cli.py` script can successfully ingest a small project (e.g., 5-10 files) into a local vector database.
*   The `gemini_rag_cli.py` script can successfully retrieve relevant code snippets for simple, direct queries.
*   The Claude commands (`gemini-context`, `gemini`, `debug`, `review`, `architect`) successfully trigger the `gemini_rag_cli.py` script.
*   Gemini's responses, when augmented with retrieved context, are noticeably more relevant and informed than without.
*   Basic error handling is in place to prevent crashes for common issues.

### Phases and Detailed Task Plan

---

### Phase 1: Core RAG System (Ingestion & Basic Retrieval)

**Goal:** Establish the fundamental Python components for ingesting code into a vector database and performing basic context retrieval.

**Estimated Time:** 1-2 days

**Tasks:**

1.  **Environment Setup & Dependencies:**
    *   Create a new Python virtual environment for the RAG system.
    *   Install necessary Python packages:
        *   `google-generativeai`: For Gemini API interaction (embeddings and chat).
        *   `chromadb`: For the local vector database.
        *   `langchain` (or similar): For text splitting/chunking utilities (e.g., `RecursiveCharacterTextSplitter`).
        *   `python-dotenv`: For loading API keys from `.env`.
    *   Create a `requirements.txt` file with these dependencies.

2.  **`gemini_rag_cli.py` Structure:**
    *   Create a new Python file: `/path/to/your/gemini_rag_cli.py`.
    *   Add basic argument parsing using `argparse` for commands like `ingest` and `query`.
    *   Initialize Gemini API client and ChromaDB client within the script.

3.  **File Reading & Basic Chunking:**
    *   Implement a function `read_and_chunk_file(file_path)`:
        *   Reads the content of a given `file_path`.
        *   Uses `RecursiveCharacterTextSplitter` from `langchain` (or a similar simple text splitter) to break the file content into fixed-size chunks (e.g., 500 characters with 100 characters overlap).
        *   For each chunk, create a dictionary containing `{'content': chunk_text, 'metadata': {'file_path': file_path, 'chunk_id': unique_id}}`.

4.  **Embedding Generation:**
    *   Implement a function `generate_embedding(text)`:
        *   Takes a string `text`.
        *   Calls `genai.embed_content(model="models/text-embedding-004", content=text)` to get the embedding vector.
        *   Handles potential API errors or rate limits (basic `try-except`).

5.  **Vector Database (ChromaDB) Integration:**
    *   Implement a function `initialize_vector_db()`:
        *   Initializes a ChromaDB client (e.g., `chromadb.PersistentClient(path="/path/to/your/chroma_db")`).
        *   Gets or creates a ChromaDB collection (e.g., `db.get_or_create_collection(name="codebase_memory")`).
    *   Implement a function `add_chunks_to_db(chunks)`:
        *   Takes a list of chunk dictionaries (from step 3).
        *   For each chunk, generates its embedding (using step 4).
        *   Adds the chunk content, embedding, and metadata to the ChromaDB collection.

6.  **Ingestion Command (`ingest`):**
    *   Implement the `ingest` command logic in `gemini_rag_cli.py`:
        *   Takes a `--project-root` argument.
        *   Recursively walks through the `project-root` directory.
        *   Filters files based on simple extensions (e.g., `.tsx`, `.astro`, `.json`, `.md`, `.ts`, `.js`, `.scss`).
        *   For each relevant file:
            *   Calls `read_and_chunk_file`.
            *   Calls `add_chunks_to_db`.
        *   Prints progress and completion messages.

7.  **Basic Query & Retrieval:**
    *   Implement a function `retrieve_context(query_text, top_k=5)`:
        *   Generates an embedding for `query_text`.
        *   Performs a similarity search on the ChromaDB collection using `collection.query(query_embeddings=[query_embedding], n_results=top_k)`.
        *   Returns the content and metadata of the top `top_k` retrieved chunks.

8.  **Context Assembly for Gemini Prompt:**
    *   Implement a function `construct_gemini_prompt(user_query, retrieved_context)`:
        *   Takes the `user_query` and the list of `retrieved_context` chunks.
        *   Formats the prompt clearly, e.g.:
            ```
            User Query: {user_query}

            Relevant Project Context:
            --- File: {file_path} ---
            {chunk_content}
            ---

            Based on the provided context and your general knowledge, please respond to the user query.
            ```

9.  **Query Command (`query`):**
    *   Implement the `query` command logic in `gemini_rag_cli.py`:
        *   Takes a `--query` argument.
        *   Calls `retrieve_context` to get relevant chunks.
        *   Calls `construct_gemini_prompt`.
        *   Sends the augmented prompt to `genai.GenerativeModel('gemini-1.5-flash').generate_content()`.
        *   Prints Gemini's response.

---

### Phase 2: Claude Integration & Basic Workflows

**Goal:** Integrate the MVP RAG system with Claude's command structure and test basic end-to-end workflows.

**Estimated Time:** 0.5-1 day

**Tasks:**

1.  **Update `.claude/commands/gemini-context.md`:**
    *   Modify the file to call the `ingest` command of your `gemini_rag_cli.py` script.
    *   Example:
        ```markdown
        ---
        description: Ingest entire project into a vector database for Gemini's project-wide analysis
        allowed-tools: [bash]
        ---
        # Project Context Ingester
        ! python /path/to/your/gemini_rag_cli.py ingest --project-root .
        ```

2.  **Update `.claude/commands/gemini.md`:**
    *   Modify the file to call the `query` command of your `gemini_rag_cli.py` script.
    *   Example:
        ```markdown
        ---
        description: Query Gemini's project knowledge for specific analysis via RAG
        allowed-tools: [bash]
        ---
        # Project Query
        ! python /path/to/your/gemini_rag_cli.py query --query "$ARGUMENTS"
        ```

3.  **Create/Update Workflow Commands (`debug`, `review`, `architect`):**
    *   Create new files or update existing ones in `.claude/commands/`.
    *   Each command will call `gemini_rag_cli.py query` with a pre-defined prefix for the query, followed by `$ARGUMENTS`.
    *   Example for `.claude/commands/debug.md`:
        ```markdown
        ---
        description: Comprehensive debugging using project-wide context via RAG
        allowed-tools: [bash]
        ---
        # Debug Assistant
        ! python /path/to/your/gemini_rag_cli.py query --query "DEBUG ANALYSIS for BS Display project: $ARGUMENTS"
        ```
    *   Similarly for `review.md` and `architect.md`, adjusting the query prefix.

4.  **End-to-End Testing:**
    *   Run the `gemini-context` command to ingest a small test project.
    *   Execute each of the new Claude commands (`gemini`, `debug`, `review`, `architect`) with sample queries.
    *   Verify that the `gemini_rag_cli.py` script is executed, context is retrieved, and Gemini provides a relevant response.

---

### Phase 3: Basic Maintenance & Refinement

**Goal:** Add essential features for usability and initial stability of the MVP.

**Estimated Time:** 0.5-1 day

**Tasks:**

1.  **Simple Update Command (`update`):**
    *   Add an `update` command to `gemini_rag_cli.py`.
    *   For the MVP, this command will simply re-ingest the entire project (clear the ChromaDB collection and re-add all chunks). This is a temporary solution until incremental updates are implemented in a later phase.
    *   Create/Update `.claude/commands/gemini-update.md` to call this command.

2.  **Basic Logging:**
    *   Add `print()` statements or use Python's `logging` module in `gemini_rag_cli.py` to show:
        *   Start/end of ingestion.
        *   Number of files processed.
        *   Number of chunks created.
        *   Query received.
        *   Number of chunks retrieved.
        *   Any errors encountered.

3.  **Refine Prompt Templates:**
    *   Review the `construct_gemini_prompt` function.
    *   Experiment with different ways to present the `retrieved_context` to Gemini to maximize relevance and minimize confusion. Ensure clear separation between user query and context.

4.  **Basic Error Handling:**
    *   Add `try-except` blocks around API calls (Gemini, ChromaDB) and file operations in `gemini_rag_cli.py` to catch common exceptions and provide user-friendly error messages instead of crashing.

5.  **MVP Usage Documentation:**
    *   Create a `README.md` within the `orchestrator/` directory (or a new `rag/` directory if preferred) that explains:
        *   How to set up the Python environment and dependencies.
        *   How to run the `gemini_rag_cli.py` script directly.
        *   How to use the new Claude commands.
        *   Limitations of the MVP.
