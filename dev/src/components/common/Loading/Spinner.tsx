import React from 'react';
import styles from './Loading.module.scss';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'gradient' | 'white';
  className?: string;
}

export function Spinner({ size = 'md', variant = 'default', className = '' }: SpinnerProps) {
  const spinnerClasses = [
    styles.spinner,
    styles[`spinner--${size}`],
    styles[`spinner--${variant}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={spinnerClasses} role="status" aria-label="Loading">
      <div className={styles.spinnerInner}></div>
    </div>
  );
}

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
  className?: string;
}

export function Skeleton({ 
  width, 
  height, 
  variant = 'rectangular', 
  className = '' 
}: SkeletonProps) {
  const skeletonClasses = [
    styles.skeleton,
    styles[`skeleton--${variant}`],
    className
  ].filter(Boolean).join(' ');

  const skeletonStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div 
      className={skeletonClasses} 
      style={skeletonStyle}
      aria-hidden="true"
    />
  );
}

export interface LoadingOverlayProps {
  visible: boolean;
  variant?: 'default' | 'glass';
  message?: string;
  children?: React.ReactNode;
}

export function LoadingOverlay({ 
  visible, 
  variant = 'default', 
  message, 
  children 
}: LoadingOverlayProps) {
  if (!visible) return null;

  const overlayClasses = [
    styles.loadingOverlay,
    styles[`loadingOverlay--${variant}`]
  ].filter(Boolean).join(' ');

  return (
    <div className={overlayClasses}>
      <div className={styles.loadingContent}>
        <Spinner size="lg" variant={variant === 'glass' ? 'white' : 'default'} />
        {message && (
          <p className={styles.loadingMessage}>
            {message}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

export interface ProgressBarProps {
  progress: number; // 0-100
  variant?: 'default' | 'gradient';
  showPercentage?: boolean;
  height?: number;
  className?: string;
}

export function ProgressBar({ 
  progress, 
  variant = 'default', 
  showPercentage = false,
  height = 8,
  className = '' 
}: ProgressBarProps) {
  const progressClasses = [
    styles.progressBar,
    styles[`progressBar--${variant}`],
    className
  ].filter(Boolean).join(' ');

  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={progressClasses}>
      <div 
        className={styles.progressTrack} 
        style={{ height: `${height}px` }}
      >
        <div 
          className={styles.progressFill}
          style={{ 
            width: `${clampedProgress}%`,
            height: `${height}px`
          }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showPercentage && (
        <span className={styles.progressPercentage}>
          {Math.round(clampedProgress)}%
        </span>
      )}
    </div>
  );
}