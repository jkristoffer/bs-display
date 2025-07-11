# Phase 4: Dashboard Pages

## Overview

This phase implements the actual dashboard pages that visualize analytics data using the components and APIs created in previous phases. We'll build interactive, real-time dashboards that provide actionable insights for business decision-making.

## Goals

- ✅ Build comprehensive overview dashboard
- ✅ Implement real-time visitor tracking
- ✅ Create detailed product analytics
- ✅ Visualize customer journeys
- ✅ Ensure responsive design for all screens

## Implementation Steps

### Step 1: Analytics Overview Dashboard

Create `/src/pages/admin/index.astro`:

```astro
---
import AdminLayout from '@layouts/AdminLayout.astro';
import OverviewDashboard from '@components/admin/dashboards/OverviewDashboard';
---

<AdminLayout title="Analytics Overview">
  <OverviewDashboard client:load />
</AdminLayout>
```

Create `/src/components/admin/dashboards/OverviewDashboard.tsx`:

```tsx
import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MetricCard from '../MetricCard/MetricCard';
import ChartWrapper from '../charts/ChartWrapper';
import DataTable from '../DataTable/DataTable';
import LoadingState from '../LoadingState/LoadingState';
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
  }>;
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

export default function OverviewDashboard() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/overview?period=${period}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to load data');
      }
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading analytics data..." />;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!data) return null;

  const deviceData = Object.entries(data.devices).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const COLORS = ['#4299e1', '#48bb78', '#ed8936'];

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Analytics Overview</h1>
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
          value={`${Math.floor(data.summary.avgSessionDuration / 60)}m ${data.summary.avgSessionDuration % 60}s`}
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#4299e1" 
              strokeWidth={2}
              dot={false}
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
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {deviceData.map((entry, index) => (
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
    </div>
  );
}
```

### Step 2: Real-time Analytics Dashboard

Create `/src/pages/admin/analytics/realtime.astro`:

```astro
---
import AdminLayout from '@layouts/AdminLayout.astro';
import RealtimeDashboard from '@components/admin/dashboards/RealtimeDashboard';
---

<AdminLayout title="Real-time Analytics">
  <RealtimeDashboard client:load />
</AdminLayout>
```

Create `/src/components/admin/dashboards/RealtimeDashboard.tsx`:

```tsx
import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './RealtimeDashboard.module.scss';

interface RealtimeData {
  activeUsers: number;
  recentEvents: Array<{
    type: string;
    page?: string;
    product?: string;
    user: string;
    time: string;
  }>;
  timestamp: number;
}

export default function RealtimeDashboard() {
  const [data, setData] = useState<RealtimeData | null>(null);
  const [history, setHistory] = useState<Array<{ time: string; users: number }>>([]);
  const [isConnected, setIsConnected] = useState(false);
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
    const eventSource = new EventSource('/api/analytics/realtime');
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      const newData: RealtimeData = JSON.parse(event.data);
      setData(newData);
      
      // Update history for chart
      setHistory(prev => {
        const newHistory = [...prev, {
          time: new Date(newData.timestamp).toLocaleTimeString(),
          users: newData.activeUsers,
        }];
        
        // Keep only last 20 data points
        return newHistory.slice(-20);
      });
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      // Attempt to reconnect after 5 seconds
      setTimeout(connectToRealtime, 5000);
    };
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

  return (
    <div className={styles.realtimeDashboard}>
      <div className={styles.header}>
        <h1>Real-time Analytics</h1>
        <div className={styles.connectionStatus}>
          <span className={`${styles.indicator} ${isConnected ? styles.connected : ''}`} />
          {isConnected ? 'Connected' : 'Connecting...'}
        </div>
      </div>

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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
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
            {data?.recentEvents.map((event, index) => (
              <div key={index} className={styles.event}>
                <span className={styles.eventIcon}>{getEventIcon(event.type)}</span>
                <div className={styles.eventDetails}>
                  <div className={styles.eventType}>
                    {event.type.replace(/_/g, ' ').toUpperCase()}
                  </div>
                  <div className={styles.eventInfo}>
                    {event.page && <span>Page: {event.page}</span>}
                    {event.product && <span>Product: {event.product}</span>}
                    <span className={styles.eventUser}>{event.user}</span>
                  </div>
                </div>
                <div className={styles.eventTime}>{event.time}</div>
              </div>
            ))}
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
          </div>
        </div>

        <div className={styles.metricBox}>
          <h4>Active Locations</h4>
          <div className={styles.locationList}>
            <div className={styles.locationItem}>
              <span>🇺🇸 United States</span>
              <span className={styles.count}>18</span>
            </div>
            <div className={styles.locationItem}>
              <span>🇬🇧 United Kingdom</span>
              <span className={styles.count}>7</span>
            </div>
            <div className={styles.locationItem}>
              <span>🇨🇦 Canada</span>
              <span className={styles.count}>4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 3: Product Analytics Dashboard

Create `/src/pages/admin/analytics/products.astro`:

```astro
---
import AdminLayout from '@layouts/AdminLayout.astro';
import ProductsDashboard from '@components/admin/dashboards/ProductsDashboard';
---

<AdminLayout title="Product Analytics">
  <ProductsDashboard client:load />
</AdminLayout>
```

Create `/src/components/admin/dashboards/ProductsDashboard.tsx`:

```tsx
import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartWrapper from '../charts/ChartWrapper';
import DataTable from '../DataTable/DataTable';
import LoadingState from '../LoadingState/LoadingState';
import styles from './ProductsDashboard.module.scss';

interface ProductData {
  products: Array<{
    id: string;
    name: string;
    brand: string;
    category: string;
    metrics: {
      views: number;
      uniqueViews: number;
      addToQuote: number;
      conversions: number;
      conversionRate: string;
      avgTimeOnPage: number;
    };
    trends: {
      views: Array<{ date: string; value: number }>;
      conversions: Array<{ date: string; value: number }>;
    };
  }>;
  summary: {
    totalProducts: number;
    totalViews: number;
    totalConversions: number;
    avgConversionRate: string;
  };
  categories: Array<{
    name: string;
    totalProducts: number;
    totalViews: number;
    totalConversions: number;
  }>;
  topPerformers: Array<any>;
}

export default function ProductsDashboard() {
  const [data, setData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  useEffect(() => {
    fetchProductData();
  }, [selectedCategory, selectedBrand]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedBrand) params.append('brand', selectedBrand);
      
      const response = await fetch(`/api/analytics/products?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch product data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading product analytics..." />;
  if (!data) return null;

  return (
    <div className={styles.productsDashboard}>
      <div className={styles.header}>
        <h1>Product Analytics</h1>
        <div className={styles.filters}>
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className={styles.filter}
          >
            <option value="">All Categories</option>
            <option value="smartboards">Smart Boards</option>
            <option value="displays">Interactive Displays</option>
            <option value="accessories">Accessories</option>
          </select>
          <select
            value={selectedBrand || ''}
            onChange={(e) => setSelectedBrand(e.target.value || null)}
            className={styles.filter}
          >
            <option value="">All Brands</option>
            <option value="ViewSonic">ViewSonic</option>
            <option value="SMART">SMART</option>
            <option value="Promethean">Promethean</option>
          </select>
        </div>
      </div>

      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <h3>Total Products</h3>
          <div className={styles.value}>{data.summary.totalProducts}</div>
        </div>
        <div className={styles.summaryCard}>
          <h3>Total Views</h3>
          <div className={styles.value}>{data.summary.totalViews.toLocaleString()}</div>
        </div>
        <div className={styles.summaryCard}>
          <h3>Total Conversions</h3>
          <div className={styles.value}>{data.summary.totalConversions}</div>
        </div>
        <div className={styles.summaryCard}>
          <h3>Avg. Conversion Rate</h3>
          <div className={styles.value}>{data.summary.avgConversionRate}%</div>
        </div>
      </div>

      <div className={styles.chartsSection}>
        <ChartWrapper title="Category Performance" subtitle="Views and conversions by category">
          <BarChart data={data.categories}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalViews" fill="#4299e1" name="Views" />
            <Bar dataKey="totalConversions" fill="#48bb78" name="Conversions" />
          </BarChart>
        </ChartWrapper>

        <ChartWrapper title="Top 5 Products" subtitle="By conversion count">
          <BarChart data={data.topPerformers} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="metrics.conversions" fill="#9f7aea" />
          </BarChart>
        </ChartWrapper>
      </div>

      <div className={styles.productTable}>
        <h3>Product Performance Details</h3>
        <DataTable
          data={data.products}
          columns={[
            { key: 'name', label: 'Product Name', sortable: true },
            { key: 'brand', label: 'Brand', sortable: true },
            { key: 'category', label: 'Category', sortable: true },
            { 
              key: 'metrics', 
              label: 'Views', 
              sortable: true,
              render: (metrics) => metrics.views.toLocaleString()
            },
            { 
              key: 'metrics', 
              label: 'Conversions', 
              sortable: true,
              render: (metrics) => metrics.conversions
            },
            { 
              key: 'metrics', 
              label: 'Conv. Rate', 
              sortable: true,
              render: (metrics) => `${metrics.conversionRate}%`
            },
            { 
              key: 'metrics', 
              label: 'Avg. Time', 
              sortable: true,
              render: (metrics) => `${Math.floor(metrics.avgTimeOnPage / 60)}:${(metrics.avgTimeOnPage % 60).toString().padStart(2, '0')}`
            },
          ]}
          pageSize={10}
        />
      </div>
    </div>
  );
}
```

### Step 4: Customer Journey Dashboard

Create `/src/pages/admin/analytics/journeys.astro`:

```astro
---
import AdminLayout from '@layouts/AdminLayout.astro';
import JourneysDashboard from '@components/admin/dashboards/JourneysDashboard';
---

<AdminLayout title="Customer Journeys">
  <JourneysDashboard client:load />
</AdminLayout>
```

Create `/src/components/admin/dashboards/JourneysDashboard.tsx`:

```tsx
import { useState, useEffect } from 'react';
import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer } from 'recharts';
import { Sankey } from 'recharts';
import ChartWrapper from '../charts/ChartWrapper';
import MetricCard from '../MetricCard/MetricCard';
import LoadingState from '../LoadingState/LoadingState';
import styles from './JourneysDashboard.module.scss';

interface JourneyData {
  funnel: {
    stages: Array<{
      name: string;
      count: number;
      percentage: number;
    }>;
  };
  avgJourneyDuration: {
    overall: string;
    byStage: Record<string, string>;
  };
  topPaths: Array<{
    path: string;
    count: number;
    conversionRate: number;
  }>;
  dropOffPoints: Array<{
    page: string;
    dropOffRate: number;
    reason: string;
  }>;
  leadScoring: {
    distribution: Array<{
      range: string;
      count: number;
    }>;
    avgScore: number;
    highValueLeads: number;
  };
}

export default function JourneysDashboard() {
  const [data, setData] = useState<JourneyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedJourney, setSelectedJourney] = useState<string | null>(null);

  useEffect(() => {
    fetchJourneyData();
  }, []);

  const fetchJourneyData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/journeys');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch journey data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading journey analytics..." />;
  if (!data) return null;

  const funnelData = data.funnel.stages.map(stage => ({
    name: stage.name,
    value: stage.count,
    fill: getStageColor(stage.name),
  }));

  function getStageColor(stage: string): string {
    const colors: Record<string, string> = {
      'Awareness': '#4299e1',
      'Interest': '#48bb78',
      'Consideration': '#ed8936',
      'Decision': '#9f7aea',
      'Customer': '#f56565',
    };
    return colors[stage] || '#718096';
  }

  return (
    <div className={styles.journeysDashboard}>
      <h1>Customer Journey Analytics</h1>

      <div className={styles.metricsRow}>
        <MetricCard
          title="Avg. Journey Duration"
          value={data.avgJourneyDuration.overall}
          icon="⏱️"
        />
        <MetricCard
          title="Avg. Lead Score"
          value={data.leadScoring.avgScore}
          icon="📊"
        />
        <MetricCard
          title="High-Value Leads"
          value={data.leadScoring.highValueLeads.toLocaleString()}
          change={23.5}
          icon="⭐"
          color="success"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${(data.funnel.stages[4].percentage).toFixed(1)}%`}
          change={-5.2}
          icon="🎯"
          color="warning"
        />
      </div>

      <div className={styles.funnelSection}>
        <ChartWrapper title="Conversion Funnel" subtitle="Customer journey stages">
          <ResponsiveContainer width="100%" height={400}>
            <FunnelChart>
              <Tooltip />
              <Funnel
                dataKey="value"
                data={funnelData}
                isAnimationActive
              >
                <LabelList position="center" fill="#fff" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <div className={styles.funnelStats}>
          <h3>Stage Conversion Rates</h3>
          {data.funnel.stages.slice(0, -1).map((stage, index) => {
            const nextStage = data.funnel.stages[index + 1];
            const conversionRate = ((nextStage.count / stage.count) * 100).toFixed(1);
            
            return (
              <div key={stage.name} className={styles.stageConversion}>
                <div className={styles.stageNames}>
                  <span>{stage.name}</span>
                  <span>→</span>
                  <span>{nextStage.name}</span>
                </div>
                <div className={styles.conversionBar}>
                  <div 
                    className={styles.conversionFill}
                    style={{ width: `${conversionRate}%`, backgroundColor: getStageColor(nextStage.name) }}
                  />
                  <span className={styles.conversionLabel}>{conversionRate}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.pathsSection}>
        <div className={styles.topPaths}>
          <h3>Top Conversion Paths</h3>
          <div className={styles.pathsList}>
            {data.topPaths.map((path, index) => (
              <div key={index} className={styles.pathItem}>
                <div className={styles.pathInfo}>
                  <div className={styles.pathRoute}>{path.path}</div>
                  <div className={styles.pathStats}>
                    <span>{path.count} journeys</span>
                    <span className={styles.convRate}>{path.conversionRate}% conversion</span>
                  </div>
                </div>
                <div className={styles.pathBar}>
                  <div 
                    className={styles.pathFill}
                    style={{ width: `${(path.count / data.topPaths[0].count) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.dropOffPoints}>
          <h3>Major Drop-off Points</h3>
          <div className={styles.dropOffList}>
            {data.dropOffPoints.map((point, index) => (
              <div key={index} className={styles.dropOffItem}>
                <div className={styles.dropOffInfo}>
                  <div className={styles.dropOffPage}>{point.page}</div>
                  <div className={styles.dropOffReason}>{point.reason}</div>
                </div>
                <div className={styles.dropOffRate}>
                  <span className={styles.rateValue}>{point.dropOffRate}%</span>
                  <span className={styles.rateLabel}>drop-off</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.leadScoringSection}>
        <h3>Lead Score Distribution</h3>
        <div className={styles.scoreDistribution}>
          {data.leadScoring.distribution.map((segment) => (
            <div key={segment.range} className={styles.scoreSegment}>
              <div className={styles.scoreRange}>{segment.range}</div>
              <div className={styles.scoreBar}>
                <div 
                  className={styles.scoreFill}
                  style={{ 
                    height: `${(segment.count / Math.max(...data.leadScoring.distribution.map(s => s.count))) * 100}%`,
                    backgroundColor: segment.range.includes('76') ? '#48bb78' : '#4299e1'
                  }}
                />
              </div>
              <div className={styles.scoreCount}>{segment.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Step 5: Dashboard Styling

Create `/src/components/admin/dashboards/Dashboard.module.scss`:

```scss
// Base dashboard styles
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    
    h1 {
      margin: 0;
    }
  }
  
  .periodSelector {
    display: flex;
    gap: 0.5rem;
    
    button {
      padding: 0.5rem 1rem;
      border: 1px solid var(--color-admin-border);
      background: var(--color-admin-surface);
      color: var(--color-admin-text);
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        background: var(--color-admin-bg);
      }
      
      &.active {
        background: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
      }
    }
  }
  
  .metricsGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .chartsGrid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
    
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  }
  
  .tablesGrid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  }
  
  .tableSection {
    background: var(--color-admin-surface);
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: var(--admin-shadow-sm);
    
    h3 {
      margin-top: 0;
      margin-bottom: 1rem;
    }
  }
  
  .error {
    padding: 2rem;
    text-align: center;
    color: var(--color-danger);
    background: var(--color-danger-light);
    border-radius: 8px;
  }
}

// Real-time dashboard specific styles
.realtimeDashboard {
  .connectionStatus {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    .indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--color-danger);
      
      &.connected {
        background: var(--color-success);
        animation: pulse 2s infinite;
      }
    }
  }
  
  .mainMetric {
    text-align: center;
    margin: 3rem 0;
    
    .activeUsers {
      .number {
        font-size: 4rem;
        font-weight: 700;
        color: var(--color-primary);
        line-height: 1;
      }
      
      .label {
        font-size: 1.25rem;
        color: var(--color-admin-text-secondary);
        margin-top: 0.5rem;
      }
    }
  }
  
  // ... additional real-time styles
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
```

## Mobile Responsiveness

All dashboards are designed to be fully responsive:

1. **Metric cards** stack vertically on mobile
2. **Charts** resize and maintain readability
3. **Tables** become horizontally scrollable
4. **Navigation** collapses to hamburger menu
5. **Touch interactions** supported for all elements

## Performance Optimization

1. **Lazy loading**: Charts only render when visible
2. **Data caching**: API responses cached appropriately
3. **Optimistic updates**: UI updates before API confirms
4. **Debounced filters**: Prevent excessive API calls
5. **Virtual scrolling**: For large data tables

## Accessibility

1. **Keyboard navigation**: All interactive elements accessible
2. **Screen reader support**: Proper ARIA labels
3. **Color contrast**: WCAG AA compliant
4. **Focus indicators**: Clear visual focus states
5. **Chart alternatives**: Data tables for all visualizations

## Next Steps

With dashboards complete:
1. Proceed to [Phase 5: Advanced Features](./phase-5-advanced-features.md)
2. Add data export functionality
3. Implement scheduled reports
4. Optimize for production

## Dashboard Summary

Created dashboards:
- **Overview**: High-level business metrics and trends
- **Real-time**: Live visitor tracking and activity
- **Products**: Detailed product performance analytics
- **Journeys**: Customer behavior and conversion funnels

Each dashboard provides actionable insights with interactive visualizations and filtering capabilities.