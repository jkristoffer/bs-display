import { useState } from 'react';
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

  const filteredFaqs = searchTerm
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : faqs;

  return (
    <div className={styles.faqPage}>
      <h1 className={styles.title}>{title}</h1>
      
      {searchable && (
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
            aria-label="Search FAQs"
          />
        </div>
      )}
      
      <div className={styles.faqList}>
        {filteredFaqs.length === 0 ? (
          <p className={styles.noResults}>No FAQs found matching your search.</p>
        ) : (
          filteredFaqs.map((faq) => (
            <div key={faq.id} className={styles.faqItem}>
              <button
                className={styles.question}
                onClick={() => toggleItem(faq.id)}
                aria-expanded={expandedItems.has(faq.id)}
              >
                <span>{faq.question}</span>
                <span className={styles.icon}>
                  {expandedItems.has(faq.id) ? '−' : '+'}
                </span>
              </button>
              {expandedItems.has(faq.id) && (
                <div className={styles.answer}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};