#!/usr/bin/env python3
"""
Test script for Google Gemini text-embedding-004 (FREE)
"""

import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def test_gemini_embeddings():
    """Test Google Gemini embeddings API"""
    
    # Set your API key here (or use environment variable)
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ Please set GEMINI_API_KEY environment variable")
        print("   export GEMINI_API_KEY='your_api_key_here'")
        return False
    
    try:
        # Configure Gemini API
        genai.configure(api_key=api_key)
        print("✅ API key configured successfully")
        
        # Test embedding generation
        text = "This is a test embedding for the BS Display project"
        print(f"🧪 Testing embedding for: '{text}'")
        
        response = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_document"
        )
        
        embedding = response['embedding']
        print(f"✅ Embedding generated successfully!")
        print(f"📊 Embedding dimensions: {len(embedding)}")
        print(f"🔢 First 5 values: {embedding[:5]}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == '__main__':
    print("🚀 Testing Google Gemini text-embedding-004 (FREE)")
    print("="*50)
    
    success = test_gemini_embeddings()
    
    if success:
        print("\n🎉 SUCCESS! Your free Gemini API is working!")
        print("💡 You can now use text-embedding-004 for free!")
    else:
        print("\n❌ Setup needed. Follow the steps above.")