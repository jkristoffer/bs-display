import styles from './LoadingState.module.scss';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function LoadingState({ 
  message = 'Loading...', 
  size = 'medium' 
}: LoadingStateProps) {
  return (
    <div className={`${styles.loadingState} ${styles[size]}`}>
      <div className={styles.spinner}>
        <div className={styles.bounce1}></div>
        <div className={styles.bounce2}></div>
        <div className={styles.bounce3}></div>
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}