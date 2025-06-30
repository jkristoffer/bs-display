# AI-First MVP Implementation Plan: The Forge Orchestrator

**Objective:** To deliver a Minimum Viable Product (MVP) for "The Forge" orchestrator, focusing on core functionality and rapid iteration. This plan is designed for AI execution, ensuring each step is discrete, verifiable, and compliant with project standards as defined in `CLAUDE.md`.

**Guiding Principles (from `CLAUDE.md`):**
- **Functional Programming:** Emphasize pure functions, immutability, and composition.
- **Type Safety:** All code must include comprehensive type hints.
- **Verification First:** Each piece of functionality must be accompanied by unit tests (where applicable for MVP).
- **Incremental Implementation:** Build and verify components in small, manageable steps.
- **Automated Quality Checks:** All generated code must be validated by the project's linter and code review agent.

---

### **Phase 1: Working Prototype (2-4 hours)**

**Goal:** Establish a basic command-line interface that can call Claude and write the AI's response directly to a file.

**Task 1.1: Create `forge.py` and Basic CLI**
1.  **Sub-task:** Create a single Python file `dev/forge/forge.py`.
2.  **Sub-task:** Implement a basic `Typer` CLI in `forge.py` that accepts a `--prompt` argument (the text prompt for Claude) and a `--output-file` argument (the path to save Claude's output).
3.  **Sub-task:** Within the CLI function, hardcode a simple prompt template that wraps the user's `--prompt` (e.g., "Generate content for a file based on this description: {user_prompt}").
4.  **Sub-task:** Use `subprocess` to call the `claude` CLI with the hardcoded prompt. Capture `stdout`.
5.  **Sub-task:** Write the captured `stdout` directly to the file specified by `--output-file`.
6.  **VERIFICATION:** Run `python dev/forge/forge.py --prompt "A simple text file with 'Hello MVP'" --output-file dev/forge/hello_mvp.txt`. Confirm `hello_mvp.txt` is created with Claude's response.

**Success Criteria:** The system can take a text prompt, send it to Claude, and save Claude's raw text output to a specified file.

---

### **Phase 2: Structure & Reliability (2-3 hours)**

**Goal:** Introduce basic data structuring, error handling, and logging to make the prototype more robust.

**Task 2.1: Add Pydantic Models for Request/Response**
1.  **Sub-task:** In `dev/forge/forge.py`, define a `Pydantic` `BaseModel` for the input prompt (e.g., `PromptRequest(BaseModel): text: str`) and for Claude's expected output (e.g., `ClaudeResponse(BaseModel): content: str`).
2.  **Sub-task:** Modify the CLI function to parse the `--prompt` into a `PromptRequest` object and attempt to parse Claude's raw output into a `ClaudeResponse` object. (Initially, `ClaudeResponse` might just wrap the raw text).
3.  **VERIFICATION:** Add a simple test case that attempts to pass an invalid prompt format (if `PromptRequest` has validation) or an unexpected Claude response, and confirm `Pydantic` raises an error.

**Task 2.2: Implement Basic Error Handling**
1.  **Sub-task:** Wrap the `subprocess.run` call in a `try-except` block to catch `subprocess.CalledProcessError` for Claude CLI failures.
2.  **Sub-task:** Implement graceful error messages for the user if Claude fails or returns an unexpected format.
3.  **VERIFICATION:** Intentionally cause a Claude failure (e.g., by providing a malformed prompt that causes Claude to error out, or by temporarily renaming the `claude` executable) and confirm the error is caught and a user-friendly message is displayed.

**Task 2.3: Add Simple Logging**
1.  **Sub-task:** Implement a basic logging mechanism (e.g., using Python's `logging` module) to record CLI calls, Claude interactions, and any errors to a file (e.g., `dev/forge/forge.log`).
2.  **VERIFICATION:** Run a successful command and an erroneous command, then check the `forge.log` file for appropriate entries.

**Success Criteria:** The system handles errors gracefully, provides consistent output formatting, and logs its operations.

---

### **Phase 2A: Immediate Fixes (1-2 hours)**

**Goal:** Address critical usability issues related to Claude's output and improve prompt effectiveness for cleaner results.

**Task 2A.1: Output Parsing (Critical)**
1.  **Sub-task:** Modify the `call_claude` function in `dev/forge/forge.py` to strip markdown code blocks (e.g., ````python`, ````javascript`, ````text`, etc.) from Claude's response. This should extract only the content within the code block. If no code block is found, assume the entire response is the content.
2.  **Sub-task:** Ensure any leading/trailing whitespace is cleaned from the extracted content before it's returned.
3.  **VERIFICATION:** Run `python dev/forge/forge.py --prompt "A simple Python function to add two numbers, wrapped in a markdown code block." --output-file dev/forge/test_output_parsing.py`. Manually inspect `test_output_parsing.py` to confirm only the Python code (without markdown fences) is present.

**Task 2A.2: Prompt Enhancement**
1.  **Sub-task:** Refine the hardcoded prompt template in `call_claude` to explicitly request clean output and provide file-type specific instructions. For example, if the `--output-file` ends with `.py`, the prompt could suggest Python code. (For MVP, this can be a simple check on the output file extension).
2.  **Sub-task:** Add instructions to the prompt to avoid conversational filler or explanations, requesting only the raw content.
3.  **VERIFICATION:** Run `python dev/forge/forge.py --prompt "A simple HTML page with a title 'My Page'" --output-file dev/forge/my_page.html`. Manually inspect `my_page.html` to ensure it contains only the HTML and no extra text or markdown.

**Success Criteria:** Claude's output is consistently clean and free of markdown fences or conversational text, making the generated files directly usable.

---

### **Phase 3: MVP Validation (1-2 hours)**

**Goal:** Validate the MVP's reliability for basic file operations and document its current state and limitations.

**Task 3.1: Test with File Creation Scenarios**
1.  **Sub-task:** Execute `forge.py` for 3-5 different basic file creation scenarios (e.g., a Python script, a Markdown file, a JSON configuration file).
    -   `python dev/forge/forge.py --prompt "A Python function to add two numbers" --output-file dev/forge/add_numbers.py`
    -   `python dev/forge/forge.py --prompt "A Markdown file explaining the MVP" --output-file dev/forge/mvp_explanation.md`
    -   `python dev/forge/forge.py --prompt "A JSON file with user settings: name=John, age=30" --output-file dev/forge/user_settings.json`
2.  **VERIFICATION:** Manually inspect the created files to ensure they contain relevant content from Claude.

**Task 3.2: Run Code Review Agent**
1.  **Sub-task:** Execute the project's code review agent on the `dev/forge/forge.py` file and any generated code files (e.g., `add_numbers.py`).
    -   `node dev/scripts/code-review-agent.js --file dev/forge/forge.py`
    -   `node dev/scripts/code-review-agent.js --file dev/forge/add_numbers.py`
2.  **VERIFICATION:** Review the output of the code review agent to identify any immediate quality issues or deviations from project standards in the generated code.

**Task 3.3: Document Limitations and Next Steps**
1.  **Sub-task:** Create a new Markdown file `dev/docs/FORGE_MVP_STATUS.md`.
2.  **Sub-task:** Document the current capabilities of the MVP, its known limitations (e.g., no context awareness, no multi-file generation, no structured output parsing), and propose the immediate next steps for post-MVP development.

**Success Criteria:** The MVP is proven reliable for basic file operations, its code quality is assessed, and its status is clearly documented.

---

### **Phase 4: Initial Context Awareness (The "Senses" MVP)**

**Goal:** Enable the Forge to read and understand basic project context.

**Task 4.1: Implement File System Utilities**
1.  **Sub-task:** In `dev/forge/forge.py`, implement a pure function `read_file_content(file_path: str) -> str` that reads and returns the content of a specified file.
2.  **Sub-task:** In `dev/forge/forge.py`, implement a pure function `list_directory_contents(directory_path: str) -> list[str]` that lists the names of files and subdirectories directly within a specified directory path.
3.  **VERIFICATION:** Add simple unit tests or manual checks to confirm `read_file_content` and `list_directory_contents` function correctly with existing files/directories.

**Task 4.2: Integrate Context Tools into Prompt**
1.  **Sub-task:** Modify the `call_claude` function's prompt template to inform Claude about the new capabilities. For example: "You have access to `read_file_content(file_path)` and `list_directory_contents(directory_path)` tools. If you need information from the codebase, use these tools by outputting a specific JSON format (e.g., `{"tool": "read_file_content", "file_path": "path/to/file"}`)."
2.  **Sub-task:** Implement a basic mechanism in `call_claude` to detect if Claude's response is a tool call. For this MVP, if a tool call is detected, simply log it and inform the user that tool execution is not yet automated.
3.  **VERIFICATION:** Run `python dev/forge/forge.py --prompt "Read the content of dev/forge/forge.py and summarize it." --output-file dev/forge/summary.txt`. Manually inspect the output to see if Claude attempts to use the `read_file_content` tool (even if not executed).

**Success Criteria:** The Forge can inform Claude about basic file system access tools, and Claude can express intent to use them.

---

### **Phase 5: Basic Autonomous Planning (The "Brain" MVP)**

**Goal:** Allow the Forge to generate a simple plan based on a high-level goal and limited context, and execute basic `write_file` actions from that plan.

**Task 5.1: Modify CLI for Goal-Oriented Input**
1.  **Sub-task:** In `dev/forge/forge.py`, add a new `Typer` command `plan_and_execute` that accepts a `--goal` argument (e.g., `forge plan-and-execute --goal "Create a simple text file named 'my_plan.txt' with the content 'This is my plan.'" --output-dir dev/forge/plans`).
2.  **Sub-task:** This command will replace the direct `--prompt` to Claude with a higher-level objective.

**Task 5.2: Implement Basic Planning Prompt**
1.  **Sub-task:** Within `plan_and_execute`, construct a "meta-prompt" for Claude. This prompt will instruct Claude to act as a planner and output a structured JSON plan.
    *   **Prompt Example:** "You are an AI planner. Your goal is: '{user_goal}'. Output a JSON array of actions. Each action must be `{"action": "write_file", "file_path": "path/to/file", "content": "file content"}`. Do not include any other text."
2.  **Sub-task:** Call Claude with this meta-prompt and parse the JSON response into a list of `Action` objects (define a `Pydantic` `Action` model for `write_file`).

**Task 5.3: Implement Plan Execution**
1.  **Sub-task:** Implement a new function `execute_actions(actions: list[Action])` that iterates through the parsed `Action` objects.
2.  **Sub-task:** For each `write_file` action, use the existing file writing logic to create the specified file with the given content.
3.  **VERIFICATION:** Run `python dev/forge/forge.py plan-and-execute --goal "Create a simple text file named 'my_plan.txt' with the content 'This is my plan.'" --output-dir dev/forge/plans`. Confirm `my_plan.txt` is created in the specified directory with the correct content.

**Success Criteria:** The Forge can take a high-level goal, use Claude to generate a simple plan (containing only `write_file` actions), and execute that plan.

---

### **Deferred for Post-MVP**

*   Complex workspace scanning and code analysis (AST parsing, dependency graphs).
*   Multi-tool architecture and dynamic tool selection (beyond basic `read_file`/`list_directory` notification).
*   Advanced planning algorithms and conversational workflows.
*   Comprehensive unit and integration test suites (beyond basic verification).
*   Structured output parsing (e.g., extracting multiple files from Claude's response - *already partially addressed in Phase 2A/2B of current MVP*).
*   State management and session persistence.
*   Integration with existing project structure and conventions (beyond basic file system access).
