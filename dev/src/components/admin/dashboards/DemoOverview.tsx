import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import MetricCard from '../MetricCard/MetricCard';
import ChartWrapper from '../charts/ChartWrapper';
import DataTable from '../DataTable/DataTable';
import styles from './DemoOverview.module.scss';

// Demo data
const trendData = [
  { date: 'Mon', visitors: 4000, pageViews: 12400 },
  { date: 'Tue', visitors: 3000, pageViews: 10398 },
  { date: 'Wed', visitors: 2000, pageViews: 9800 },
  { date: 'Thu', visitors: 2780, pageViews: 11908 },
  { date: 'Fri', visitors: 1890, pageViews: 8800 },
  { date: 'Sat', visitors: 2390, pageViews: 10800 },
  { date: 'Sun', visitors: 3490, pageViews: 14300 },
];

const topPages = [
  { path: '/', views: 12345, avgTime: 45, bounceRate: 35.2 },
  { path: '/products', views: 8765, avgTime: 120, bounceRate: 42.1 },
  { path: '/products/smartboards', views: 5432, avgTime: 180, bounceRate: 28.5 },
  { path: '/quiz', views: 3210, avgTime: 300, bounceRate: 15.3 },
  { path: '/blog', views: 2345, avgTime: 90, bounceRate: 55.7 },
];

export default function DemoOverview() {
  return (
    <div className={styles.demoOverview}>
      <div className={styles.header}>
        <h2>Dashboard Infrastructure Demo</h2>
        <p>This demonstrates the components created in Phase 2</p>
      </div>

      <div className={styles.metricsGrid}>
        <MetricCard
          title="Total Visitors"
          value="15,234"
          change={12.5}
          icon="👥"
          color="primary"
        />
        <MetricCard
          title="Page Views"
          value="45,678"
          change={8.3}
          icon="📄"
          color="success"
        />
        <MetricCard
          title="Avg. Session"
          value="4m 15s"
          change={-2.1}
          icon="⏱️"
          color="warning"
        />
        <MetricCard
          title="Conversion Rate"
          value="3.2%"
          change={15.7}
          icon="🎯"
          color="success"
        />
      </div>

      <div className={styles.chartsGrid}>
        <ChartWrapper title="Visitor Trends" subtitle="Last 7 days">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#718096" />
            <YAxis stroke="#718096" />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="visitors" 
              stroke="#4299e1" 
              strokeWidth={2}
              dot={{ fill: '#4299e1', r: 4 }}
            />
          </LineChart>
        </ChartWrapper>

        <ChartWrapper title="Page Views" subtitle="Last 7 days">
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#718096" />
            <YAxis stroke="#718096" />
            <Tooltip />
            <Bar dataKey="pageViews" fill="#48bb78" />
          </BarChart>
        </ChartWrapper>
      </div>

      <div className={styles.tableSection}>
        <h3>Top Pages</h3>
        <DataTable
          data={topPages}
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
    </div>
  );
}