#!/usr/bin/env python3
"""
Forge MVP - AI-First Orchestrator
A minimal viable product for AI-driven file generation via Claude CLI.
"""

import logging
import subprocess
import sys
from pathlib import Path
from typing import Optional

import typer
from pydantic import BaseModel, ValidationError

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('forge.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = typer.Typer(help="Forge MVP - AI-First Orchestrator")


class PromptRequest(BaseModel):
    """Model for user prompt input."""
    text: str


class FileSpec(BaseModel):
    """Model for a single file specification."""
    path: str
    content: str


class ClaudeResponse(BaseModel):
    """Model for Claude's response."""
    content: str


class MultiFileResponse(BaseModel):
    """Model for multi-file Claude response."""
    files: list[FileSpec]


class Action(BaseModel):
    """Model for a single action in a plan."""
    action: str
    file_path: str
    content: str


def parse_multi_file_response(content: str) -> list[FileSpec]:
    """
    Parse Claude response that may contain multiple files.
    
    Expected format:
    FILE: path/to/file1.ext
    content of file1
    
    FILE: path/to/file2.ext
    content of file2
    
    Args:
        content: Raw content from Claude
        
    Returns:
        List of FileSpec objects
    """
    import re
    
    files = []
    
    # Split content by FILE: markers
    file_pattern = r'^FILE:\s*(.+)$'
    parts = re.split(file_pattern, content, flags=re.MULTILINE)
    
    # If no FILE: markers found, treat as single file
    if len(parts) <= 1:
        return []
    
    # Parse file path and content pairs
    for i in range(1, len(parts), 2):
        if i + 1 < len(parts):
            file_path = parts[i].strip()
            file_content = parts[i + 1].strip()
            
            # Clean markdown formatting from content
            file_content = strip_markdown_formatting(file_content)
            
            files.append(FileSpec(path=file_path, content=file_content))
    
    return files


def read_file_content(file_path: str) -> str:
    """
    Read and return the content of a specified file.
    
    Args:
        file_path: Path to the file to read
        
    Returns:
        Content of the file as a string
        
    Raises:
        FileNotFoundError: If the file doesn't exist
        PermissionError: If the file can't be read
    """
    try:
        file_path_obj = Path(file_path)
        return file_path_obj.read_text(encoding='utf-8')
    except FileNotFoundError:
        logger.error(f"File not found: {file_path}")
        raise
    except PermissionError:
        logger.error(f"Permission denied reading file: {file_path}")
        raise
    except Exception as e:
        logger.error(f"Error reading file {file_path}: {e}")
        raise


def list_directory_contents(directory_path: str) -> list[str]:
    """
    List the names of files and subdirectories within a specified directory.
    
    Args:
        directory_path: Path to the directory to list
        
    Returns:
        List of file and directory names (not full paths)
        
    Raises:
        FileNotFoundError: If the directory doesn't exist
        NotADirectoryError: If the path is not a directory
        PermissionError: If the directory can't be read
    """
    try:
        directory_path_obj = Path(directory_path)
        if not directory_path_obj.exists():
            raise FileNotFoundError(f"Directory not found: {directory_path}")
        if not directory_path_obj.is_dir():
            raise NotADirectoryError(f"Path is not a directory: {directory_path}")
        
        return [item.name for item in directory_path_obj.iterdir()]
    except (FileNotFoundError, NotADirectoryError, PermissionError):
        logger.error(f"Error accessing directory: {directory_path}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error listing directory {directory_path}: {e}")
        raise


def strip_markdown_formatting(content: str) -> str:
    """
    Remove markdown code block formatting from Claude's response.
    
    Args:
        content: Raw content from Claude that may contain markdown formatting
        
    Returns:
        Clean content without markdown code blocks
    """
    import re
    
    # Remove markdown code blocks (```language...```)
    content = re.sub(r'^```[a-zA-Z]*\n', '', content, flags=re.MULTILINE)
    content = re.sub(r'\n```$', '', content, flags=re.MULTILINE)
    content = re.sub(r'^```$', '', content, flags=re.MULTILINE)
    
    # Remove any remaining triple backticks
    content = content.replace('```', '')
    
    return content.strip()


def execute_actions(actions: list[Action]) -> list[str]:
    """
    Execute a list of actions from a plan.
    
    Args:
        actions: List of Action objects to execute
        
    Returns:
        List of created file paths
        
    Raises:
        Exception: If any action fails to execute
    """
    created_files = []
    
    for action in actions:
        logger.info(f"Executing action: {action.action} for file: {action.file_path}")
        
        if action.action == "write_file":
            try:
                file_path = Path(action.file_path)
                file_path.parent.mkdir(parents=True, exist_ok=True)
                file_path.write_text(action.content)
                created_files.append(str(file_path))
                logger.info(f"Successfully created file: {file_path}")
            except Exception as e:
                logger.error(f"Failed to create file {action.file_path}: {e}")
                raise Exception(f"Failed to execute action for {action.file_path}: {e}")
        else:
            logger.warning(f"Unknown action type: {action.action}")
            raise Exception(f"Unknown action type: {action.action}")
    
    return created_files


def detect_tool_calls(content: str) -> list[dict]:
    """
    Detect if Claude's response contains tool call requests.
    
    Args:
        content: Claude's response content
        
    Returns:
        List of tool call dictionaries, empty if none found
    """
    import json
    import re
    
    tool_calls = []
    
    # Look for JSON tool call patterns
    json_pattern = r'\{"tool":\s*"([^"]+)",\s*"([^"]+)":\s*"([^"]+)"\}'
    matches = re.finditer(json_pattern, content)
    
    for match in matches:
        try:
            tool_call = {
                "tool": match.group(1),
                "parameter": match.group(2),
                "value": match.group(3)
            }
            tool_calls.append(tool_call)
            logger.info(f"Detected tool call: {tool_call}")
        except Exception as e:
            logger.warning(f"Failed to parse tool call: {e}")
    
    return tool_calls


def call_claude(prompt: str, enable_context_tools: bool = False) -> str:
    """
    Call Claude CLI with the given prompt and return clean response.
    
    Args:
        prompt: The prompt to send to Claude
        enable_context_tools: Whether to inform Claude about context tools
        
    Returns:
        Claude's response as a string, cleaned of markdown formatting
        
    Raises:
        subprocess.CalledProcessError: If Claude CLI fails
    """
    # Create base prompt based on context tools availability
    if enable_context_tools:
        structured_prompt = f"""You have access to these tools for understanding the codebase:

1. read_file_content(file_path) - Read the content of any file
2. list_directory_contents(directory_path) - List files and directories

If you need information from the codebase, indicate this by outputting:
{{"tool": "read_file_content", "file_path": "path/to/file"}}
{{"tool": "list_directory_contents", "directory_path": "path/to/directory"}}

Task: {prompt}

Note: Tool execution is not yet automated - this is for awareness only."""
    else:
        # Standard file generation prompt
        structured_prompt = f"""Generate content for a file based on this description: {prompt}

IMPORTANT: Provide ONLY the raw file content. Do not include:
- Markdown code blocks (```language)
- Explanatory text
- Comments about the code
- Any formatting markers

Return only the exact content that should be written to the file."""
    
    logger.info(f"Calling Claude with prompt: {prompt}")
    
    try:
        result = subprocess.run(
            ["claude", structured_prompt],
            capture_output=True,
            text=True,
            check=True
        )
        raw_response = result.stdout.strip()
        
        # Detect tool calls if context tools are enabled
        if enable_context_tools:
            tool_calls = detect_tool_calls(raw_response)
            if tool_calls:
                logger.info(f"Tool calls detected but not executed: {tool_calls}")
                # For MVP, just inform user about tool calls
                for tool_call in tool_calls:
                    print(f"🔧 Claude requested tool: {tool_call['tool']} with {tool_call['parameter']}: {tool_call['value']}")
        
        # Clean the response of any markdown formatting
        cleaned_response = strip_markdown_formatting(raw_response)
        
        logger.info(f"Claude response received: {len(raw_response)} characters, cleaned to {len(cleaned_response)} characters")
        return cleaned_response
    except subprocess.CalledProcessError as e:
        logger.error(f"Claude CLI failed: {e.stderr}")
        raise subprocess.CalledProcessError(
            e.returncode, 
            e.cmd, 
            f"Claude CLI failed: {e.stderr}"
        )


@app.command()
def create_file(
    prompt: str = typer.Option(..., "--prompt", "-p", help="Description of the file to create"),
    output_file: str = typer.Option(..., "--output-file", "-o", help="Path to save the generated file")
) -> None:
    """
    Generate a file using Claude AI based on the provided prompt.
    
    Args:
        prompt: Description of what the file should contain
        output_file: Path where the generated file should be saved
    """
    try:
        # Validate input with Pydantic
        prompt_request = PromptRequest(text=prompt)
        logger.info(f"Starting file creation: {output_file}")
        
        # Call Claude to generate content
        typer.echo(f"Generating content for: {prompt}")
        content = call_claude(prompt_request.text)
        
        # Validate Claude's response
        claude_response = ClaudeResponse(content=content)
        
        # Write content to file
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(claude_response.content)
        
        logger.info(f"File created successfully: {output_file}")
        typer.echo(f"✅ File created successfully: {output_file}")
        
    except ValidationError as e:
        logger.error(f"Validation error: {e}")
        typer.echo(f"❌ Input validation error: {e}", err=True)
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        logger.error(f"Claude CLI error: {e}")
        typer.echo(f"❌ Error calling Claude: {e}", err=True)
        sys.exit(1)
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        typer.echo(f"❌ Unexpected error: {e}", err=True)
        sys.exit(1)


@app.command()
def create_files(
    prompt: str = typer.Option(..., "--prompt", "-p", help="Description of the files to create"),
    output_dir: str = typer.Option(".", "--output-dir", "-d", help="Directory to save the generated files")
) -> None:
    """
    Generate multiple files using Claude AI based on the provided prompt.
    
    Args:
        prompt: Description of what files should be created
        output_dir: Directory where the generated files should be saved
    """
    try:
        # Validate input with Pydantic
        prompt_request = PromptRequest(text=prompt)
        logger.info(f"Starting multi-file creation in: {output_dir}")
        
        # Enhanced prompt for multi-file generation
        multi_file_prompt = f"""Create multiple related files based on this description: {prompt_request.text}

IMPORTANT: Use this exact format for multiple files:

FILE: path/to/file1.ext
content of file1

FILE: path/to/file2.ext  
content of file2

FILE: path/to/file3.ext
content of file3

Rules:
- Each file must start with "FILE: " followed by the relative path
- Provide ONLY the raw file content after each FILE: line
- No markdown code blocks or explanations
- Create related files (e.g., component + styles + tests)"""

        # Call Claude to generate content
        typer.echo(f"Generating multiple files for: {prompt}")
        content = call_claude(multi_file_prompt)
        
        # Parse multi-file response
        files = parse_multi_file_response(content)
        
        if not files:
            # Fallback to single file if no FILE: markers found
            typer.echo("⚠️  No multi-file format detected, creating single file")
            claude_response = ClaudeResponse(content=content)
            output_path = Path(output_dir) / "generated_file.txt"
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_text(claude_response.content)
            
            logger.info(f"Single file created: {output_path}")
            typer.echo(f"✅ File created: {output_path}")
            return
        
        # Create multi-file response and write files
        multi_response = MultiFileResponse(files=files)
        output_base = Path(output_dir)
        
        created_files = []
        for file_spec in multi_response.files:
            file_path = output_base / file_spec.path
            file_path.parent.mkdir(parents=True, exist_ok=True)
            file_path.write_text(file_spec.content)
            created_files.append(str(file_path))
            
        logger.info(f"Created {len(created_files)} files: {created_files}")
        typer.echo(f"✅ Created {len(created_files)} files:")
        for file_path in created_files:
            typer.echo(f"   📄 {file_path}")
        
    except ValidationError as e:
        logger.error(f"Validation error: {e}")
        typer.echo(f"❌ Input validation error: {e}", err=True)
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        logger.error(f"Claude CLI error: {e}")
        typer.echo(f"❌ Error calling Claude: {e}", err=True)
        sys.exit(1)
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        typer.echo(f"❌ Unexpected error: {e}", err=True)
        sys.exit(1)


@app.command()
def analyze(
    prompt: str = typer.Option(..., "--prompt", "-p", help="Analysis task for Claude with context awareness"),
    output_file: str = typer.Option(..., "--output-file", "-o", help="Path to save the analysis result")
) -> None:
    """
    Analyze codebase using Claude AI with context awareness tools.
    
    Args:
        prompt: Analysis task description (e.g., "Read and summarize forge.py")
        output_file: Path where the analysis result should be saved
    """
    try:
        # Validate input with Pydantic
        prompt_request = PromptRequest(text=prompt)
        logger.info(f"Starting context-aware analysis: {prompt}")
        
        # Call Claude with context tools enabled
        typer.echo(f"Analyzing with context awareness: {prompt}")
        content = call_claude(prompt_request.text, enable_context_tools=True)
        
        # Validate Claude's response
        claude_response = ClaudeResponse(content=content)
        
        # Write content to file
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(claude_response.content)
        
        logger.info(f"Analysis completed successfully: {output_file}")
        typer.echo(f"✅ Analysis completed: {output_file}")
        
    except ValidationError as e:
        logger.error(f"Validation error: {e}")
        typer.echo(f"❌ Input validation error: {e}", err=True)
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        logger.error(f"Claude CLI error: {e}")
        typer.echo(f"❌ Error calling Claude: {e}", err=True)
        sys.exit(1)
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        typer.echo(f"❌ Unexpected error: {e}", err=True)
        sys.exit(1)


@app.command()
def plan_and_execute(
    goal: str = typer.Option(..., "--goal", "-g", help="High-level goal for the plan"),
    output_dir: str = typer.Option(".", "--output-dir", "-d", help="Directory for generated files")
) -> None:
    """
    Generate a plan from a high-level goal and execute it.
    
    Args:
        goal: High-level objective (e.g., "Create a simple text file with hello world")
        output_dir: Directory where files should be created
    """
    try:
        # Validate input with Pydantic
        goal_request = PromptRequest(text=goal)
        logger.info(f"Starting planning for goal: {goal}")
        
        # Create meta-prompt for planning
        meta_prompt = f"""You are an AI planner. Your goal is: '{goal_request.text}'

Output a JSON array of actions. Each action must be exactly this format:
{{"action": "write_file", "file_path": "path/to/file", "content": "file content"}}

Rules:
- Use only "write_file" actions
- Use relative file paths within the output directory
- Provide complete file content
- Do not include any other text or explanations
- Output only valid JSON array

Example:
[
  {{"action": "write_file", "file_path": "hello.txt", "content": "Hello World!"}},
  {{"action": "write_file", "file_path": "readme.md", "content": "# My Project\\nThis is a sample."}}
]"""

        # Call Claude to generate plan
        typer.echo(f"🧠 Planning for goal: {goal}")
        raw_plan = call_claude(meta_prompt)
        
        # Parse JSON response into Action objects
        try:
            import json
            plan_data = json.loads(raw_plan)
            
            actions = []
            for action_data in plan_data:
                # Adjust file paths to be relative to output_dir
                file_path = Path(output_dir) / action_data["file_path"]
                action = Action(
                    action=action_data["action"],
                    file_path=str(file_path),
                    content=action_data["content"]
                )
                actions.append(action)
            
            logger.info(f"Parsed {len(actions)} actions from plan")
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse plan JSON: {e}")
            typer.echo(f"❌ Claude returned invalid JSON plan: {e}", err=True)
            typer.echo(f"Raw response: {raw_plan[:200]}...", err=True)
            sys.exit(1)
        except KeyError as e:
            logger.error(f"Missing required field in action: {e}")
            typer.echo(f"❌ Invalid action format missing field: {e}", err=True)
            sys.exit(1)
        
        # Execute the plan
        typer.echo(f"⚙️  Executing {len(actions)} actions...")
        created_files = execute_actions(actions)
        
        logger.info(f"Plan execution completed: {len(created_files)} files created")
        typer.echo(f"✅ Plan executed successfully!")
        typer.echo(f"📁 Created {len(created_files)} files:")
        for file_path in created_files:
            typer.echo(f"   📄 {file_path}")
        
    except ValidationError as e:
        logger.error(f"Validation error: {e}")
        typer.echo(f"❌ Input validation error: {e}", err=True)
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        logger.error(f"Claude CLI error: {e}")
        typer.echo(f"❌ Error calling Claude: {e}", err=True)
        sys.exit(1)
    except Exception as e:
        logger.error(f"Unexpected error during planning: {e}")
        typer.echo(f"❌ Planning error: {e}", err=True)
        sys.exit(1)


if __name__ == "__main__":
    app()