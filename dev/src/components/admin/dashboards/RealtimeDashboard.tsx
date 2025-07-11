import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import LoadingState from '../LoadingState/LoadingState';
import styles from './RealtimeDashboard.module.scss';

interface RealtimeData {
  activeUsers: number;
  recentEvents: Array<{
    type: string;
    page?: string;
    product?: string;
    form?: string;
    user: string;
    time: string;
  }>;
  activeSessions?: Array<{
    sessionId: string;
    page: string;
    duration: number;
    country: string;
    countryName: string;
    device: string;
  }>;
  timestamp: number;
}

export default function RealtimeDashboard() {
  const [data, setData] = useState<RealtimeData | null>(null);
  const [history, setHistory] = useState<Array<{ time: string; users: number }>>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    connectToRealtime();
    
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const connectToRealtime = () => {
    try {
      const eventSource = new EventSource('/api/analytics/realtime');
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        setConnectionError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          const newData: RealtimeData = JSON.parse(event.data);
          setData(newData);
          
          // Update history for chart
          setHistory(prev => {
            const newHistory = [...prev, {
              time: new Date(newData.timestamp).toLocaleTimeString('en-US', {
                hour12: false,
                minute: '2-digit',
                second: '2-digit'
              }),
              users: newData.activeUsers,
            }];
            
            // Keep only last 20 data points
            return newHistory.slice(-20);
          });
        } catch (error) {
          console.error('Error parsing realtime data:', error);
        }
      };

      eventSource.onerror = () => {
        setIsConnected(false);
        setConnectionError('Connection lost. Attempting to reconnect...');
        eventSource.close();
        
        // Attempt to reconnect after 5 seconds
        setTimeout(connectToRealtime, 5000);
      };
    } catch (error) {
      setConnectionError('Failed to connect to real-time stream');
      console.error('EventSource error:', error);
    }
  };

  const getEventIcon = (type: string) => {
    const icons: Record<string, string> = {
      page_view: '📄',
      product_view: '📦',
      quiz_start: '❓',
      quiz_complete: '✅',
      form_submit: '📝',
      form_view: '👁️',
    };
    return icons[type] || '📌';
  };

  const getEventDescription = (event: any) => {
    switch (event.type) {
      case 'page_view':
        return `Viewed ${event.page}`;
      case 'product_view':
        return `Viewed ${event.product}`;
      case 'form_view':
        return `Viewed ${event.form} form`;
      case 'form_submit':
        return `Submitted ${event.form} form`;
      case 'quiz_start':
        return 'Started product quiz';
      case 'quiz_complete':
        return 'Completed product quiz';
      default:
        return event.type.replace(/_/g, ' ');
    }
  };

  if (!data && !connectionError) {
    return <LoadingState message="Connecting to real-time stream..." />;
  }

  return (
    <div className={styles.realtimeDashboard}>
      <div className={styles.header}>
        <h1>Real-time Analytics</h1>
        <div className={styles.connectionStatus}>
          <span className={`${styles.indicator} ${isConnected ? styles.connected : ''}`} />
          {isConnected ? 'Connected' : connectionError || 'Connecting...'}
        </div>
      </div>

      {connectionError && !data ? (
        <div className={styles.error}>
          <h3>Connection Error</h3>
          <p>{connectionError}</p>
          <button onClick={connectToRealtime} className={styles.retryButton}>
            Retry Connection
          </button>
        </div>
      ) : (
        <>
          <div className={styles.mainMetric}>
            <div className={styles.activeUsers}>
              <div className={styles.number}>{data?.activeUsers || 0}</div>
              <div className={styles.label}>Active Users Now</div>
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.chartSection}>
              <h3>Active Users (Last 2 Minutes)</h3>
              <div className={styles.chart}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" stroke="#718096" />
                    <YAxis stroke="#718096" />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#48bb78" 
                      strokeWidth={3}
                      dot={{ fill: '#48bb78', r: 4 }}
                      animationDuration={0}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.eventsSection}>
              <h3>Recent Activity</h3>
              <div className={styles.eventsList}>
                {data?.recentEvents && data.recentEvents.length > 0 ? (
                  data.recentEvents.map((event, index) => (
                    <div key={index} className={styles.event}>
                      <span className={styles.eventIcon}>{getEventIcon(event.type)}</span>
                      <div className={styles.eventDetails}>
                        <div className={styles.eventDescription}>
                          {getEventDescription(event)}
                        </div>
                        <div className={styles.eventMeta}>
                          <span className={styles.eventUser}>{event.user}</span>
                          <span className={styles.eventTime}>{event.time}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.noEvents}>No recent events</div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.additionalMetrics}>
            <div className={styles.metricBox}>
              <h4>Popular Pages Right Now</h4>
              <div className={styles.popularList}>
                <div className={styles.popularItem}>
                  <span>/products</span>
                  <span className={styles.count}>12</span>
                </div>
                <div className={styles.popularItem}>
                  <span>/quiz</span>
                  <span className={styles.count}>8</span>
                </div>
                <div className={styles.popularItem}>
                  <span>/products/smartboards</span>
                  <span className={styles.count}>6</span>
                </div>
                <div className={styles.popularItem}>
                  <span>/</span>
                  <span className={styles.count}>4</span>
                </div>
              </div>
            </div>

            {data?.activeSessions && (
              <div className={styles.metricBox}>
                <h4>Active Sessions</h4>
                <div className={styles.sessionsList}>
                  {data.activeSessions.slice(0, 5).map((session, index) => (
                    <div key={index} className={styles.sessionItem}>
                      <div className={styles.sessionInfo}>
                        <span className={styles.sessionPage}>{session.page}</span>
                        <span className={styles.sessionMeta}>
                          {session.countryName} • {session.device} • {Math.floor(session.duration / 60)}m
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}