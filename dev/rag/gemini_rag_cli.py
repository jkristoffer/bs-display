#!/usr/bin/env python3
"""
Gemini RAG CLI - A tool for project-wide context retrieval using Gemini and ChromaDB.

This script provides functionality to:
1. Ingest project files into a vector database
2. Query the project context using RAG (Retrieval-Augmented Generation)
3. Generate context-aware responses using local Gemini CLI

Features:
- Smart re-ingestion with duplicate detection
- Progress indicator during ingestion
- Hybrid approach: API embeddings + local CLI responses
- Force flag for intentional database recreation

Usage:
    # Initial ingestion
    python gemini_rag_cli.py ingest --project-root /path/to/project
    
    # Re-ingestion with safety check
    python gemini_rag_cli.py ingest --project-root /path/to/project
    # → Error: Collection exists with X chunks. Use --force or /gemini-update
    
    # Force recreation
    python gemini_rag_cli.py ingest --project-root /path/to/project --force
    
    # Query with context
    python gemini_rag_cli.py query --query "Your question here"
"""

import argparse
import os
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional
import logging
import tempfile
import subprocess

# Third-party imports
import google.generativeai as genai
import chromadb
from chromadb.config import Settings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

# Disable ChromaDB telemetry to avoid capture() error
os.environ["ANONYMIZED_TELEMETRY"] = "False"
os.environ["CHROMA_TELEMETRY"] = "False"

# Load environment variables
load_dotenv()

# Configuration
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
CHROMA_DB_PATH = os.path.join(os.path.dirname(__file__), 'chroma_db')

# Collection configurations
COLLECTIONS = {
    'codebase': {
        'name': 'codebase_memory',
        'description': 'Core codebase files for development',
        'include_paths': [],
        'exclude_paths': [
            'node_modules', '.git', 'dist', 'build', '.next',
            '__pycache__', '.pytest_cache', 'coverage', 'venv',
            '.vercel', 'test_output', '.DS_Store', '.husky',
            '.latest-snapshot', 'chroma_db', 'content-queue',
            'FORGE_MVP', 'calculator-project', 'mvp_explanation',
            '/src/content/blog/', '/.claude/commands/', '/vps-scripts/',
            'LEGACY_COMPONENTS', 'LEGAL_PAGE_REFACTORING', 'VPS_MOBILE_SETUP',
            '/orchestrator/output/', '/orchestrator/testing/'
        ]
    },
    'blog': {
        'name': 'blog_content',
        'description': 'Blog posts and marketing content',
        'include_paths': ['/src/content/blog/'],
        'exclude_paths': [
            'node_modules', '.git', 'dist', 'build', '.next',
            '__pycache__', '.pytest_cache', 'coverage', 'venv',
            '.vercel', 'test_output', '.DS_Store', '.husky',
            '.latest-snapshot', 'chroma_db', 'content-queue',
            'FORGE_MVP', 'calculator-project', 'mvp_explanation'
        ]
    },
    'product-data': {
        'name': 'product_data',
        'description': 'Product specifications and data files',
        'include_paths': ['/src/data/'],
        'exclude_paths': [
            'node_modules', '.git', 'dist', 'build', '.next',
            '__pycache__', '.pytest_cache', 'coverage', 'venv',
            '.vercel', 'test_output', '.DS_Store', '.husky',
            '.latest-snapshot', 'chroma_db', 'content-queue',
            'FORGE_MVP', 'calculator-project', 'mvp_explanation'
        ]
    },
    'all': {
        'name': 'complete_project',
        'description': 'Complete project including all content',
        'include_paths': [],
        'exclude_paths': [
            'node_modules', '.git', 'dist', 'build', '.next',
            '__pycache__', '.pytest_cache', 'coverage', 'venv',
            '.vercel', 'test_output', '.DS_Store', '.husky',
            '.latest-snapshot', 'chroma_db', 'content-queue',
            'FORGE_MVP', 'calculator-project', 'mvp_explanation'
        ]
    }
}

# File extensions to process (focusing on core development files)
VALID_EXTENSIONS = {
    '.tsx', '.ts', '.jsx',                    # React/TypeScript components
    '.astro',                                 # Astro components
    '.md',                                    # Documentation
    '.scss', '.css',                          # Styles
    '.py', '.sh'                             # Scripts
}

# Exclude most JSON files except important config
INCLUDE_JSON_PATTERNS = {
    'package.json', 'tsconfig.json', 'astro.config', 
    'models.', 'CLAUDE.md', 'README.md'       # Project-specific data files
}

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Suppress ChromaDB telemetry errors
logging.getLogger("chromadb.telemetry.posthog").setLevel(logging.CRITICAL)


class GeminiRAGSystem:
    """Main class for the RAG system."""
    
    def __init__(self, collection_type='codebase'):
        """Initialize the RAG system with Gemini and ChromaDB clients.
        
        Args:
            collection_type: Type of collection ('codebase', 'blog', 'all')
        """
        self.collection_type = collection_type
        self.collection_config = COLLECTIONS[collection_type]
        self.chroma_client = None
        self.collection = None
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=100,
            length_function=len,
        )
        
        # Initialize Gemini API
        if not GEMINI_API_KEY:
            logger.error("GEMINI_API_KEY environment variable not set")
            sys.exit(1)
        
        genai.configure(api_key=GEMINI_API_KEY)
        logger.info("Initialized Gemini API client")
    
    def initialize_vector_db(self, force_recreate: bool = False):
        """Initialize ChromaDB client and collection."""
        try:
            # Create persistent client with telemetry disabled
            self.chroma_client = chromadb.PersistentClient(
                path=CHROMA_DB_PATH,
                settings=Settings(anonymized_telemetry=False)
            )
            
            collection_name = self.collection_config['name']
            collection_description = self.collection_config['description']
            
            # Check if collection already exists
            existing_collections = [col.name for col in self.chroma_client.list_collections()]
            collection_exists = collection_name in existing_collections
            
            if collection_exists and not force_recreate:
                # Get existing collection and check if it has data
                self.collection = self.chroma_client.get_collection(name=collection_name)
                count = self.collection.count()
                if count > 0:
                    raise ValueError(f"Collection '{collection_name}' already exists with {count} chunks. "
                                   f"Use --force to recreate or run /gemini-update for incremental changes.")
            
            if collection_exists and force_recreate:
                # Delete existing collection and recreate
                logger.info(f"Deleting existing collection '{collection_name}' (force recreate)")
                self.chroma_client.delete_collection(name=collection_name)
            
            # Create new collection
            self.collection = self.chroma_client.get_or_create_collection(
                name=collection_name,
                metadata={"description": collection_description, "type": self.collection_type}
            )
            
            logger.info(f"Initialized ChromaDB at {CHROMA_DB_PATH}")
            logger.info(f"Collection '{collection_name}' ({self.collection_type}) ready")
            
        except ValueError as e:
            # Re-raise ValueError for user-facing errors
            raise e
        except Exception as e:
            logger.error(f"Failed to initialize vector database: {e}")
            sys.exit(1)
    
    def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for text using Gemini."""
        try:
            response = genai.embed_content(
                model="models/text-embedding-004",
                content=text
            )
            return response['embedding']
        except Exception as e:
            logger.error(f"Failed to generate embedding: {e}")
            return []
    
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
        """Add chunks to ChromaDB with embeddings."""
        if not chunks:
            return
        
        documents = []
        embeddings = []
        metadatas = []
        ids = []
        
        for chunk in chunks:
            # Generate embedding
            embedding = self.generate_embedding(chunk['content'])
            if not embedding:
                continue
            
            documents.append(chunk['content'])
            embeddings.append(embedding)
            metadatas.append(chunk['metadata'])
            ids.append(chunk['metadata']['chunk_id'])
        
        if documents:
            self.collection.add(
                documents=documents,
                embeddings=embeddings,
                metadatas=metadatas,
                ids=ids
            )
    
    def ingest_project(self, project_root: str, force_recreate: bool = False):
        """Ingest entire project into vector database."""
        logger.info(f"Starting ingestion of project: {project_root}")
        
        try:
            self.initialize_vector_db(force_recreate=force_recreate)
        except ValueError as e:
            logger.error(str(e))
            print(f"\n❌ {str(e)}")
            print("\n💡 Options:")
            print("   • Use --force to completely recreate the database")
            print("   • Use /gemini-update for incremental changes (coming soon)")
            print("   • Continue using existing database with /gemini queries")
            return False
        
        project_path = Path(project_root)
        if not project_path.exists():
            logger.error(f"Project path does not exist: {project_root}")
            return
        
        # First pass: count total files to process for progress tracking
        total_files = 0
        all_files = []
        for file_path in project_path.rglob('*'):
            if file_path.is_dir():
                continue
            # Filter by file extension with special JSON handling
            if file_path.suffix == '.json':
                # Only include important JSON config files
                if not any(pattern in file_path.name for pattern in INCLUDE_JSON_PATTERNS):
                    continue
            elif file_path.suffix not in VALID_EXTENSIONS:
                continue
            
            # Apply collection-specific filtering
            if not self._should_include_file(file_path):
                continue
            all_files.append(file_path)
            total_files += 1
        
        logger.info(f"Found {total_files} files to process")
        
        files_processed = 0
        chunks_created = 0
        
        # Process files with progress indicator
        for i, file_path in enumerate(all_files, 1):
            # Process file
            chunks = self.read_and_chunk_file(file_path)
            if chunks:
                self.add_chunks_to_db(chunks)
                files_processed += 1
                chunks_created += len(chunks)
                
                # Calculate progress percentage
                progress_pct = (i / total_files) * 100
                
                # Show progress every file for better feedback
                print(f"\r[{progress_pct:5.1f}%] Processing {i}/{total_files}: {file_path.name} ({len(chunks)} chunks)", end='', flush=True)
                
                # Log detailed progress every 10 files
                if files_processed % 10 == 0:
                    print()  # New line after progress indicator
                    logger.info(f"Progress: {files_processed}/{total_files} files processed, {chunks_created} total chunks")
            else:
                # Show skipped files too
                progress_pct = (i / total_files) * 100
                print(f"\r[{progress_pct:5.1f}%] Skipped {i}/{total_files}: {file_path.name} (empty/error)", end='', flush=True)
        
        print()  # Final newline after progress indicator
        logger.info(f"✅ Ingestion complete: {files_processed}/{total_files} files processed, {chunks_created} chunks created")
        logger.info(f"Collection type: {self.collection_type} ({self.collection_config['description']})")
        
        return True
    
    def _should_include_file(self, file_path: Path) -> bool:
        """Check if file should be included based on collection configuration."""
        file_path_str = str(file_path)
        
        # Check include paths (if specified, file must match at least one)
        include_paths = self.collection_config.get('include_paths', [])
        if include_paths:
            if not any(include_path in file_path_str for include_path in include_paths):
                return False
        
        # Check exclude paths (if any match, exclude the file)
        exclude_paths = self.collection_config.get('exclude_paths', [])
        if any(exclude_path in file_path_str for exclude_path in exclude_paths):
            return False
            
        return True
    
    def retrieve_context(self, query_text: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Retrieve relevant context using similarity search."""
        if not self.collection:
            self.initialize_vector_db()
        
        # Generate query embedding
        query_embedding = self.generate_embedding(query_text)
        if not query_embedding:
            logger.error("Failed to generate query embedding")
            return []
        
        # Search for similar chunks
        try:
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k
            )
            
            context_chunks = []
            if results['documents']:
                for i in range(len(results['documents'][0])):
                    context_chunks.append({
                        'content': results['documents'][0][i],
                        'metadata': results['metadatas'][0][i],
                        'distance': results['distances'][0][i] if results['distances'] else 0
                    })
            
            return context_chunks
            
        except Exception as e:
            logger.error(f"Failed to retrieve context: {e}")
            return []
    
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
        """Query Gemini with retrieved context."""
        logger.info(f"Processing query: {query}")
        
        # Retrieve relevant context
        context = self.retrieve_context(query)
        logger.info(f"Retrieved {len(context)} relevant chunks")
        
        # Construct augmented prompt
        prompt = self.construct_gemini_prompt(query, context)
        
        # Query local Gemini CLI instead of API
        try:
            # Call local Gemini CLI with prompt via stdin
            result = subprocess.run(['gemini', '--prompt', prompt], 
                                  capture_output=True, text=True, input='')
            
            if result.returncode == 0:
                return result.stdout.strip()
            else:
                logger.error(f"Local Gemini CLI failed: {result.stderr}")
                return f"Error calling local Gemini CLI: {result.stderr}"
            
        except Exception as e:
            logger.error(f"Failed to query local Gemini CLI: {e}")
            return f"Error generating response: {e}"


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Gemini RAG CLI for project-wide context retrieval",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    # Ingest project files
    python gemini_rag_cli.py ingest --project-root /path/to/bs-display/dev
    
    # Query with context
    python gemini_rag_cli.py query --query "How does the ProductCard component work?"
    
    # Debug query
    python gemini_rag_cli.py query --query "DEBUG ANALYSIS: images 404 on product pages"
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
    ingest_parser.add_argument(
        '--force',
        action='store_true',
        help='Force recreate database (deletes existing data)'
    )
    ingest_parser.add_argument(
        '--collection',
        choices=['codebase', 'blog', 'product-data', 'all'],
        default='codebase',
        help='Collection type to ingest (default: codebase)'
    )
    
    # Query command
    query_parser = subparsers.add_parser('query', help='Query project context using RAG')
    query_parser.add_argument(
        '--query',
        required=True,
        help='Query text to search for relevant context'
    )
    query_parser.add_argument(
        '--collection',
        choices=['codebase', 'blog', 'product-data', 'all'],
        default='codebase',
        help='Collection to query (default: codebase)'
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
    
    # Get collection type from args
    collection_type = getattr(args, 'collection', 'codebase')
    
    # Initialize RAG system
    rag_system = GeminiRAGSystem(collection_type=collection_type)
    
    # Execute command
    if args.command == 'ingest':
        logger.info("Ingest command: processing project files")
        force_recreate = getattr(args, 'force', False)
        if force_recreate:
            logger.info("Force flag detected: will recreate database")
        success = rag_system.ingest_project(args.project_root, force_recreate=force_recreate)
        if not success:
            sys.exit(1)
    
    elif args.command == 'query':
        response = rag_system.query_with_context(args.query)
        print("\n" + "="*80)
        print("GEMINI RESPONSE:")
        print("="*80)
        print(response)
        print("="*80)
    
    elif args.command == 'update':
        # For MVP, update = re-ingest
        logger.info("Update command: re-ingesting project")
        rag_system.ingest_project(args.project_root)


if __name__ == '__main__':
    main()