import React, { forwardRef } from 'react';
import styles from './Form.module.scss';

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'glass';
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ 
    label, 
    error, 
    variant = 'default',
    fullWidth = false,
    resize = 'vertical',
    className = '',
    ...props 
  }, ref) => {
    const textareaClasses = [
      styles.formTextarea,
      styles[`formTextarea--${variant}`],
      fullWidth ? styles['formTextarea--fullWidth'] : '',
      error ? styles['formTextarea--error'] : '',
      className
    ].filter(Boolean).join(' ');

    const textareaStyle = {
      resize,
      ...props.style
    };

    return (
      <div className={styles.formGroup}>
        {label && (
          <label className={styles.formLabel}>
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={textareaClasses}
          style={textareaStyle}
          {...props}
        />
        
        {error && (
          <span className={styles.formError}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';