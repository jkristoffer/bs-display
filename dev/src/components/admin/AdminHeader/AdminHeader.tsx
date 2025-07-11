import { useState, useEffect } from 'react';
import styles from './AdminHeader.module.scss';

interface AdminHeaderProps {
  title: string;
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [username, setUsername] = useState('Admin');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Get username from environment or localStorage
    const storedUsername = localStorage.getItem('adminUsername') || 'Admin';
    setUsername(storedUsername);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <header className={styles.adminHeader}>
      <div className={styles.headerLeft}>
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>
      
      <div className={styles.headerRight}>
        <div className={styles.dateTime}>
          <span className={styles.time}>{formatTime(currentTime)}</span>
          <span className={styles.date}>{formatDate(currentTime)}</span>
        </div>
        
        <div className={styles.userMenu}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{username}</span>
            <span className={styles.userRole}>Administrator</span>
          </div>
          <div className={styles.userAvatar}>
            {username.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}