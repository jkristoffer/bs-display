# Implementation Plan: From Template-Based Orchestrator to Autonomous Planner

This document outlines a phased approach to evolve the existing `run.py` orchestrator. The goal is to transition from a system requiring predefined templates to a dynamic planner that understands high-level goals, gathers its own context from the codebase, and generates bespoke instructions for the AI.

---

### **Phase 1: The Hybrid Model - Introducing a "Goal-Oriented" Mode**

**Goal:** Augment the current orchestrator with a new, experimental mode that accepts high-level goals, running alongside the existing, reliable template-based mode.

**Steps:**

1.  **Modify CLI:** In `run.py`, add a new command-line argument: `--goal "Your high-level objective"`. This will be mutually exclusive with `--task` and `--workflow`.
2.  **Create a Generic "Planner" Prompt:** Create a new, single template in the `templates/` directory called `system/autonomous-planner.md`. This prompt will be very different. It will instruct the AI to act as a planner, taking a user's goal and breaking it down into the specific file creations and modifications needed.
3.  **Implement the Initial Goal Logic:** When `run.py` is called with `--goal`, it will:
    *   Render the `system/autonomous-planner.md` template, inserting the user's goal string.
    *   Execute Claude with this prompt.
    *   The *expected output* from Claude will not be code, but a structured plan (e.g., in JSON or YAML) that describes the files to be created, which can then be fed back into the existing task execution engine.

**Insight:** This phase provides a low-risk entry point into autonomous execution. It doesn't break any existing workflows. We are using the AI for the *planning* step first, which is its core strength. This immediately makes the tool more flexible, as it can now attempt tasks for which no template exists.

---

### **Phase 2: The Context Engine - Teaching the Orchestrator to Read**

**Goal:** Build a dedicated module that can analyze the existing codebase to gather context, which will be used to inform the planner.

**Steps:**

1.  **Create `context_engine.py`:** This new Python module will contain functions for codebase analysis. It will have no dependency on the AI itself.
2.  **Implement File-Finding Functions:**
    *   `find_relevant_files(keywords: list[str]) -> list[path]`: Uses `glob` and keyword matching to find potentially relevant files. For a goal like "create a FAQ page," it would search for `*page*.astro`, `faq.*`, etc.
    *   `find_component(component_name: str) -> path`: Locates a specific component file.
3.  **Implement Code-Analysis Functions:**
    *   `get_component_props(file_path: path) -> dict`: Uses regular expressions (or for more robustness, a lightweight TSX parser) to extract the `interface Props` from a React/Astro component, returning a dictionary of prop names and types.
    *   `extract_file_structure(file_path: path) -> dict`: Extracts key information like imports, exports, and the basic HTML/component structure from an Astro file.

**Insight:** This is the most critical phase. An AI's ability to generate high-quality, project-compliant code is directly proportional to the quality of the context it's given. This engine acts as the orchestrator's "eyes and ears," allowing it to understand the project's conventions and structure *before* it even talks to the AI. This module is the heart of the autonomous capability.

---

### **Phase 3: The Autonomous Planner - Dynamic Prompt Generation**

**Goal:** Replace the static planner from Phase 1 with a dynamic planner that uses the Context Engine to build rich, "few-shot" prompts for the AI.

**Steps:**

1.  **Create `prompt_builder.py`:** This module will be responsible for assembling the final prompt sent to the AI.
2.  **Develop the `build_meta_prompt` function:** This function will take the user's goal and the context from the `ContextEngine` and construct a detailed prompt. The structure will be:
    *   **Role Instruction:** "You are an expert software developer..."
    *   **Positive Examples ("Few-Shots"):** It will inject the content of 1-2 relevant files found by the `ContextEngine`. For creating a page, it would include the source of `contact.astro` as an example of a good page.
    *   **Component Signatures:** It will include the extracted props of any components mentioned in the goal (e.g., "Here is the signature for the Accordion component you must use...").
    *   **The Final Task:** A clear, specific instruction based on the user's goal (e.g., "Now, create a new file at `src/pages/faq.astro` that follows these examples...").
3.  **Integrate into `run.py`:** The `--goal` logic will now call the `ContextEngine` and the `PromptBuilder` before executing the AI. The AI is now expected to return the final code directly, not a plan.

**Insight:** This phase moves beyond simple prompting to a technique called "in-context learning" or "few-shot prompting." By showing the AI examples of *what we want*, we dramatically increase the probability that its output will be correct and follow our project's conventions, all without needing a rigid template.

---

### **The Ideal Outcome: How the System Should Work**

The final system should feel like a true collaborator. The developer provides a high-level goal, and the orchestrator handles the research, planning, and code generation, producing a result that is consistent with the existing codebase.

#### **Example Workflow**

**1. User Input (The Goal)**

The developer issues a simple, high-level command:

```bash
./run.py --goal "Create a new FAQ page that uses the Accordion component to display questions and answers."
```

**2. The Orchestrator's Thinking Process (Autonomous Planning)**

The orchestrator, without any specific template for "FAQ page," performs the following steps internally:

1.  **Parse Goal:** Identifies key entities: `create page`, `FAQ`, `use component`, `Accordion`.
2.  **Analyze Intent:** Determines the primary task is to create a new `.astro` file in `src/pages/`.
3.  **Gather Context - Components:**
    *   Calls `context_engine.find_component('Accordion')`.
    *   Finds `/Users/kristoffersanio/git/bs-display/dev/src/components/common/Accordion/Accordion.tsx`.
    *   Calls `context_engine.get_component_props()` on the file and extracts: `{ question: 'string', answer: 'string' }`.
4.  **Gather Context - Pages (for examples):**
    *   Calls `context_engine.find_relevant_files(['page', '.astro'])`.
    *   Finds `contact.astro` and `terms-and-conditions.astro`. It selects `contact.astro` as a simple, clean example.
    *   Reads the content of `contact.astro` to use as a "few-shot" example.
5.  **Build the Meta-Prompt:** It calls `prompt_builder.build_meta_prompt()` which assembles a detailed instruction for the AI.

**3. Final Output (The Generated Code)**

The AI, having received this rich, context-aware prompt, returns the final code, which the orchestrator saves directly to `/Users/kristoffersanio/git/bs-display/dev/src/pages/faq.astro`.
