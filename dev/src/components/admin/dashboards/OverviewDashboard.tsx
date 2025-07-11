import { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import MetricCard from '../MetricCard/MetricCard';
import ChartWrapper from '../charts/ChartWrapper';
import DataTable from '../DataTable/DataTable';
import LoadingState from '../LoadingState/LoadingState';
import ExportModal from '../ExportModal/ExportModal';
import styles from './OverviewDashboard.module.scss';

interface OverviewData {
  summary: {
    totalVisitors: number;
    uniqueVisitors: number;
    pageViews: number;
    avgSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
  };
  trends: {
    visitors: Array<{ date: string; value: number }>;
    pageViews: Array<{ date: string; value: number }>;
    conversions: Array<{ date: string; value: number }>;
  };
  topPages: Array<{
    path: string;
    views: number;
    avgTime: number;
    bounceRate: number;
  }>;
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  referrers: Array<{
    source: string;
    visits: number;
    percentage: number;
  }>;
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
      const response = await fetch(`/api/analytics/overview?period=${period}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to load data');
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

  const deviceData = Object.entries(data.devices).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

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
          value={data.summary.totalVisitors.toLocaleString()}
          change={12.5}
          icon="👥"
          color="primary"
        />
        <MetricCard
          title="Page Views"
          value={data.summary.pageViews.toLocaleString()}
          change={8.3}
          icon="📄"
          color="success"
        />
        <MetricCard
          title="Avg. Session"
          value={formatSessionDuration(data.summary.avgSessionDuration)}
          change={-2.1}
          icon="⏱️"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${data.summary.conversionRate}%`}
          change={15.7}
          icon="🎯"
          color="success"
        />
      </div>

      <div className={styles.chartsGrid}>
        <ChartWrapper title="Visitor Trends" subtitle="Daily unique visitors">
          <LineChart data={data.trends.visitors}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#718096" />
            <YAxis stroke="#718096" />
            <Tooltip />
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
          <h3>Top Pages</h3>
          <DataTable
            data={data.topPages}
            columns={[
              { key: 'path', label: 'Page Path', sortable: true },
              { 
                key: 'views', 
                label: 'Views', 
                sortable: true,
                render: (value) => value.toLocaleString()
              },
              { 
                key: 'avgTime', 
                label: 'Avg. Time', 
                sortable: true,
                render: (value) => `${value}s`
              },
              { 
                key: 'bounceRate', 
                label: 'Bounce Rate', 
                sortable: true,
                render: (value) => `${value}%`
              },
            ]}
            pageSize={5}
          />
        </div>

        <div className={styles.tableSection}>
          <h3>Traffic Sources</h3>
          <DataTable
            data={data.referrers || []}
            columns={[
              { key: 'source', label: 'Source', sortable: true },
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