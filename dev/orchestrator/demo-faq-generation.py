#!/usr/bin/env python3
"""
Demo: AI Task Compiler - FAQ Page Generation
Shows how the system works by simulating the complete workflow
"""

import json
from pathlib import Path
from datetime import datetime

# Colors for terminal output
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_header(title):
    print(f"\n{Colors.CYAN}{Colors.BOLD}{'='*60}{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}{title:^60}{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}{'='*60}{Colors.END}\n")

def print_step(step_num, description):
    print(f"{Colors.YELLOW}Step {step_num}:{Colors.END} {description}")

def simulate_faq_generation():
    """Simulate the complete FAQ page generation workflow"""
    
    print_header("AI Task Compiler - FAQ Page Generation Demo")
    
    # Step 1: User request
    print_step(1, "User Request")
    user_request = "build a FAQ page"
    print(f'User types: {Colors.GREEN}./ai "{user_request}"{Colors.END}')
    print()
    
    # Step 2: AI understands the request
    print_step(2, "AI Understanding")
    print(f"{Colors.BLUE}🤔 Understanding: {user_request}{Colors.END}")
    print(f"{Colors.GREEN}✨ Creating FAQ Page component{Colors.END}")
    print()
    
    # Step 3: Task parameters
    print_step(3, "Task Parameters Generated")
    task_params = {
        "template": "feature/react-component",
        "inputs": {
            "component_name": "FAQPage",
            "component_description": "FAQ page with expandable questions and search functionality",
            "category": "pages"
        }
    }
    print(f"Template: {Colors.CYAN}{task_params['template']}{Colors.END}")
    print(f"Component: {Colors.CYAN}{task_params['inputs']['component_name']}{Colors.END}")
    print(f"Category: {Colors.CYAN}{task_params['inputs']['category']}{Colors.END}")
    print()
    
    # Step 4: Template rendering
    print_step(4, "Template Rendering")
    print(f"Loading template: {Colors.CYAN}templates/feature/react-component.md{Colors.END}")
    print("Rendering with component-specific values...")
    print()
    
    # Step 5: Claude execution (simulated)
    print_step(5, "Claude Execution")
    print(f"Executing: {Colors.CYAN}claude --print (with rendered prompt){Colors.END}")
    print("Claude generates TypeScript, SCSS, and index files...")
    print()
    
    # Step 6: File creation
    print_step(6, "File Creation")
    output_dir = Path("demo_output/FAQPage")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Create FAQ component files
    files_created = []
    
    # FAQPage.tsx
    faq_tsx = """import { useState } from 'react';
import styles from './FAQPage.module.scss';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface FAQPageProps {
  faqs: FAQItem[];
  searchable?: boolean;
  title?: string;
}

export const FAQPage: React.FC<FAQPageProps> = ({ 
  faqs, 
  searchable = true,
  title = "Frequently Asked Questions"
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories
  const categories = ['all', ...new Set(faqs.map(faq => faq.category).filter(Boolean))];

  const toggleItem = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = !searchTerm || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.faqPage}>
      <h1 className={styles.title}>{title}</h1>
      
      {searchable && (
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
            aria-label="Search FAQs"
          />
          
          {categories.length > 1 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.categorySelect}
              aria-label="Filter by category"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
      
      <div className={styles.faqList}>
        {filteredFaqs.length === 0 ? (
          <p className={styles.noResults}>No FAQs found matching your criteria.</p>
        ) : (
          filteredFaqs.map((faq) => (
            <div key={faq.id} className={styles.faqItem}>
              <button
                className={styles.question}
                onClick={() => toggleItem(faq.id)}
                aria-expanded={expandedItems.has(faq.id)}
                aria-controls={`answer-${faq.id}`}
              >
                <span>{faq.question}</span>
                <span className={styles.icon}>
                  {expandedItems.has(faq.id) ? '−' : '+'}
                </span>
              </button>
              {expandedItems.has(faq.id) && (
                <div 
                  id={`answer-${faq.id}`}
                  className={styles.answer}
                  role="region"
                  aria-labelledby={`question-${faq.id}`}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};"""

    # FAQPage.module.scss
    faq_scss = """.faqPage {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.searchInput {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
}

.categorySelect {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #ccc;
  }
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }
}

.faqList {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.noResults {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
}

.faqItem {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
}

.question {
  width: 100%;
  padding: 1.25rem 1.5rem;
  background: white;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: left;
  color: #333;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:focus {
    outline: none;
    background-color: #f0f4f8;
  }
}

.icon {
  font-size: 1.5rem;
  color: #4a90e2;
  font-weight: 300;
  transition: transform 0.2s;
}

.answer {
  padding: 1.25rem 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}"""

    # index.ts
    index_ts = """export { FAQPage } from './FAQPage';
export type { FAQPageProps, FAQItem } from './FAQPage';"""

    # Create files
    files = [
        ("FAQPage.tsx", faq_tsx),
        ("FAQPage.module.scss", faq_scss),
        ("index.ts", index_ts)
    ]
    
    for filename, content in files:
        file_path = output_dir / filename
        with open(file_path, 'w') as f:
            f.write(content)
        files_created.append(str(file_path))
        print(f"  {Colors.GREEN}✓{Colors.END} Created: {file_path}")
    
    print()
    
    # Step 7: Validation
    print_step(7, "Validation & Code Review")
    print("Running validation checks...")
    print(f"  {Colors.GREEN}✓{Colors.END} TypeScript component found")
    print(f"  {Colors.GREEN}✓{Colors.END} SCSS module found")
    print(f"  {Colors.GREEN}✓{Colors.END} Index export found")
    print(f"  {Colors.GREEN}✓{Colors.END} Functional programming patterns used")
    print(f"  {Colors.GREEN}✓{Colors.END} TypeScript types defined")
    print()
    
    # Step 8: Results
    print_step(8, "Results Summary")
    session_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    results = {
        "session_id": session_id,
        "template": "feature/react-component",
        "component": "FAQPage",
        "files_created": len(files_created),
        "validation_score": 100,
        "code_review_score": 95
    }
    
    print(f"Session ID: {Colors.CYAN}{results['session_id']}{Colors.END}")
    print(f"Files Created: {Colors.GREEN}{results['files_created']}{Colors.END}")
    print(f"Validation Score: {Colors.GREEN}{results['validation_score']}/100{Colors.END}")
    print(f"Code Review Score: {Colors.GREEN}{results['code_review_score']}/100{Colors.END}")
    print()
    
    # Step 9: Usage example
    print_header("Usage Example")
    print("To use the generated FAQ component in your project:")
    print()
    print(f"{Colors.CYAN}```tsx")
    print("import { FAQPage } from './components/pages/FAQPage';")
    print("")
    print("const faqs = [")
    print("  {")
    print("    id: '1',")
    print("    question: 'What smartboards do you offer?',")
    print("    answer: 'We offer a wide range of interactive smartboards...',")
    print("    category: 'Products'")
    print("  },")
    print("  {")
    print("    id: '2',")
    print("    question: 'How do I get support?',")
    print("    answer: 'You can reach our support team via email or phone...',")
    print("    category: 'Support'")
    print("  }")
    print("];")
    print("")
    print("<FAQPage ")
    print("  faqs={faqs}")
    print("  searchable={true}")
    print("  title=\"Smartboard FAQs\"")
    print("/>")
    print(f"```{Colors.END}")
    print()
    
    # Save results
    results_file = output_dir / "generation_results.json"
    with open(results_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"{Colors.GREEN}{Colors.BOLD}✅ FAQ Page generation complete!{Colors.END}")
    print(f"Files saved to: {Colors.CYAN}{output_dir}{Colors.END}")
    print()

if __name__ == "__main__":
    simulate_faq_generation()