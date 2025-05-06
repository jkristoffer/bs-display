import styles from './FilterOption.module.css';

const FilterOption = ({
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
        />
        <span className={styles.checkmark}></span>
      </div>
      <div className={styles.labelText}>
        <span>{label}</span>
        {count !== undefined && <span className={styles.count}>({count})</span>}
      </div>
    </label>
  );
};

export default FilterOption;
