import React from 'react';
import styles from './Card.module.scss';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'gradient' | 'outlined';
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export function Card({ 
  children, 
  variant = 'default', 
  hoverable = false, 
  padding = 'md',
  className = '',
  onClick 
}: CardProps) {
  const cardClasses = [
    styles.card,
    styles[`card--${variant}`],
    hoverable ? styles['card--hoverable'] : '',
    styles[`card--padding-${padding}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
}

export interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function CardImage({ src, alt, className = '' }: CardImageProps) {
  return (
    <div className={`${styles.cardImage} ${className}`}>
      <img src={src} alt={alt} />
    </div>
  );
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`${styles.cardContent} ${className}`}>
      {children}
    </div>
  );
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`${styles.cardFooter} ${className}`}>
      {children}
    </div>
  );
}

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`${styles.cardTitle} ${className}`}>
      {children}
    </h3>
  );
}

export interface CardTextProps {
  children: React.ReactNode;
  className?: string;
}

export function CardText({ children, className = '' }: CardTextProps) {
  return (
    <p className={`${styles.cardText} ${className}`}>
      {children}
    </p>
  );
}