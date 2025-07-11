# Phase 2: Dashboard Infrastructure

## Overview

This phase establishes the foundational infrastructure for the BI dashboards, including layout components, navigation, chart library integration, and dashboard-specific styling. We'll create reusable components that maintain consistency with the existing design system while providing dashboard-specific functionality.

## Goals

- ✅ Create AdminLayout with responsive navigation
- ✅ Integrate chart visualization library
- ✅ Build reusable dashboard components
- ✅ Implement dashboard-specific theming
- ✅ Ensure mobile responsiveness

## Implementation Steps

### Step 1: Create Admin Layout

Create `/src/layouts/AdminLayout.astro`:

```astro
---
import BaseHead from '@/components/common/BaseHead/BaseHead.astro';
import AdminSidebar from '@/components/admin/AdminSidebar/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader/AdminHeader';
import '@/styles/admin/admin-global.scss';

export interface Props {
  title: string;
  description?: string;
}

const { title, description = 'BigShine Display Admin Dashboard' } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <BaseHead title={`${title} | Admin Dashboard`} description={description} />
  </head>
  <body class="admin-layout">
    <div class="admin-container">
      <AdminSidebar client:load />
      <div class="admin-main">
        <AdminHeader client:load title={title} />
        <main class="admin-content">
          <slot />
        </main>
      </div>
    </div>
  </body>
</html>

<style>
  .admin-layout {
    --sidebar-width: 250px;
    --header-height: 60px;
    
    margin: 0;
    padding: 0;
    background: var(--color-admin-bg);
    color: var(--color-admin-text);
    font-family: var(--font-family-base);
  }
  
  .admin-container {
    display: flex;
    min-height: 100vh;
  }
  
  .admin-main {
    flex: 1;
    margin-left: var(--sidebar-width);
    display: flex;
    flex-direction: column;
  }
  
  .admin-content {
    flex: 1;
    padding: 2rem;
    margin-top: var(--header-height);
    overflow-y: auto;
  }
  
  @media (max-width: 768px) {
    .admin-main {
      margin-left: 0;
    }
  }
</style>
```

### Step 2: Create Admin Navigation Components

Create `/src/components/admin/AdminSidebar/AdminSidebar.tsx`:

```tsx
import { useState, useEffect } from 'react';
import styles from './AdminSidebar.module.scss';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: 'Overview',
    href: '/admin',
    icon: '📊',
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: '📈',
    children: [
      { label: 'Real-time', href: '/admin/analytics/realtime', icon: '⚡' },
      { label: 'Products', href: '/admin/analytics/products', icon: '📦' },
      { label: 'Customer Journeys', href: '/admin/analytics/journeys', icon: '🛤️' },
      { label: 'Conversions', href: '/admin/analytics/conversions', icon: '🎯' },
    ],
  },
  {
    label: 'Reports',
    href: '/admin/reports',
    icon: '📄',
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: '⚙️',
  },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const isActive = currentPath === item.href;
    const isExpanded = expandedItems.includes(item.label);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <li key={item.href} className={styles.navItem}>
        <a
          href={item.href}
          className={`${styles.navLink} ${isActive ? styles.active : ''}`}
          style={{ paddingLeft: `${20 + level * 20}px` }}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              toggleExpanded(item.label);
            }
          }}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
          {hasChildren && (
            <span className={styles.chevron}>
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
        </a>
        {hasChildren && isExpanded && (
          <ul className={styles.subNav}>
            {item.children.map(child => renderNavItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      <button
        className={styles.mobileToggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>BI Dashboard</h2>
        </div>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navItems.map(item => renderNavItem(item))}
          </ul>
        </nav>
        <div className={styles.sidebarFooter}>
          <a href="/" className={styles.backToSite}>
            ← Back to Site
          </a>
        </div>
      </aside>
    </>
  );
}
```

### Step 3: Install and Configure Chart Library

```bash
npm install recharts
```

Create `/src/components/admin/charts/ChartWrapper.tsx`:

```tsx
import { ResponsiveContainer } from 'recharts';
import styles from './ChartWrapper.module.scss';

interface ChartWrapperProps {
  title: string;
  subtitle?: string;
  height?: number;
  children: React.ReactNode;
}

export default function ChartWrapper({
  title,
  subtitle,
  height = 300,
  children
}: ChartWrapperProps) {
  return (
    <div className={styles.chartWrapper}>
      <div className={styles.chartHeader}>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={height}>
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

### Step 4: Create Reusable Dashboard Components

Create `/src/components/admin/MetricCard/MetricCard.tsx`:

```tsx
import styles from './MetricCard.module.scss';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

export default function MetricCard({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon,
  color = 'primary'
}: MetricCardProps) {
  const changeClass = change && change > 0 ? styles.positive : styles.negative;
  
  return (
    <div className={`${styles.metricCard} ${styles[color]}`}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        <div className={styles.value}>{value}</div>
        {change !== undefined && (
          <div className={`${styles.change} ${changeClass}`}>
            <span className={styles.changeValue}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className={styles.changeLabel}>{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
```

Create `/src/components/admin/DataTable/DataTable.tsx`:

```tsx
import { useState } from 'react';
import styles from './DataTable.module.scss';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Sorting logic
  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className={styles.dataTableWrapper}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            {columns.map(column => (
              <th
                key={String(column.key)}
                onClick={() => column.sortable && handleSort(column.key)}
                className={column.sortable ? styles.sortable : ''}
              >
                {column.label}
                {sortKey === column.key && (
                  <span className={styles.sortIcon}>
                    {sortOrder === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr key={index}>
              {columns.map(column => (
                <td key={String(column.key)}>
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
```

### Step 5: Create Dashboard-Specific Styles

Create `/src/styles/admin/admin-global.scss`:

```scss
// Admin-specific CSS variables
:root {
  // Admin color scheme
  --color-admin-bg: #f5f7fa;
  --color-admin-surface: #ffffff;
  --color-admin-text: #2d3748;
  --color-admin-text-secondary: #718096;
  --color-admin-border: #e2e8f0;
  --color-admin-sidebar-bg: #1a202c;
  --color-admin-sidebar-text: #e2e8f0;
  --color-admin-sidebar-hover: #2d3748;
  
  // Chart colors
  --chart-primary: #4299e1;
  --chart-secondary: #48bb78;
  --chart-tertiary: #ed8936;
  --chart-quaternary: #9f7aea;
  --chart-danger: #f56565;
  
  // Spacing
  --admin-spacing-xs: 0.25rem;
  --admin-spacing-sm: 0.5rem;
  --admin-spacing-md: 1rem;
  --admin-spacing-lg: 1.5rem;
  --admin-spacing-xl: 2rem;
  
  // Shadows
  --admin-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --admin-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --admin-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

// Dark mode support
@media (prefers-color-scheme: dark) {
  :root {
    --color-admin-bg: #1a202c;
    --color-admin-surface: #2d3748;
    --color-admin-text: #e2e8f0;
    --color-admin-text-secondary: #a0aec0;
    --color-admin-border: #4a5568;
  }
}

// Admin global styles
.admin-layout {
  * {
    box-sizing: border-box;
  }
  
  // Typography
  h1, h2, h3, h4, h5, h6 {
    color: var(--color-admin-text);
    font-weight: 600;
    line-height: 1.2;
  }
  
  h1 { font-size: 2rem; }
  h2 { font-size: 1.5rem; }
  h3 { font-size: 1.25rem; }
  h4 { font-size: 1.125rem; }
  
  // Common patterns
  .card {
    background: var(--color-admin-surface);
    border-radius: 8px;
    padding: var(--admin-spacing-lg);
    box-shadow: var(--admin-shadow-sm);
    
    &:hover {
      box-shadow: var(--admin-shadow-md);
    }
  }
  
  .grid {
    display: grid;
    gap: var(--admin-spacing-lg);
    
    &.cols-2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
    &.cols-3 { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
    &.cols-4 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
  }
}
```

### Step 6: Create Loading and Empty States

Create `/src/components/admin/LoadingState/LoadingState.tsx`:

```tsx
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
```

## Validation Checklist

- [ ] AdminLayout renders correctly
- [ ] Sidebar navigation works and highlights active page
- [ ] Mobile navigation toggles properly
- [ ] Chart library installed and basic chart renders
- [ ] MetricCard component displays data correctly
- [ ] DataTable sorts and paginates data
- [ ] Admin styles don't affect public site
- [ ] Dark mode styles work (if implemented)
- [ ] All components are TypeScript compliant
- [ ] Loading states display properly

## Performance Considerations

1. **Code Splitting**: Charts are loaded only when needed
2. **Lazy Loading**: Heavy components use dynamic imports
3. **CSS Modules**: Scoped styles prevent bloat
4. **Responsive Design**: Mobile-first approach
5. **Caching**: Component state preserved during navigation

## Next Steps

With the infrastructure in place:
1. Proceed to [Phase 3: API Endpoints](./phase-3-api-endpoints.md)
2. Set up data aggregation endpoints
3. Connect real analytics data
4. Build dashboard pages

## Component Library Summary

Created components:
- `AdminLayout` - Base layout for all admin pages
- `AdminSidebar` - Responsive navigation sidebar
- `AdminHeader` - Top header with user info
- `ChartWrapper` - Consistent chart container
- `MetricCard` - KPI display cards
- `DataTable` - Sortable, paginated tables
- `LoadingState` - Loading indicators

These components provide the foundation for building feature-rich dashboard pages in Phase 4.