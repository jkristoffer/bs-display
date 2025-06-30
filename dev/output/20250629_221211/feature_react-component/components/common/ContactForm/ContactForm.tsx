import { useState, FormEvent } from 'react';
import styles from './ContactForm.module.scss';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  onSubmit?: (data: FormData) => void;
  className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ 
  onSubmit,
  className = ''
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default: Send to API endpoint
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
      }
      
      // Reset form on success
      setFormData({ name: '', email: '', subject: '', message: '' });
      alert('Message sent successfully!');
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      className={`${styles.contactForm} ${className}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          Name <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`${styles.input} ${errors.name ? styles.error : ''}`}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <span id="name-error" className={styles.errorMessage}>
            {errors.name}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email <span className={styles.required}>*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`${styles.input} ${errors.email ? styles.error : ''}`}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" className={styles.errorMessage}>
            {errors.email}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="subject" className={styles.label}>
          Subject <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={`${styles.input} ${errors.subject ? styles.error : ''}`}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
        />
        {errors.subject && (
          <span id="subject-error" className={styles.errorMessage}>
            {errors.subject}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="message" className={styles.label}>
          Message <span className={styles.required}>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={`${styles.textarea} ${errors.message ? styles.error : ''}`}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <span id="message-error" className={styles.errorMessage}>
            {errors.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};