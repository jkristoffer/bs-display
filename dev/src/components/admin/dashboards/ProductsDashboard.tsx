import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ChartWrapper from '../charts/ChartWrapper';
import DataTable from '../DataTable/DataTable';
import LoadingState from '../LoadingState/LoadingState';
import ExportModal from '../ExportModal/ExportModal';
import styles from './ProductsDashboard.module.scss';

interface ProductData {
  products: Array<{
    id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    metrics: {
      views: number;
      uniqueViews: number;
      addToQuote: number;
      conversions: number;
      conversionRate: string;
      avgTimeOnPage: number;
      revenue: number;
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
    totalRevenue: number;
    avgConversionRate: string;
  };
  categories: Array<{
    category: string;
    totalProducts: number;
    totalViews: number;
    totalConversions: number;
    totalRevenue: number;
  }>;
  topPerformers: Array<any>;
  brands: Record<string, {
    products: number;
    views: number;
    conversions: number;
  }>;
}

export default function ProductsDashboard() {
  const [data, setData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    fetchProductData();
  }, [selectedCategory, selectedBrand]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedBrand) params.append('brand', selectedBrand);
      
      const response = await fetch(`/api/analytics/products?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to load product data');
      }
    } catch (err) {
      setError('Failed to fetch product data');
      console.error('Product fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading product analytics..." />;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!data) return <div className={styles.error}>No data available</div>;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const brandData = Object.entries(data.brands).map(([brand, metrics]) => ({
    name: brand,
    products: metrics.products,
    views: metrics.views,
    conversions: metrics.conversions,
  }));

  return (
    <div className={styles.productsDashboard}>
      <div className={styles.header}>
        <h1>Product Analytics</h1>
        <div className={styles.headerActions}>
          <div className={styles.filters}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.filter}
            >
              <option value="">All Categories</option>
              <option value="smartboards">Smart Boards</option>
              <option value="displays">Interactive Displays</option>
              <option value="accessories">Accessories</option>
              <option value="lecterns">Lecterns</option>
            </select>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className={styles.filter}
            >
              <option value="">All Brands</option>
              <option value="ViewSonic">ViewSonic</option>
              <option value="SMART">SMART</option>
              <option value="Promethean">Promethean</option>
              <option value="Newline">Newline</option>
              <option value="BenQ">BenQ</option>
            </select>
          </div>
          <button
            className={styles.exportButton}
            onClick={() => setShowExportModal(true)}
          >
            📊 Export Data
          </button>
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
          <h3>Total Revenue</h3>
          <div className={styles.value}>{formatCurrency(data.summary.totalRevenue)}</div>
        </div>
      </div>

      <div className={styles.chartsSection}>
        <ChartWrapper title="Category Performance" subtitle="Views and conversions by category">
          <BarChart data={data.categories}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="category" stroke="#718096" />
            <YAxis stroke="#718096" />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalViews" fill="#4299e1" name="Views" />
            <Bar dataKey="totalConversions" fill="#48bb78" name="Conversions" />
          </BarChart>
        </ChartWrapper>

        <ChartWrapper title="Brand Performance" subtitle="Views and conversions by brand">
          <BarChart data={brandData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#718096" />
            <YAxis stroke="#718096" />
            <Tooltip />
            <Legend />
            <Bar dataKey="views" fill="#9f7aea" name="Views" />
            <Bar dataKey="conversions" fill="#ed8936" name="Conversions" />
          </BarChart>
        </ChartWrapper>
      </div>

      <div className={styles.topPerformers}>
        <h3>Top 5 Products by Revenue</h3>
        <div className={styles.performersList}>
          {data.topPerformers.slice(0, 5).map((product, index) => (
            <div key={product.id} className={styles.performerItem}>
              <div className={styles.performerRank}>#{index + 1}</div>
              <div className={styles.performerInfo}>
                <div className={styles.performerName}>{product.name}</div>
                <div className={styles.performerBrand}>{product.brand}</div>
              </div>
              <div className={styles.performerMetrics}>
                <div className={styles.performerRevenue}>
                  {formatCurrency(product.metrics.revenue)}
                </div>
                <div className={styles.performerConversions}>
                  {product.metrics.conversions} sales
                </div>
              </div>
            </div>
          ))}
        </div>
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
              key: 'price', 
              label: 'Price', 
              sortable: true,
              render: (price) => formatCurrency(price)
            },
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
              label: 'Revenue', 
              sortable: true,
              render: (metrics) => formatCurrency(metrics.revenue)
            },
            { 
              key: 'metrics', 
              label: 'Conv. Rate', 
              sortable: true,
              render: (metrics) => `${metrics.conversionRate}%`
            },
          ]}
          pageSize={10}
        />
      </div>
      
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        dataType="products"
      />
    </div>
  );
}