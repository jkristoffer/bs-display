# Forge MVP Test Plan

**Objective:** To comprehensively test the implemented functionalities of the Forge MVP, covering all phases up to Phase 5 (Basic Autonomous Planning). This plan is designed for AI execution, with clear steps and verifiable outcomes.

**Location:** `dev/forge/`

---

## **Phase 0: Setup & Pre-requisites**

**Goal:** Ensure the testing environment is ready.

**Task 0.1: Install Dependencies**
1.  **Command:** `pip install -r /Users/kristoffersanio/git/bs-display/dev/forge/requirements.txt`
2.  **Verification:** Confirm successful installation of `typer`, `pydantic`, and `pytest`.

**Task 0.2: Ensure Claude CLI is Accessible**
1.  **Command:** `which claude`
2.  **Verification:** Confirm the path to the `claude` executable is displayed.

---

## **Phase 1: Working Prototype - Basic File Creation**

**Goal:** Verify the core functionality of creating a single file from a prompt.

**Task 1.1: Create a Simple Text File**
1.  **Command:** `python3 /Users/kristoffersanio/git/bs-display/dev/forge/forge.py create-file --prompt "A simple text file with the content 'Hello Forge MVP!'" --output-file /Users/kristoffersanio/git/bs-display/dev/forge/test_output/hello_forge.txt`
2.  **Verification:**
    *   Confirm `dev/forge/test_output/hello_forge.txt` exists.
    *   Read content: `cat /Users/kristoffersanio/git/bs-display/dev/forge/test_output/hello_forge.txt`
    *   Assert content is approximately "Hello Forge MVP!" (allowing for minor Claude variations).

---

## **Phase 2: Structure & Reliability - Error Handling & Logging**

**Goal:** Verify Pydantic validation, error handling, and logging.

**Task 2.1: Test Pydantic Validation (Implicit)**
1.  **Note:** Pydantic validation is primarily internal. We'll test its effect via error handling.

**Task 2.2: Test Claude CLI Failure Handling**
1.  **Pre-condition:** Temporarily rename the `claude` executable to simulate failure (e.g., `mv $(which claude) $(which claude)_bak`).
2.  **Command:** `python3 /Users/kristoffersanio/git/bs-display/dev/forge/forge.py create-file --prompt "Test failure" --output-file /dev/null`
3.  **Verification:**
    *   Assert the command exits with an error code (non-zero).
    *   Assert the console output contains an error message like "❌ Error calling Claude:".
    *   Read `dev/forge/forge.log` and assert it contains an `ERROR` level entry related to Claude CLI failure.
4.  **Post-condition:** Restore the `claude` executable (e.g., `mv $(which claude)_bak $(which claude)`).

**Task 2.3: Verify Logging**
1.  **Command:** `python3 /Users/kristoffersanio/git/bs-display/dev/forge/forge.py create-file --prompt "Log test" --output-file /Users/kristoffersanio/git/bs-display/dev/forge/test_output/log_test.txt`
2.  **Verification:**
    *   Read `dev/forge/forge.log`.
    *   Assert it contains `INFO` level entries for "Starting file creation," "Calling Claude with prompt," "Claude response received," and "File created successfully."

---

## **Phase 2A: Immediate Fixes - Output Parsing & Prompt Enhancement**

**Goal:** Verify that Claude's output is clean and free of markdown/conversational text.

**Task 2A.1: Test Markdown Stripping**
1.  **Command:** `python3 /Users/kristoffersanio/git/bs-display/dev/forge/forge.py create-file --prompt "A Python function to add two numbers, wrapped in a markdown code block. Include some conversational text before and after the code block." --output-file /Users/kristoffersanio/git/bs-display/dev/forge/test_output/markdown_stripped.py`
2.  **Verification:**
    *   Read `dev/forge/test_output/markdown_stripped.py`.
    *   Assert the file contains only the Python code, with no markdown fences (```) or conversational text.

**Task 2A.2: Test Clean HTML Output**
1.  **Command:** `python3 /Users/kristoffersanio/git/bs-display/dev/forge/forge.py create-file --prompt "A simple HTML page with a title 'My Web Page' and a single paragraph 'Welcome!'" --output-file /Users/kristoffersanio/git/bs-display/dev/forge/test_output/my_web_page.html`
2.  **Verification:**
    *   Read `dev/forge/test_output/my_web_page.html`.
    *   Assert the file contains only valid HTML, with no extra text or formatting markers.

---

## **Phase 4: Initial Context Awareness - Tool Notification**

**Goal:** Verify that Claude is informed about context tools and expresses intent to use them.

**Task 4.1: Test `analyze` command with `read_file_content` intent**
1.  **Command:** `python3 /Users/kristoffersanio/git/bs-display/dev/forge/forge.py analyze --prompt "Read the content of /Users/kristoffersanio/git/bs-display/dev/forge/forge.py and summarize it." --output-file /Users/kristoffersanio/git/bs-display/dev/forge/test_output/forge_summary.txt`
2.  **Verification:**
    *   Assert the console output contains a message like "🔧 Claude requested tool: read_file_content with parameter: file_path: /Users/kristoffersanio/git/bs-display/dev/forge/forge.py".
    *   Read `dev/forge/forge.log` and assert it contains an `INFO` level entry for "Detected tool call: ...".
    *   Read `dev/forge/test_output/forge_summary.txt` and assert it contains a summary of `forge.py` (this verifies Claude's understanding, even if the tool wasn't executed).

**Task 4.2: Test `analyze` command with `list_directory_contents` intent**
1.  **Command:** `python3 /Users/kristoffersanio/git/bs-display/dev/forge/forge.py analyze --prompt "List the contents of the current directory (/Users/kristoffersanio/git/bs-display/dev/forge/)." --output-file /Users/kristoffersanio/git/bs-display/dev/forge/test_output/directory_list.txt`
2.  **Verification:**
    *   Assert the console output contains a message like "🔧 Claude requested tool: list_directory_contents with parameter: directory_path: /Users/kristoffersanio/git/bs-display/dev/forge/".
    *   Read `dev/forge/forge.log` and assert it contains an `INFO` level entry for "Detected tool call: ...".
    *   Read `dev/forge/test_output/directory_list.txt` and assert it contains a list of files/directories (verifying Claude's understanding).

---

## **Phase 5: Basic Autonomous Planning - Plan Generation & Execution**

**Goal:** Verify the ability to generate and execute simple plans (currently `write_file` actions).

**Task 5.1: Test Single File Plan Execution**
1.  **Command:** `python3 /Users/kristoffersanio/git/bs-display/dev/forge/forge.py plan-and-execute --goal "Create a simple text file named 'my_plan_test.txt' with the content 'This file was created by a plan.'" --output-dir /Users/kristoffersanio/git/bs-display/dev/forge/test_output/plans`
2.  **Verification:**
    *   Assert console output indicates successful plan execution and file creation.
    *   Confirm `dev/forge/test_output/plans/my_plan_test.txt` exists.
    *   Read content: `cat /Users/kristoffersanio/git/bs-display/dev/forge/test_output/plans/my_plan_test.txt`
    *   Assert content is "This file was created by a plan."

**Task 5.2: Test Multi-File Plan Execution**
1.  **Command:** `python3 /Users/kristoffersanio/git/bs-display/dev/forge/forge.py plan-and-execute --goal "Create two files: 'file_a.txt' with 'Content for file A' and 'file_b.txt' with 'Content for file B'" --output-dir /Users/kristoffersanio/git/bs-display/dev/forge/test_output/plans/multi_files`
2.  **Verification:**
    *   Assert console output indicates successful plan execution and creation of two files.
    *   Confirm `dev/forge/test_output/plans/multi_files/file_a.txt` and `dev/forge/test_output/plans/multi_files/file_b.txt` exist.
    *   Read content of `file_a.txt` and assert it is "Content for file A".
    *   Read content of `file_b.txt` and assert it is "Content for file B".

**Task 5.3: Test Invalid Plan Handling**
1.  **Command:** `python3 /Users/kristoffersanio/git/bs-display/dev/forge/forge.py plan-and-execute --goal "Output an invalid JSON plan" --output-dir /dev/null`
2.  **Verification:**
    *   Assert the command exits with an error code (non-zero).
    *   Assert the console output contains an error message like "❌ Claude returned invalid JSON plan:" or "❌ Invalid action format missing field:".
    *   Read `dev/forge/forge.log` and assert it contains an `ERROR` level entry related to JSON parsing or action validation.

---

## **Phase 6: Code Quality & Cleanup**

**Goal:** Ensure the `forge.py` code maintains high quality and clean up test artifacts.

**Task 6.1: Run Code Review Agent on `forge.py`**
1.  **Command:** `node /Users/kristoffersanio/git/bs-display/dev/scripts/code-review-agent.js --file /Users/kristoffersanio/git/bs-display/dev/forge/forge.py`
2.  **Verification:** Review the output for any reported issues or scores. Aim for a high score (e.g., 90+).

**Task 6.2: Clean Up Test Output**
1.  **Command:** `rm -rf /Users/kristoffersanio/git/bs-display/dev/forge/test_output`
2.  **Verification:** Confirm the `dev/forge/test_output` directory no longer exists.

---

## **Expected Ideal Outcome**

Upon successful completion of all tests, the Forge MVP should demonstrate:

*   Reliable single and multi-file generation.
*   Robust error handling and comprehensive logging.
*   Clean output from Claude, free of markdown or conversational text.
*   Claude's ability to express intent to use context-aware tools.
*   The ability to generate and execute simple plans for file creation.
*   A high code quality score for `forge.py`.

This comprehensive testing will validate the MVP's current capabilities and provide a solid foundation for future development towards a fully autonomous orchestrator. 