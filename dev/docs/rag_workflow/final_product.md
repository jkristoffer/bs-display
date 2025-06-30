# Multi-AI Workflow with RAG-Powered Project Memory

### Overview

This document outlines a revolutionary multi-AI development workflow that leverages Gemini as a "project memory system" through Retrieval-Augmented Generation (RAG), while maintaining Claude Code as the primary development interface. This approach transforms debugging, code review, and architectural decisions from context-limited operations into comprehensive, project-aware analyses, overcoming the inherent statelessness of LLM APIs.

### Core Concept: RAG-Powered Project Memory

The core of this workflow is a sophisticated RAG system that provides Gemini with a persistent, searchable understanding of the entire codebase.

1.  **Project Memory (Vector Database):**
    *   **Ingestion:** The entire codebase (source files, documentation, configuration, etc.) is systematically read, parsed, and broken down into semantically meaningful "chunks" (e.g., individual functions, classes, markdown sections, configuration blocks).
    *   **Embedding:** Each chunk is then converted into a high-dimensional numerical representation called an "embedding" using a specialized embedding model (e.g., Gemini's `text-embedding-004`).
    *   **Storage:** These embeddings, along with their associated metadata (file path, line numbers, original content), are stored in a dedicated **vector database**. This database acts as the project's long-term, searchable memory.

2.  **Intelligent Retrieval (RAG):**
    *   When a user (via Claude) poses a question or task requiring project context, their query is also converted into an embedding.
    *   This query embedding is used to perform a "similarity search" within the vector database. The system efficiently identifies and retrieves the most relevant code snippets, documentation, or configuration details from the project's memory.

3.  **Augmented Prompts:**
    *   The retrieved, highly relevant context (code, docs, etc.) is then dynamically combined with the user's original query.
    *   This "augmented prompt" is sent to the Gemini API. Gemini, with its large context window, can then process the user's request with a deep, project-specific understanding, leading to more accurate and insightful responses.

4.  **Claude as Orchestrator:**
    *   Claude serves as the intelligent interface. Through custom slash commands, Claude automatically recognizes when a user's request requires project-wide context.
    *   It then orchestrates the interaction with the RAG system, triggering the retrieval process and forwarding the augmented prompt to Gemini. Claude then presents Gemini's comprehensive response to the user.

### Workflow Examples

#### Debugging Workflow

*   **User:** "Images are 404ing on product pages."
*   **Claude Code Process:**
    1.  Recognizes this is a debugging request requiring project-wide analysis.
    2.  Automatically triggers the RAG system with the query "DEBUG ANALYSIS for BS Display project: images 404 product pages."
    3.  **RAG System:** Retrieves relevant code snippets related to image handling, product data structures, routing, and error logging from the vector database.
    4.  **Gemini:** Receives the augmented prompt (query + retrieved context) and analyzes it.
    5.  **Result:** Gemini provides a detailed analysis, including all potentially related files, common patterns in similar functionality, dependencies to check, specific line numbers, cross-component relationships, data flow analysis, and likely root causes based on project patterns. Claude presents this as actionable investigation steps.

#### Code Review Workflow

*   **User:** "Review this ProductCard component for functional programming standards."
*   **Claude Code Process:**
    1.  Recognizes this is a code review request.
    2.  Triggers the RAG system with the query "CODE REVIEW for BS Display project: ProductCard component functional programming standards."
    3.  **RAG System:** Retrieves the `ProductCard` component's code, relevant sections from `CLAUDE.md` (functional programming standards), and code from similar components in the project.
    4.  **Gemini:** Analyzes the `ProductCard` against the provided standards and existing project patterns.
    5.  **Result:** Gemini identifies patterns, inconsistencies, and improvement opportunities, providing specific, project-aware recommendations with file examples and suggested improvements.

#### Architecture Decision Workflow

*   **User:** "How should I implement the new filter feature?"
*   **Claude Code Process:**
    1.  Recognizes this is an architectural decision request.
    2.  Triggers the RAG system with the query "ARCHITECTURE ANALYSIS for BS Display project: new filter feature implementation."
    3.  **RAG System:** Retrieves existing filtering patterns, data flow related to filtering, relevant component architectures, and state management patterns from the vector database.
    4.  **Gemini:** Analyzes the query considering the retrieved architectural context.
    5.  **Result:** Gemini recommends an approach that integrates seamlessly with current systems, aligns with established patterns, and considers dependencies and performance implications for the entire system.

### Expected Outcomes

*   **Development Velocity:** Significantly faster debugging, comprehensive code reviews, and informed architectural decisions due to instant access to project-wide context.
*   **Code Quality:** Consistent patterns, reduced technical debt, and better integration of new features, as all decisions are informed by the established project architecture.
*   **Developer Experience:** Reduced context switching, enhanced confidence in decisions, and faster onboarding for new team members.
