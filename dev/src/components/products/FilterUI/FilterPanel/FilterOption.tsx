import React from 'react';
import styles from './FilterOption.module.scss';
import type { FilterOptionProps } from '../../../../types/product';

const FilterOption: React.FC<FilterOptionProps> = ({
  label,
  checked,
  onChange,
  count,
  disabled = false
}) => {
  return (
    <label
      className={`${styles.optionLabel} ${disabled ? styles.disabled : ''}`}
    >
      <div className={styles.checkbox}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={styles.input}
          aria-describedby={count !== undefined ? `${label}-count` : undefined}
        />
        <span className={styles.checkmark} aria-hidden="true"></span>
      </div>
      <div className={styles.labelText}>
        <span>{label}</span>
        {count !== undefined && (
          <span 
            className={styles.count} 
            id={`${label}-count`}
            aria-label={`${count} products available`}
          >
            ({count})
          </span>
        )}
      </div>
    </label>
  );
};

export default FilterOption;