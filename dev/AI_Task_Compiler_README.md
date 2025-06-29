
# 🧠 AI Task Compiler – Lean AI Orchestrator

A lightweight, CLI-based orchestration system that breaks down high-level development goals into Claude-executable subtasks, ensuring code quality, consistency, and compliance to project standards.

---

## 🚀 Key Features

- 🧩 Task decomposition with prompt templates  
- 🤖 Claude CLI integration for LLM-powered development  
- ✅ Standards compliance with automated validation  
- 🧪 Modular file-based task output + validation  
- 🗂️ Git-friendly, human-readable format

---

## 📦 Project Structure

```
my-project/
├── orchestrator/
│   ├── run.py                # Main CLI orchestrator
│   ├── taskgraph.json        # Task dependency DAG
│   ├── templates/            # Prompt templates
│   └── standards/            # Code style & guidelines
├── tasks/                    # Subtask folders
│   ├── 01-parse/
│   └── 02-generate-api/
├── src/                      # Final code output
└── README.md
```

---

## 🛠️ Workflow

### 1. Compile Goal Into Tasks

```bash
python orchestrator/run.py compile "Build a contact form with backend API"
```

➡️ Generates `taskgraph.json` and task folders with Claude prompt templates.

---

### 2. Run All Tasks

```bash
python orchestrator/run.py run
```

➡️ Runs Claude CLI for each task’s `prompt.md` and saves `output.txt`.

---

### 3. Validate Outputs

```bash
python orchestrator/run.py review
```

➡️ Lints, tests, and checks outputs against your defined `standards.md`.

---

### 4. Merge Completed Work

```bash
python orchestrator/run.py merge
```

➡️ Merges successful task outputs into `/src/` for final integration.

---

## ⚙️ Requirements

- Python 3.8+
- Claude CLI installed and configured
- Optional: `eslint`, `pytest`, etc. for validation steps

---

## 🧩 Prompt Template Example

```mustache
You are a {{role}} AI assistant.

Task: {{description}}

Project goal: {{project_goal}}

Follow standards: {{standards_summary}}

Output only valid code in triple backticks.
```

---

## 📈 Roadmap

- [x] Basic DAG-based task orchestration  
- [ ] JSON/SQLite-based project memory  
- [ ] Git integration (PRs from output)  
- [ ] Web UI for monitoring  
- [ ] Auto-learning from past tasks

---

## 🧠 Philosophy

> Treat LLM development as a deterministic build pipeline.  
> Small prompts → clean tasks → repeatable results.

---

## 📄 License

MIT – Free to use, modify, and extend.
