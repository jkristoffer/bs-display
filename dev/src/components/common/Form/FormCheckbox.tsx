import React, { forwardRef } from 'react';
import styles from './Form.module.scss';

export interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  variant?: 'default' | 'gradient';
  error?: string;
}

export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ 
    label, 
    description, 
    variant = 'default',
    error,
    className = '',
    ...props 
  }, ref) => {
    const checkboxClasses = [
      styles.formCheckbox,
      styles[`formCheckbox--${variant}`],
      error ? styles['formCheckbox--error'] : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={styles.formGroup}>
        <label className={checkboxClasses}>
          <input
            ref={ref}
            type="checkbox"
            className={styles.formCheckboxInput}
            {...props}
          />
          <span className={styles.formCheckboxMark}></span>
          <div className={styles.formCheckboxContent}>
            <span className={styles.formCheckboxLabel}>{label}</span>
            {description && (
              <span className={styles.formCheckboxDescription}>
                {description}
              </span>
            )}
          </div>
        </label>
        
        {error && (
          <span className={styles.formError}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

FormCheckbox.displayName = 'FormCheckbox';