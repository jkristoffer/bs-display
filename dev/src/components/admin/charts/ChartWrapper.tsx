import { ResponsiveContainer } from 'recharts';
import styles from './ChartWrapper.module.scss';

interface ChartWrapperProps {
  title: string;
  subtitle?: string;
  height?: number;
  children: React.ReactElement;
}

export default function ChartWrapper({
  title,
  subtitle,
  height = 300,
  children
}: ChartWrapperProps) {
  return (
    <div className={styles.chartWrapper}>
      <div className={styles.chartHeader}>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={height}>
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}