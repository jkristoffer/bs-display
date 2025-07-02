# AI-First Implementation Plan: The Forge Orchestrator

**Objective:** To rebuild the project orchestrator, "The Forge," following an AI-First development methodology. This plan is designed to be executed by an AI assistant, ensuring each step is discrete, verifiable, and compliant with project standards as defined in `CLAUDE.md`.

**Guiding Principles (from `CLAUDE.md`):**
- **Functional Programming:** Emphasize pure functions, immutability, and composition.
- **Type Safety:** All code must include comprehensive type hints.
- **Verification First:** Each piece of functionality must be accompanied by unit tests.
- **Incremental Implementation:** Build and verify components in small, manageable steps.
- **Automated Quality Checks:** All generated code must be validated by the project's linter and code review agent.

---

### **Phase 1: Project Initialization & Core Foundation**

**Goal:** Establish the project structure, dependencies, and core data models that will form the foundation of the application.

**Task 1.1: Create Directory Structure**
1.  **Sub-task:** Create the required directory structure for the new application within the `dev/` directory. The new project will be named `forge`.
    -   `dev/forge/app/services`
    -   `dev/forge/app/tools`
    -   `dev/forge/app/models`
    -   `dev/forge/tests`

**Task 1.2: Initialize Python Project**
1.  **Sub-task:** Create a `pyproject.toml` file in `dev/forge/` to define the project and its dependencies. Initially, it will include `typer`, `pydantic`, and `pytest`.
2.  **Sub-task:** Create the main application entry point at `dev/forge/app/main.py`. It should contain a basic "Hello World" function using `Typer` to confirm the setup.
3.  **VERIFICATION:** Run the `main.py` script directly to confirm that the Typer CLI responds.

**Task 1.3: Define Core Data Models**
1.  **Sub-task:** Create a new file `dev/forge/app/models/core.py`.
2.  **Sub-task:** In `core.py`, define the primary data structures using `Pydantic`. These models are critical for ensuring type safety and structured data flow between components.
    -   `Tool(BaseModel)`: `name: str`, `description: str`
    -   `Action(BaseModel)`: `tool_name: str`, `tool_input: dict`
    -   `Plan(BaseModel)`: `goal: str`, `actions: list[Action]`
3.  **VERIFICATION:** Create `dev/forge/tests/test_models.py`. Add a unit test that instantiates each model with sample data to ensure they are correctly defined.

---

### **Phase 2: The Workspace Scanner (The "Senses")**

**Goal:** Develop the service responsible for reading and understanding the state of the user's codebase.

**Task 2.1: Implement File System Utilities**
1.  **Sub-task:** Create the service file `dev/forge/app/services/workspace_scanner.py`.
2.  **Sub-task:** Implement a pure function `find_files_by_glob(pattern: str) -> list[str]` within the scanner. This function will be the primary mechanism for discovering files.
3.  **VERIFICATION:** Create `dev/forge/tests/test_workspace_scanner.py`. Add a test for `find_files_by_glob` that uses a temporary directory and confirms that files are found correctly.

**Task 2.2: Implement Code Analysis**
1.  **AI NOTE:** Before implementing, the AI assistant must read an example component (e.g., `dev/src/components/common/Button/Button.tsx`) to understand the target code structure.
2.  **Sub-task:** In `workspace_scanner.py`, implement a pure function `get_component_props(file_content: str) -> dict`. This function will use regular expressions to extract the `interface Props` from a component file.
3.  **VERIFICATION:** Add a unit test to `test_workspace_scanner.py` that passes a sample component string to `get_component_props` and asserts that the returned dictionary of props is correct.

---

### **Phase 3: The Planner (The "Brain")**

**Goal:** Implement the core reasoning engine that translates a user's goal into an executable plan.

**Task 3.1: Create the Planner Service**
1.  **Sub-task:** Create the service file `dev/forge/app/services/planner.py`.
2.  **Sub-task:** Implement the main function `generate_plan(goal: str, context: dict) -> Plan`. Initially, this function will construct a detailed prompt for the LLM.
3.  **AI NOTE:** The prompt must be constructed dynamically using the `goal` and `context`. Refer to the "meta-prompt" structure in `ORCHESTRATOR_REBUILD_PLAN.md`. The prompt should instruct the LLM to return a JSON object that conforms to the `Plan` Pydantic model.

**Task 3.2: Integrate with the LLM**
1.  **Sub-task:** Within `generate_plan`, use the `subprocess` module to call the `claude` CLI. This leverages the existing, proven method of AI interaction.
2.  **Sub-task:** The output from the `claude` CLI (a JSON string) must be parsed and validated using the `Plan.parse_raw()` method from Pydantic. This ensures the AI's output is structured correctly.
3.  **VERIFICATION:** Create `dev/forge/tests/test_planner.py`. Write a mock test that asserts the `claude` command is called with the expected prompt structure and that the planner correctly parses a sample JSON response.

---

### **Phase 4: The Executor & Toolbelt (The "Hands")**

**Goal:** Build the components responsible for executing the plan and interacting with the file system.

**Task 4.1: Implement the Toolbelt**
1.  **Sub-task:** Create `dev/forge/app/tools/base.py` and define an abstract base class `BaseTool` with an `execute` method.
2.  **Sub-task:** Create `dev/forge/app/tools/file_system.py`. Implement a `WriteFileTool(BaseTool)` that takes a `file_path` and `content` and writes to the disk.
3.  **AI NOTE:** Per `CLAUDE.md`, tools must be self-contained, have no side effects beyond their stated purpose, and have clear, descriptive names.

**Task 4.2: Implement the Executor Service**
1.  **Sub-task:** Create `dev/forge/app/services/executor.py`.
2.  **Sub-task:** Implement the function `execute_plan(plan: Plan)`. This function will iterate through the `plan.actions`, find the corresponding tool in the toolbelt, and call its `execute` method.
3.  **VERIFICATION:** Create `dev/forge/tests/test_executor.py`. Write a test that provides a sample `Plan` and asserts that the correct tool methods are called with the correct inputs.

---

### **Phase 5: Final Integration & End-to-End Test**

**Goal:** Wire all services together into a functioning application and perform an end-to-end verification.

**Task 5.1: Integrate Services in the CLI**
1.  **Sub-task:** In `dev/forge/app/main.py`, update the main CLI function to accept a `--goal` argument.
2.  **Sub-task:** The function will orchestrate the full workflow: `CLI Input -> Workspace Scanner -> Planner -> Executor -> Output`.

**Task 5.2: End-to-End Verification**
1.  **Sub-task:** Execute the CLI with a simple goal: `forge --goal "Create a file named hello.txt with the content Hello World"`.
2.  **VERIFICATION:** Confirm that the `hello.txt` file is created with the correct content.
3.  **Sub-task:** Run the project's code review agent on the entire `dev/forge` directory to ensure all new code meets quality standards.
    -   `node dev/scripts/code-review-agent.js --file dev/forge/`
