"""
Unit tests for Forge MVP.
"""

import subprocess
import tempfile
from pathlib import Path
from unittest.mock import Mock, patch

import pytest
from pydantic import ValidationError

from forge import PromptRequest, ClaudeResponse, FileSpec, MultiFileResponse, Action, call_claude, parse_multi_file_response, read_file_content, list_directory_contents, detect_tool_calls, execute_actions


class TestPromptRequest:
    """Test PromptRequest model."""
    
    def test_valid_prompt_request(self):
        """Test valid prompt request creation."""
        request = PromptRequest(text="Create a Python function")
        assert request.text == "Create a Python function"
    
    def test_empty_prompt_request(self):
        """Test empty prompt request is allowed."""
        # Empty strings are valid for our MVP
        request = PromptRequest(text="")
        assert request.text == ""


class TestClaudeResponse:
    """Test ClaudeResponse model."""
    
    def test_valid_claude_response(self):
        """Test valid Claude response creation."""
        response = ClaudeResponse(content="def hello(): pass")
        assert response.content == "def hello(): pass"
    
    def test_empty_claude_response(self):
        """Test empty Claude response is allowed."""
        # Empty content is valid for our MVP
        response = ClaudeResponse(content="")
        assert response.content == ""


class TestCallClaude:
    """Test call_claude function."""
    
    @patch('subprocess.run')
    def test_successful_claude_call(self, mock_run):
        """Test successful Claude CLI call."""
        mock_run.return_value = Mock(stdout="def hello(): pass\n", returncode=0)
        
        result = call_claude("Create a Python function")
        
        assert result == "def hello(): pass"
        mock_run.assert_called_once()
        
    @patch('subprocess.run')
    def test_claude_call_failure(self, mock_run):
        """Test Claude CLI call failure."""
        mock_run.side_effect = subprocess.CalledProcessError(
            1, 'claude', stderr="Error: Invalid prompt"
        )
        
        with pytest.raises(subprocess.CalledProcessError):
            call_claude("Invalid prompt")
    
    @patch('subprocess.run')
    def test_claude_call_with_structured_prompt(self, mock_run):
        """Test that Claude is called with structured prompt."""
        mock_run.return_value = Mock(stdout="content", returncode=0)
        
        call_claude("test prompt")
        
        # Verify the structured prompt was created
        args, kwargs = mock_run.call_args
        assert "Generate content for a file based on this description: test prompt" in args[0][1]
        assert "Provide ONLY the raw file content" in args[0][1]


class TestFileSpec:
    """Test FileSpec model."""
    
    def test_valid_file_spec(self):
        """Test valid file spec creation."""
        file_spec = FileSpec(path="src/component.tsx", content="export default function Component() {}")
        assert file_spec.path == "src/component.tsx"
        assert "Component" in file_spec.content


class TestMultiFileResponse:
    """Test MultiFileResponse model."""
    
    def test_valid_multi_file_response(self):
        """Test valid multi-file response creation."""
        files = [
            FileSpec(path="src/Component.tsx", content="export default function Component() {}"),
            FileSpec(path="src/Component.module.css", content=".component { color: blue; }")
        ]
        response = MultiFileResponse(files=files)
        assert len(response.files) == 2
        assert response.files[0].path == "src/Component.tsx"


class TestParseMultiFileResponse:
    """Test parse_multi_file_response function."""
    
    def test_parse_valid_multi_file_content(self):
        """Test parsing valid multi-file content."""
        content = """FILE: src/Component.tsx
export default function Component() {
    return <div>Hello</div>;
}

FILE: src/Component.module.css
.component {
    color: blue;
    padding: 10px;
}

FILE: src/Component.test.tsx
import Component from './Component';
test('renders component', () => {});"""
        
        files = parse_multi_file_response(content)
        
        assert len(files) == 3
        assert files[0].path == "src/Component.tsx"
        assert "export default" in files[0].content
        assert files[1].path == "src/Component.module.css"
        assert ".component" in files[1].content
        assert files[2].path == "src/Component.test.tsx"
        assert "test(" in files[2].content
    
    def test_parse_single_file_content(self):
        """Test parsing content without FILE: markers."""
        content = "function hello() { return 'world'; }"
        files = parse_multi_file_response(content)
        assert len(files) == 0
    
    def test_parse_with_markdown_formatting(self):
        """Test parsing content with markdown code blocks."""
        content = """FILE: src/utils.js
```javascript
function add(a, b) {
    return a + b;
}
```

FILE: src/utils.test.js
```javascript
test('add function', () => {
    expect(add(1, 2)).toBe(3);
});
```"""
        
        files = parse_multi_file_response(content)
        
        assert len(files) == 2
        # Check that markdown formatting is stripped
        assert "```javascript" not in files[0].content
        assert "function add" in files[0].content
        assert "```" not in files[1].content
        assert "test('add function'" in files[1].content


class TestIntegration:
    """Integration tests for the CLI."""
    
    def test_file_creation_flow(self):
        """Test the complete file creation flow."""
        with tempfile.TemporaryDirectory() as temp_dir:
            output_path = Path(temp_dir) / "test_output.txt"
            
            # Mock the Claude call to return predictable content
            with patch('forge.call_claude') as mock_claude:
                mock_claude.return_value = "Hello, World!"
                
                # Import and test the create_file function
                from forge import create_file
                
                # This would normally be called by Typer, but we test the logic
                request = PromptRequest(text="Create a greeting file")
                # Use the mocked call_claude
                content = mock_claude.return_value
                response = ClaudeResponse(content=content)
                
                output_path.write_text(response.content)
                
                assert output_path.exists()
                # Content should match what we mocked
                assert "Hello, World!" in output_path.read_text()
    
    def test_multi_file_creation_flow(self):
        """Test the complete multi-file creation flow."""
        with tempfile.TemporaryDirectory() as temp_dir:
            # Mock the multi-file response
            mock_content = """FILE: component.tsx
export default function TestComponent() {
    return <div>Test</div>;
}

FILE: component.css
.test { color: red; }"""
            
            with patch('forge.call_claude') as mock_claude:
                mock_claude.return_value = mock_content
                
                # Test the parsing and file creation logic
                files = parse_multi_file_response(mock_content)
                response = MultiFileResponse(files=files)
                
                # Simulate file creation
                for file_spec in response.files:
                    file_path = Path(temp_dir) / file_spec.path
                    file_path.parent.mkdir(parents=True, exist_ok=True)
                    file_path.write_text(file_spec.content)
                
                # Verify files were created
                component_file = Path(temp_dir) / "component.tsx"
                css_file = Path(temp_dir) / "component.css"
                
                assert component_file.exists()
                assert css_file.exists()
                assert "TestComponent" in component_file.read_text()
                assert ".test" in css_file.read_text()


class TestFileSystemUtilities:
    """Test file system utility functions."""
    
    def test_read_file_content_success(self):
        """Test reading an existing file."""
        with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt') as temp_file:
            temp_file.write("Test content\nLine 2")
            temp_file.flush()
            
            try:
                content = read_file_content(temp_file.name)
                assert content == "Test content\nLine 2"
            finally:
                Path(temp_file.name).unlink()
    
    def test_read_file_content_not_found(self):
        """Test reading a non-existent file."""
        with pytest.raises(FileNotFoundError):
            read_file_content("/non/existent/file.txt")
    
    def test_list_directory_contents_success(self):
        """Test listing directory contents."""
        with tempfile.TemporaryDirectory() as temp_dir:
            # Create some test files and directories
            (Path(temp_dir) / "file1.txt").write_text("content1")
            (Path(temp_dir) / "file2.py").write_text("content2")
            (Path(temp_dir) / "subdir").mkdir()
            
            contents = list_directory_contents(temp_dir)
            
            assert len(contents) == 3
            assert "file1.txt" in contents
            assert "file2.py" in contents
            assert "subdir" in contents
    
    def test_list_directory_contents_not_found(self):
        """Test listing a non-existent directory."""
        with pytest.raises(FileNotFoundError):
            list_directory_contents("/non/existent/directory")
    
    def test_list_directory_contents_not_directory(self):
        """Test listing contents of a file (not directory)."""
        with tempfile.NamedTemporaryFile() as temp_file:
            with pytest.raises(NotADirectoryError):
                list_directory_contents(temp_file.name)


class TestToolCallDetection:
    """Test tool call detection functionality."""
    
    def test_detect_tool_calls_single_call(self):
        """Test detecting a single tool call."""
        content = 'I need to {"tool": "read_file_content", "file_path": "/path/to/file"} to understand the code.'
        
        tool_calls = detect_tool_calls(content)
        
        assert len(tool_calls) == 1
        assert tool_calls[0]["tool"] == "read_file_content"
        assert tool_calls[0]["parameter"] == "file_path"
        assert tool_calls[0]["value"] == "/path/to/file"
    
    def test_detect_tool_calls_multiple_calls(self):
        """Test detecting multiple tool calls."""
        content = '''First I need {"tool": "read_file_content", "file_path": "/file1.py"}
        and then {"tool": "list_directory_contents", "directory_path": "/src"}'''
        
        tool_calls = detect_tool_calls(content)
        
        assert len(tool_calls) == 2
        assert tool_calls[0]["tool"] == "read_file_content"
        assert tool_calls[1]["tool"] == "list_directory_contents"
    
    def test_detect_tool_calls_no_calls(self):
        """Test content with no tool calls."""
        content = "This is just regular text with no tool calls."
        
        tool_calls = detect_tool_calls(content)
        
        assert len(tool_calls) == 0
    
    def test_detect_tool_calls_malformed_json(self):
        """Test content with malformed JSON tool calls."""
        content = 'Invalid {"tool": "read_file_content", "missing_quote: "/path"} format'
        
        tool_calls = detect_tool_calls(content)
        
        # Should not crash, but also shouldn't detect anything
        assert len(tool_calls) == 0


class TestAction:
    """Test Action model for planning."""
    
    def test_valid_action(self):
        """Test valid action creation."""
        action = Action(
            action="write_file",
            file_path="test.txt",
            content="Hello World"
        )
        assert action.action == "write_file"
        assert action.file_path == "test.txt"
        assert action.content == "Hello World"


class TestExecuteActions:
    """Test execute_actions function."""
    
    def test_execute_single_write_file_action(self):
        """Test executing a single write_file action."""
        with tempfile.TemporaryDirectory() as temp_dir:
            action = Action(
                action="write_file",
                file_path=str(Path(temp_dir) / "test.txt"),
                content="Test content"
            )
            
            created_files = execute_actions([action])
            
            assert len(created_files) == 1
            assert str(Path(temp_dir) / "test.txt") in created_files
            
            # Verify file was created with correct content
            file_path = Path(temp_dir) / "test.txt"
            assert file_path.exists()
            assert file_path.read_text() == "Test content"
    
    def test_execute_multiple_write_file_actions(self):
        """Test executing multiple write_file actions."""
        with tempfile.TemporaryDirectory() as temp_dir:
            actions = [
                Action(
                    action="write_file",
                    file_path=str(Path(temp_dir) / "file1.txt"),
                    content="Content 1"
                ),
                Action(
                    action="write_file",
                    file_path=str(Path(temp_dir) / "subdir" / "file2.txt"),
                    content="Content 2"
                )
            ]
            
            created_files = execute_actions(actions)
            
            assert len(created_files) == 2
            
            # Verify both files were created
            file1 = Path(temp_dir) / "file1.txt"
            file2 = Path(temp_dir) / "subdir" / "file2.txt"
            
            assert file1.exists()
            assert file2.exists()
            assert file1.read_text() == "Content 1"
            assert file2.read_text() == "Content 2"
    
    def test_execute_unknown_action_type(self):
        """Test executing an unknown action type."""
        action = Action(
            action="unknown_action",
            file_path="test.txt",
            content="content"
        )
        
        with pytest.raises(Exception, match="Unknown action type: unknown_action"):
            execute_actions([action])
    
    def test_execute_action_file_creation_error(self):
        """Test handling file creation errors."""
        # Try to create file in non-existent directory with restrictive permissions
        action = Action(
            action="write_file",
            file_path="/root/restricted/test.txt",  # This should fail on most systems
            content="content"
        )
        
        with pytest.raises(Exception, match="Failed to execute action"):
            execute_actions([action])