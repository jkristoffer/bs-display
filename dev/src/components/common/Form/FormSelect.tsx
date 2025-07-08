import React, { forwardRef } from 'react';
import styles from './Form.module.scss';

export interface FormSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'glass';
  options: FormSelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ 
    label, 
    error, 
    variant = 'default',
    options,
    placeholder,
    fullWidth = false,
    className = '',
    ...props 
  }, ref) => {
    const selectClasses = [
      styles.formSelect,
      styles[`formSelect--${variant}`],
      fullWidth ? styles['formSelect--fullWidth'] : '',
      error ? styles['formSelect--error'] : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={styles.formGroup}>
        {label && (
          <label className={styles.formLabel}>
            {label}
          </label>
        )}
        
        <div className={styles.formSelectWrapper}>
          <select
            ref={ref}
            className={selectClasses}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className={styles.formSelectIcon}>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {error && (
          <span className={styles.formError}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';