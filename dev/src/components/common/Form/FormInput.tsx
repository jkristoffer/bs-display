import React, { forwardRef } from 'react';
import styles from './Form.module.scss';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'glass' | 'floating';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ 
    label, 
    error, 
    variant = 'default', 
    icon, 
    fullWidth = false,
    className = '',
    ...props 
  }, ref) => {
    const inputClasses = [
      styles.formInput,
      styles[`formInput--${variant}`],
      fullWidth ? styles['formInput--fullWidth'] : '',
      error ? styles['formInput--error'] : '',
      icon ? styles['formInput--withIcon'] : '',
      className
    ].filter(Boolean).join(' ');

    const groupClasses = [
      styles.formGroup,
      variant === 'floating' ? styles['formGroup--floating'] : ''
    ].filter(Boolean).join(' ');

    return (
      <div className={groupClasses}>
        {icon && <div className={styles.formIcon}>{icon}</div>}
        
        <input
          ref={ref}
          className={inputClasses}
          placeholder={variant === 'floating' ? ' ' : props.placeholder}
          {...props}
        />
        
        {label && (
          <label className={styles.formLabel}>
            {label}
          </label>
        )}
        
        {error && (
          <span className={styles.formError}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';