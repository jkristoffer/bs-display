# Orchestrator Rebuild Plan: "The Forge"

This document outlines a strategic proposal for rebuilding the AI orchestrator from scratch. The goal is to evolve the system from a procedural **Task Runner** into a stateful, context-aware **Development Partner**.

---

### **The Premise: Why Rebuild?**

The current orchestrator is a powerful script but is fundamentally limited by its template-driven architecture. A rebuild allows us to design for an ideal future state, embracing the following core principles from day one:

*   **Context-First, Not Template-First:** The system's primary job is to understand the *current state of the codebase*, not to find a matching template.
*   **Stateful and Conversational:** The tool should remember the history of an interaction, allowing for clarification, refinement, and multi-step operations.
*   **Multi-Agent by Design:** The architecture should treat different models (Claude, Gemini, etc.) and tools (linters, test runners) as interchangeable resources to be allocated by a central planner.
*   **Extensible Tooling:** The system should be built on a plugin architecture, making it easy to add new capabilities (tools, code analysis techniques, etc.) without modifying the core.

---

### **Proposed Architecture: "The Forge"**

The new system, "The Forge," will be a modular Python application with a service-oriented architecture.

**Core Components:**

1.  **The Core Application (CLI):**
    *   **Function:** The main entry point for the user.
    *   **Technology:** Built with a modern CLI framework like `Typer` or `Click`.
    *   **Features:** Manages user sessions, handles input/output, and orchestrates the other components.

2.  **The State Manager:**
    *   **Function:** Maintains the state of the current "forging session." It tracks the user's goal, the generated plan, modified files, and conversation history.
    *   **Technology:** Could be a simple session-based JSON file or a more robust embedded database like SQLite for persistent memory.

3.  **The Workspace Scanner (The "Context Engine"):**
    *   **Function:** The "eyes and ears" of The Forge. Responsible for reading and understanding the codebase.
    *   **Technology:** Uses `glob`, Abstract Syntax Tree (AST) parsing (e.g., `tree-sitter`), and regex for code analysis.
    *   **Features:** Can identify project structure, find relevant files, extract function signatures, and understand dependencies.

4.  **The Planner (The "Reasoning Engine"):**
    *   **Function:** The "brain" of The Forge. Takes the user's goal and context from the Workspace Scanner to create a step-by-step execution plan.
    *   **Technology:** A primary interface to LLMs, likely using a framework like `LangChain` or `LlamaIndex` to dynamically build "meta-prompts" and parse AI output.
    *   **Features:** Generates a `Plan` object—a structured list of actions (e.g., `ReadFile`, `WriteFile`, `RunCommand`, `AskUser`).

5.  **The Executor:**
    *   **Function:** The "hands" of The Forge. Takes the `Plan` from the Planner and executes each step.
    *   **Technology:** A robust wrapper around `subprocess` and file I/O operations.
    *   **Features:** Executes commands, reads/writes files, and reports success or failure back to the State Manager.

6.  **The Toolbelt:**
    *   **Function:** A registry of available tools that the Planner can incorporate into its plans.
    *   **Technology:** A plugin architecture where each tool is a class with a `name`, `description`, and `execute` method.
    *   **Features:** Includes built-in tools for file operations, shell commands, and web searches. Easily extensible with custom tools like linters or test runners.

---

### **Ideal User Experience: A Conversational Workflow**

The interaction should feel less like running a command and more like delegating a task to a junior developer who asks clarifying questions.

**Example Session:**

1.  **User Initiates a Goal:**
    ```bash
    forge start "Create a new page to display our company's team members. It should fetch data from our internal /api/team endpoint."
    ```

2.  **The Forge Scans and Plans:**
    *   The Forge starts a new session.
    *   The **Workspace Scanner** identifies project conventions (e.g., pages are `.astro` files, data fetching is in `src/utils/api.ts`).
    *   The **Planner** generates a plan but identifies an ambiguity: how to display the team members.

3.  **The Forge Asks for Clarification:**
    ```
    > Plan generated.
    > I will create a new page at 'src/pages/team.astro' and add a fetching function to 'src/utils/api.ts'.
    >
    > Question: How should the team members be displayed on the page?
    > 1: A simple list of names.
    > 2: A grid of profile cards (requires a new 'ProfileCard' component).
    > Please select an option [1/2]:
    ```

4.  **User Provides Input:**
    ```
    2
    ```

5.  **The Forge Refines the Plan:**
    *   The Planner updates the plan to include a new step: "Create a new React component named `ProfileCard.tsx` in `src/components/common/`."

6.  **User Approves and The Forge Executes:**
    ```
    > Plan updated. I will now create the ProfileCard component and the team page.
    > Proceed? [Y/n]: y

    > [Executing] Writing file: src/components/common/ProfileCard.tsx... DONE
    > [Executing] Writing file: src/utils/api.ts... DONE
    > [Executing] Writing file: src/pages/team.astro... DONE
    > [Executing] Running linter... DONE
    >
    > ✨ Forging complete.
    > The following files have been created or modified:
    > - src/components/common/ProfileCard.tsx
    > - src/utils/api.ts
    > - src/pages/team.astro
    >
    > Would you like me to stage these changes for a commit? [Y/n]:
    ```

---

### **Implementation Roadmap**

1.  **Phase 1: The Foundation.**
    *   Set up the project with `Typer` and `Pydantic`.
    *   Build the Core Application CLI structure.
    *   Implement the State Manager with simple JSON session files.
    *   Build a basic Executor with `WriteFile` and `RunCommand` capabilities.

2.  **Phase 2: The Senses.**
    *   Build the Workspace Scanner. Start with file-finding (`glob`) and simple regex.
    *   Add AST parsing for one language (e.g., TypeScript) to extract component props.

3.  **Phase 3: The Brain.**
    *   Build the Planner. Integrate with an LLM (e.g., via `LangChain`).
    *   Create the `Plan` data structure using `Pydantic`.
    *   Implement the first version of the dynamic "meta-prompt" builder.

4.  **Phase 4: The Hands and Tools.**
    *   Build out the Toolbelt architecture.
    *   Add more tools: a web search tool, a linter tool, a test runner tool.
    *   Refine the conversational loop (clarification, approval).

---

### **Risks and Trade-offs**

*   **Initial Velocity:** A rebuild is a significant undertaking and will be slower initially than iterating on the existing script.
*   **Complexity:** This architecture is more complex than a single script. It requires more careful design and testing.
*   **Over-engineering:** There's a risk of building a system that is too complex for the project's actual needs. The key is to build each component to be "just good enough" at each phase.
