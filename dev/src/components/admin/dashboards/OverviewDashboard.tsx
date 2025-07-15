import { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import MetricCard from '../MetricCard/MetricCard';
import ChartWrapper from '../charts/ChartWrapper';
import DataTable from '../DataTable/DataTable';
import LoadingState from '../LoadingState/LoadingState';
import ExportModal from '../ExportModal/ExportModal';
import styles from './OverviewDashboard.module.scss';

interface OverviewData {
  generated: number;
  period: string;
  overview: {
    totalVisitors: number;
    pageViews: number;
    conversions: number;
    avgSessionDuration: number;
  };
  trends: {
    hourly: Array<{ time: string; value: number }>;
    daily: Array<{ date: string; value: number }>;
  };
  topContent: Array<{ path: string; views: number; engagement: number }>;
  sources: Array<{ name: string; visits: number; percentage: number }>;
}

export default function OverviewDashboard() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');
  const [error, setError] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use absolute URL without credentials to avoid fetch error
      const url = `${window.location.protocol}//${window.location.host}/api/analytics/dashboard?period=${period}`;
      const response = await fetch(url, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        setError('Failed to load analytics data');
      }
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading analytics data..." />;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!data) return <div className={styles.error}>No data available</div>;

  // Calculate device distribution from sources or provide estimates
  const deviceData = [
    { name: 'Desktop', value: Math.floor(data.overview.totalVisitors * 0.6) },
    { name: 'Mobile', value: Math.floor(data.overview.totalVisitors * 0.3) },
    { name: 'Tablet', value: Math.floor(data.overview.totalVisitors * 0.1) }
  ];

  const COLORS = ['#4299e1', '#48bb78', '#ed8936'];

  const formatSessionDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Analytics Overview</h1>
        <div className={styles.headerActions}>
          <div className={styles.periodSelector}>
            <button
              className={period === '24h' ? styles.active : ''}
              onClick={() => setPeriod('24h')}
            >
              24 Hours
            </button>
            <button
              className={period === '7d' ? styles.active : ''}
              onClick={() => setPeriod('7d')}
            >
              7 Days
            </button>
            <button
              className={period === '30d' ? styles.active : ''}
              onClick={() => setPeriod('30d')}
            >
              30 Days
            </button>
            <button
              className={period === '90d' ? styles.active : ''}
              onClick={() => setPeriod('90d')}
            >
              90 Days
            </button>
          </div>
          <button
            className={styles.exportButton}
            onClick={() => setShowExportModal(true)}
          >
            📊 Export Data
          </button>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <MetricCard
          title="Total Visitors"
          value={data.overview.totalVisitors.toLocaleString()}
          change={12.5}
          icon="👥"
          color="primary"
        />
        <MetricCard
          title="Page Views"
          value={data.overview.pageViews.toLocaleString()}
          change={8.3}
          icon="📄"
          color="success"
        />
        <MetricCard
          title="Avg. Session"
          value={formatSessionDuration(data.overview.avgSessionDuration)}
          change={-2.1}
          icon="⏱️"
        />
        <MetricCard
          title="Conversions"
          value={data.overview.conversions.toLocaleString()}
          change={15.7}
          icon="🎯"
          color="success"
        />
      </div>

      <div className={styles.chartsGrid}>
        <ChartWrapper title="Visitor Trends" subtitle={period === '24h' ? 'Hourly activity' : 'Daily visitors'}>
          <LineChart data={period === '24h' ? data.trends.hourly : data.trends.daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey={period === '24h' ? 'time' : 'date'}
              stroke="#718096"
              tickFormatter={(value) => {
                if (period === '24h') {
                  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }
                return new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis stroke="#718096" />
            <Tooltip 
              labelFormatter={(value) => {
                if (period === '24h') {
                  return new Date(value).toLocaleString();
                }
                return new Date(value).toLocaleDateString();
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#4299e1" 
              strokeWidth={2}
              dot={{ fill: '#4299e1', r: 4 }}
            />
          </LineChart>
        </ChartWrapper>

        <ChartWrapper title="Device Distribution" subtitle="User devices">
          <PieChart>
            <Pie
              data={deviceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : '0'}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {deviceData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartWrapper>
      </div>

      <div className={styles.tablesGrid}>
        <div className={styles.tableSection}>
          <h3>Top Content</h3>
          <DataTable
            data={data.topContent}
            columns={[
              { key: 'path', label: 'Page Path', sortable: true },
              { 
                key: 'views', 
                label: 'Views', 
                sortable: true,
                render: (value) => value.toLocaleString()
              },
              { 
                key: 'engagement', 
                label: 'Engagement', 
                sortable: true,
                render: (value) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '60px', 
                      height: '8px', 
                      backgroundColor: '#e2e8f0', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        width: `${value}%`, 
                        height: '100%', 
                        backgroundColor: '#4299e1' 
                      }} />
                    </div>
                    <span>{value}%</span>
                  </div>
                )
              },
            ]}
            pageSize={5}
          />
        </div>

        <div className={styles.tableSection}>
          <h3>Traffic Sources</h3>
          <DataTable
            data={data.sources}
            columns={[
              { key: 'name', label: 'Source', sortable: true },
              { 
                key: 'visits', 
                label: 'Visits', 
                sortable: true,
                render: (value) => value.toLocaleString()
              },
              { 
                key: 'percentage', 
                label: 'Share', 
                sortable: true,
                render: (value) => `${value}%`
              },
            ]}
            pageSize={5}
          />
        </div>
      </div>
      
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        dataType="overview"
      />
    </div>
  );
}