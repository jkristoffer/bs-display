#!/usr/bin/env python3
"""
Gemini RAG CLI - A tool for project-wide context retrieval using Gemini and ChromaDB.

This script provides functionality to:
1. Ingest project files into a vector database
2. Query the project context using RAG (Retrieval-Augmented Generation)
3. Generate context-aware responses using Gemini

Usage:
    python gemini_rag_cli.py ingest --project-root /path/to/project
    python gemini_rag_cli.py query --query "Your question here"
"""

import argparse
import os
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional
import logging

# Third-party imports
import google.generativeai as genai
import chromadb
from chromadb.config import Settings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
CHROMA_DB_PATH = os.path.join(os.path.dirname(__file__), 'chroma_db')
COLLECTION_NAME = 'codebase_memory'

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


class GeminiRAGSystem:
    """Main class for the RAG system."""
    
    def __init__(self):
        """Initialize the RAG system with Gemini and ChromaDB clients."""
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
    
    def initialize_vector_db(self):
        """Initialize ChromaDB client and collection."""
        try:
            # Create persistent client
            self.chroma_client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
            
            # Get or create collection
            self.collection = self.chroma_client.get_or_create_collection(
                name=COLLECTION_NAME,
                metadata={"description": "BS Display project codebase memory"}
            )
            
            logger.info(f"Initialized ChromaDB at {CHROMA_DB_PATH}")
            logger.info(f"Collection '{COLLECTION_NAME}' ready")
            
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
    
    def ingest_project(self, project_root: str):
        """Ingest entire project into vector database."""
        logger.info(f"Starting ingestion of project: {project_root}")
        
        self.initialize_vector_db()
        
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
        
        # Query Gemini
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt)
            
            return response.text
            
        except Exception as e:
            logger.error(f"Failed to query Gemini: {e}")
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
    rag_system = GeminiRAGSystem()
    
    # Execute command
    if args.command == 'ingest':
        rag_system.ingest_project(args.project_root)
    
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