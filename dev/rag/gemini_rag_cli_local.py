#!/usr/bin/env python3
"""
Gemini RAG CLI (Local CLI Version) - A tool for project-wide context retrieval using local Gemini CLI and ChromaDB.

This version uses the local Gemini CLI instead of API keys, with simplified embedding approach.

This script provides functionality to:
1. Ingest project files into a vector database (using simple text-based similarity)
2. Query the project context using local Gemini CLI
3. Generate context-aware responses using local Gemini

Usage:
    python gemini_rag_cli_local.py ingest --project-root /path/to/project
    python gemini_rag_cli_local.py query --query "Your question here"
"""

import argparse
import os
import sys
import subprocess
import json
import hashlib
from pathlib import Path
from typing import List, Dict, Any, Optional
import logging
import sqlite3
from collections import Counter
import re

# Third-party imports
import chromadb
from chromadb.config import Settings
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Configuration
CHROMA_DB_PATH = os.path.join(os.path.dirname(__file__), 'chroma_db_local')
COLLECTION_NAME = 'codebase_memory_local'
SIMPLE_DB_PATH = os.path.join(os.path.dirname(__file__), 'simple_context.db')

# File extensions to process
VALID_EXTENSIONS = {
    '.tsx', '.ts', '.js', '.jsx',
    '.astro', '.md', '.json', '.yml', '.yaml',
    '.scss', '.css', '.py', '.sh'
}

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class SimpleVectorDB:
    """Simple text-based vector database using TF-IDF similarity."""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
        self.init_db()
    
    def init_db(self):
        """Initialize SQLite database."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chunks (
                id TEXT PRIMARY KEY,
                content TEXT,
                file_path TEXT,
                chunk_index INTEGER,
                file_extension TEXT,
                word_count INTEGER,
                keywords TEXT
            )
        ''')
        conn.commit()
        conn.close()
    
    def add_chunk(self, chunk_id: str, content: str, metadata: Dict[str, Any]):
        """Add a chunk to the database."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Extract keywords and metadata
        keywords = self.extract_keywords(content)
        word_count = len(content.split())
        
        cursor.execute('''
            INSERT OR REPLACE INTO chunks 
            (id, content, file_path, chunk_index, file_extension, word_count, keywords)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            chunk_id,
            content,
            metadata.get('file_path', ''),
            metadata.get('chunk_index', 0),
            metadata.get('file_extension', ''),
            word_count,
            ' '.join(keywords)
        ))
        
        conn.commit()
        conn.close()
    
    def extract_keywords(self, text: str) -> List[str]:
        """Extract important keywords from text."""
        # Simple keyword extraction
        words = re.findall(r'\b\w+\b', text.lower())
        
        # Filter out common words and keep meaningful terms
        stop_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have',
            'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
            'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we',
            'they', 'me', 'him', 'her', 'us', 'them'
        }
        
        keywords = [word for word in words if len(word) > 2 and word not in stop_words]
        
        # Return most common keywords
        counter = Counter(keywords)
        return [word for word, _ in counter.most_common(20)]
    
    def search(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search for relevant chunks using keyword matching."""
        query_keywords = self.extract_keywords(query)
        
        if not query_keywords:
            return []
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Build a query to find chunks with matching keywords
        keyword_conditions = []
        params = []
        
        for keyword in query_keywords:
            keyword_conditions.append("(content LIKE ? OR keywords LIKE ?)")
            params.extend([f'%{keyword}%', f'%{keyword}%'])
        
        query_sql = f'''
            SELECT id, content, file_path, chunk_index, file_extension,
                   ({" + ".join([f"(CASE WHEN content LIKE ? OR keywords LIKE ? THEN 1 ELSE 0 END)" for _ in query_keywords])}) as score
            FROM chunks 
            WHERE {" OR ".join(keyword_conditions)}
            ORDER BY score DESC, word_count DESC
            LIMIT ?
        '''
        
        # Add parameters for scoring
        score_params = []
        for keyword in query_keywords:
            score_params.extend([f'%{keyword}%', f'%{keyword}%'])
        
        all_params = score_params + params + [limit]
        
        cursor.execute(query_sql, all_params)
        results = cursor.fetchall()
        conn.close()
        
        # Convert to dict format
        chunks = []
        for row in results:
            chunks.append({
                'content': row[1],
                'metadata': {
                    'file_path': row[2],
                    'chunk_index': row[3],
                    'file_extension': row[4]
                },
                'score': row[5]
            })
        
        return chunks


class GeminiRAGSystemLocal:
    """RAG system using local Gemini CLI."""
    
    def __init__(self):
        """Initialize the RAG system with local components."""
        self.vector_db = SimpleVectorDB(SIMPLE_DB_PATH)
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=100,
            length_function=len,
        )
        
        # Check if local Gemini CLI is available
        if not self.check_gemini_cli():
            logger.error("Local Gemini CLI not found. Please install it first.")
            sys.exit(1)
        
        logger.info("Initialized local Gemini RAG system")
    
    def check_gemini_cli(self) -> bool:
        """Check if local Gemini CLI is available."""
        try:
            result = subprocess.run(['gemini', '--version'], capture_output=True, text=True)
            return result.returncode == 0
        except FileNotFoundError:
            return False
    
    def read_and_chunk_file(self, file_path: Path) -> List[Dict[str, Any]]:
        """Read file and split into chunks with metadata."""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Skip empty files
            if not content.strip():
                return []
            
            # Split into chunks
            chunks = self.text_splitter.split_text(content)
            
            # Create chunk dictionaries with metadata
            chunk_data = []
            for i, chunk in enumerate(chunks):
                chunk_data.append({
                    'content': chunk,
                    'metadata': {
                        'file_path': str(file_path),
                        'chunk_id': f"{file_path.name}_{i}",
                        'file_extension': file_path.suffix,
                        'chunk_index': i
                    }
                })
            
            return chunk_data
            
        except Exception as e:
            logger.warning(f"Failed to read file {file_path}: {e}")
            return []
    
    def add_chunks_to_db(self, chunks: List[Dict[str, Any]]):
        """Add chunks to the simple vector database."""
        for chunk in chunks:
            self.vector_db.add_chunk(
                chunk['metadata']['chunk_id'],
                chunk['content'],
                chunk['metadata']
            )
    
    def ingest_project(self, project_root: str):
        """Ingest entire project into vector database."""
        logger.info(f"Starting ingestion of project: {project_root}")
        
        project_path = Path(project_root)
        if not project_path.exists():
            logger.error(f"Project path does not exist: {project_root}")
            return
        
        files_processed = 0
        chunks_created = 0
        
        # Walk through project directory
        for file_path in project_path.rglob('*'):
            # Skip directories and unwanted files
            if file_path.is_dir():
                continue
            
            if file_path.suffix not in VALID_EXTENSIONS:
                continue
            
            # Skip common ignore patterns
            if any(ignore in str(file_path) for ignore in [
                'node_modules', '.git', 'dist', 'build', '.next',
                '__pycache__', '.pytest_cache', 'coverage', 'venv'
            ]):
                continue
            
            # Process file
            chunks = self.read_and_chunk_file(file_path)
            if chunks:
                self.add_chunks_to_db(chunks)
                files_processed += 1
                chunks_created += len(chunks)
                
                if files_processed % 10 == 0:
                    logger.info(f"Processed {files_processed} files, {chunks_created} chunks")
        
        logger.info(f"Ingestion complete: {files_processed} files, {chunks_created} chunks")
    
    def retrieve_context(self, query_text: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Retrieve relevant context using simple similarity search."""
        return self.vector_db.search(query_text, top_k)
    
    def construct_gemini_prompt(self, user_query: str, retrieved_context: List[Dict[str, Any]]) -> str:
        """Construct augmented prompt for Gemini."""
        prompt = f"User Query: {user_query}\n\n"
        
        if retrieved_context:
            prompt += "Relevant Project Context:\n"
            for chunk in retrieved_context:
                file_path = chunk['metadata']['file_path']
                content = chunk['content']
                prompt += f"--- File: {file_path} ---\n{content}\n---\n\n"
        
        prompt += "Based on the provided context from the BS Display project and your general knowledge, please respond to the user query. Be specific and reference the code/files when relevant.\n"
        
        return prompt
    
    def query_with_context(self, query: str) -> str:
        """Query local Gemini CLI with retrieved context."""
        logger.info(f"Processing query: {query}")
        
        # Retrieve relevant context
        context = self.retrieve_context(query)
        logger.info(f"Retrieved {len(context)} relevant chunks")
        
        # Construct augmented prompt
        prompt = self.construct_gemini_prompt(query, context)
        
        # Query local Gemini CLI
        try:
            # Write prompt to temporary file
            import tempfile
            with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt') as f:
                f.write(prompt)
                temp_file = f.name
            
            # Call local Gemini CLI
            result = subprocess.run(
                ['gemini', '--prompt', f'@{temp_file}'],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            # Clean up temp file
            os.unlink(temp_file)
            
            if result.returncode == 0:
                return result.stdout.strip()
            else:
                logger.error(f"Gemini CLI error: {result.stderr}")
                return f"Error calling local Gemini CLI: {result.stderr}"
                
        except subprocess.TimeoutExpired:
            logger.error("Gemini CLI call timed out")
            return "Error: Gemini CLI call timed out"
        except Exception as e:
            logger.error(f"Failed to query local Gemini CLI: {e}")
            return f"Error generating response: {e}"


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Gemini RAG CLI (Local) for project-wide context retrieval using local Gemini CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    # Ingest project files
    python gemini_rag_cli_local.py ingest --project-root /path/to/bs-display/dev
    
    # Query with context
    python gemini_rag_cli_local.py query --query "How does the ProductCard component work?"
    
    # Debug query
    python gemini_rag_cli_local.py query --query "DEBUG ANALYSIS: images 404 on product pages"
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Ingest command
    ingest_parser = subparsers.add_parser('ingest', help='Ingest project files into vector database')
    ingest_parser.add_argument(
        '--project-root',
        required=True,
        help='Root directory of the project to ingest'
    )
    
    # Query command
    query_parser = subparsers.add_parser('query', help='Query project context using RAG')
    query_parser.add_argument(
        '--query',
        required=True,
        help='Query text to search for relevant context'
    )
    
    # Update command (for future use)
    update_parser = subparsers.add_parser('update', help='Update/re-ingest project files')
    update_parser.add_argument(
        '--project-root',
        required=True,
        help='Root directory of the project to update'
    )
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    # Initialize RAG system
    rag_system = GeminiRAGSystemLocal()
    
    # Execute command
    if args.command == 'ingest':
        rag_system.ingest_project(args.project_root)
    
    elif args.command == 'query':
        response = rag_system.query_with_context(args.query)
        print("\n" + "="*80)
        print("GEMINI RESPONSE (Local CLI):")
        print("="*80)
        print(response)
        print("="*80)
    
    elif args.command == 'update':
        # For MVP, update = re-ingest
        logger.info("Update command: re-ingesting project")
        rag_system.ingest_project(args.project_root)


if __name__ == '__main__':
    main()