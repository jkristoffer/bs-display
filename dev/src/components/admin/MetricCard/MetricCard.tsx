import styles from './MetricCard.module.scss';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

export default function MetricCard({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon,
  color = 'primary'
}: MetricCardProps) {
  const changeClass = change !== undefined ? (change > 0 ? styles.positive : styles.negative) : '';
  
  return (
    <div className={`${styles.metricCard} ${styles[color]}`}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        <div className={styles.value}>{value}</div>
        {change !== undefined && (
          <div className={`${styles.change} ${changeClass}`}>
            <span className={styles.changeValue}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className={styles.changeLabel}>{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}