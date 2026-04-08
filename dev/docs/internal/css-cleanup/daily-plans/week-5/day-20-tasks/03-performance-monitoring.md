# Task 3: Real-World Performance Monitoring
**Day 20, Hour 3 - 11:00 AM-12:00 PM**  
**Duration**: 60 minutes  
**Complexity**: Medium  
**Risk**: Medium

## Objective

Establish baseline performance metrics in production environment, configure real user monitoring (RUM), set up performance alerting, and validate performance under real traffic conditions.

## Prerequisites

- ✅ Tasks 1-2 completed successfully
- ✅ Production environment accessible
- ✅ Monitoring tools configured
- ✅ Performance baselines defined

## Execution Steps

### Step 1: Performance Baseline Setup (15 minutes)

```bash
# Configure performance monitoring
npm run monitoring:setup
npm run monitoring:baseline
```

### Step 2: Real User Metrics Collection (15 minutes)

```bash
# Enable RUM collection
npm run rum:enable
npm run rum:configure
```

### Step 3: Performance Alerting Configuration (15 minutes)

```bash
# Set up performance alerts
npm run alerts:performance:setup
npm run alerts:test
```

### Step 4: Validation & Reporting (15 minutes)

```bash
# Validate monitoring setup
npm run monitoring:validate
npm run performance:report
```

## Performance Monitoring Script

```javascript
// File: scripts/performance-monitoring.js
const puppeteer = require('puppeteer');
const fs = require('fs');

class PerformanceMonitor {
  constructor() {
    this.testUrl = process.env.TEST_URL || 'http://localhost:3000';
    this.metrics = {
      coreWebVitals: {},
      loadingMetrics: {},
      runtimeMetrics: {},
      resourceMetrics: {}
    };
  }

  async monitorPerformance() {
    console.log('📊 Starting real-world performance monitoring...');
    
    await this.measureCoreWebVitals();
    await this.measureLoadingPerformance();
    await this.measureRuntimePerformance();
    await this.measureResourceUsage();
    await this.setupRealUserMonitoring();
    await this.generateMonitoringReport();
  }

  async measureCoreWebVitals() {
    console.log('🎯 Measuring Core Web Vitals...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Enable performance metrics collection
    await page.evaluateOnNewDocument(() => {
      window.webVitalsData = {};
      
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        window.webVitalsData.lcp = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // First Input Delay (simulated)
      new PerformanceObserver((list) => {
        const firstInput = list.getEntries()[0];
        if (firstInput) {
          window.webVitalsData.fid = firstInput.processingStart - firstInput.startTime;
        }
      }).observe({ entryTypes: ['first-input'] });
      
      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        window.webVitalsData.cls = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });
    });
    
    await page.goto(this.testUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait for metrics to be collected
    await page.waitForTimeout(3000);
    
    // Simulate user interaction for FID
    await page.click('body');
    await page.waitForTimeout(1000);
    
    const webVitals = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      return {
        // Core Web Vitals
        lcp: window.webVitalsData.lcp || 0,
        fid: window.webVitalsData.fid || 0,
        cls: window.webVitalsData.cls || 0,
        
        // Loading metrics
        fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        ttfb: navigation.responseStart - navigation.requestStart,
        domComplete: navigation.domComplete - navigation.navigationStart,
        loadComplete: navigation.loadEventEnd - navigation.navigationStart
      };
    });
    
    this.metrics.coreWebVitals = webVitals;
    
    await browser.close();
    
    console.log(`✅ Core Web Vitals measured:`);
    console.log(`   LCP: ${Math.round(webVitals.lcp)}ms`);
    console.log(`   FID: ${Math.round(webVitals.fid)}ms`);
    console.log(`   CLS: ${webVitals.cls.toFixed(3)}`);
    console.log(`   FCP: ${Math.round(webVitals.fcp)}ms`);
    console.log(`   TTFB: ${Math.round(webVitals.ttfb)}ms`);
  }

  async measureLoadingPerformance() {
    console.log('⚡ Measuring loading performance...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Measure multiple page loads for consistency
    const loadTests = [];
    
    for (let i = 0; i < 5; i++) {
      const startTime = Date.now();
      
      await page.goto(this.testUrl, { 
        waitUntil: 'networkidle0', 
        timeout: 30000 
      });
      
      const endTime = Date.now();
      const loadTime = endTime - startTime;
      
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const resources = performance.getEntriesByType('resource');
        
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
          windowLoad: navigation.loadEventEnd - navigation.navigationStart,
          resourceCount: resources.length,
          totalResourceSize: resources.reduce((total, resource) => {
            return total + (resource.transferSize || 0);
          }, 0)
        };
      });
      
      loadTests.push({
        iteration: i + 1,
        totalLoadTime: loadTime,
        ...metrics
      });
    }
    
    // Calculate averages
    const avgMetrics = {
      totalLoadTime: Math.round(loadTests.reduce((sum, test) => sum + test.totalLoadTime, 0) / loadTests.length),
      domContentLoaded: Math.round(loadTests.reduce((sum, test) => sum + test.domContentLoaded, 0) / loadTests.length),
      windowLoad: Math.round(loadTests.reduce((sum, test) => sum + test.windowLoad, 0) / loadTests.length),
      resourceCount: Math.round(loadTests.reduce((sum, test) => sum + test.resourceCount, 0) / loadTests.length),
      totalResourceSize: Math.round(loadTests.reduce((sum, test) => sum + test.totalResourceSize, 0) / loadTests.length)
    };
    
    this.metrics.loadingMetrics = {
      averages: avgMetrics,
      individual: loadTests
    };
    
    await browser.close();
    
    console.log(`✅ Loading performance measured:`);
    console.log(`   Average load time: ${avgMetrics.totalLoadTime}ms`);
    console.log(`   DOM ready: ${avgMetrics.domContentLoaded}ms`);
    console.log(`   Window load: ${avgMetrics.windowLoad}ms`);
    console.log(`   Resources loaded: ${avgMetrics.resourceCount}`);
    console.log(`   Total transfer: ${Math.round(avgMetrics.totalResourceSize / 1024)}KB`);
  }

  async measureRuntimePerformance() {
    console.log('🔄 Measuring runtime performance...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Enable performance monitoring
    await page.evaluateOnNewDocument(() => {
      window.performanceData = {
        longTasks: [],
        memoryUsage: []
      };
      
      // Long task monitoring
      if ('PerformanceObserver' in window) {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            window.performanceData.longTasks.push({
              startTime: entry.startTime,
              duration: entry.duration
            });
          }
        }).observe({ entryTypes: ['longtask'] });
      }
      
      // Memory usage monitoring
      setInterval(() => {
        if (performance.memory) {
          window.performanceData.memoryUsage.push({
            timestamp: Date.now(),
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize
          });
        }
      }, 5000);
    });
    
    await page.goto(this.testUrl, { waitUntil: 'networkidle0' });
    
    // Simulate user interactions
    await page.click('a[href="/products"]').catch(() => {});
    await page.waitForTimeout(2000);
    
    if (await page.$('button, .filter-button')) {
      await page.click('button, .filter-button').catch(() => {});
      await page.waitForTimeout(2000);
    }
    
    // Let runtime metrics collect
    await page.waitForTimeout(10000);
    
    const runtimeMetrics = await page.evaluate(() => {
      return {
        longTasks: window.performanceData.longTasks.length,
        totalBlockingTime: window.performanceData.longTasks.reduce((total, task) => {
          return total + Math.max(0, task.duration - 50);
        }, 0),
        memorySnapshots: window.performanceData.memoryUsage.length,
        finalMemoryUsage: window.performanceData.memoryUsage.length > 0 ? 
          window.performanceData.memoryUsage[window.performanceData.memoryUsage.length - 1].usedJSHeapSize : 0
      };
    });
    
    this.metrics.runtimeMetrics = runtimeMetrics;
    
    await browser.close();
    
    console.log(`✅ Runtime performance measured:`);
    console.log(`   Long tasks: ${runtimeMetrics.longTasks}`);
    console.log(`   Total blocking time: ${Math.round(runtimeMetrics.totalBlockingTime)}ms`);
    console.log(`   Memory usage: ${Math.round(runtimeMetrics.finalMemoryUsage / 1024 / 1024)}MB`);
  }

  async measureResourceUsage() {
    console.log('📦 Measuring resource usage...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    const responses = [];
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        size: response.headers()['content-length'] || 0,
        type: response.headers()['content-type'] || 'unknown',
        cached: response.fromCache()
      });
    });
    
    await page.goto(this.testUrl, { waitUntil: 'networkidle0' });
    
    // Analyze resource usage
    const resourceAnalysis = {
      totalRequests: responses.length,
      totalSize: responses.reduce((sum, res) => sum + parseInt(res.size || 0), 0),
      cachedRequests: responses.filter(res => res.cached).length,
      resourceTypes: {}
    };
    
    // Group by resource type
    responses.forEach(response => {
      const type = this.getResourceType(response.type, response.url);
      if (!resourceAnalysis.resourceTypes[type]) {
        resourceAnalysis.resourceTypes[type] = {
          count: 0,
          totalSize: 0
        };
      }
      resourceAnalysis.resourceTypes[type].count++;
      resourceAnalysis.resourceTypes[type].totalSize += parseInt(response.size || 0);
    });
    
    this.metrics.resourceMetrics = resourceAnalysis;
    
    await browser.close();
    
    console.log(`✅ Resource usage analyzed:`);
    console.log(`   Total requests: ${resourceAnalysis.totalRequests}`);
    console.log(`   Total size: ${Math.round(resourceAnalysis.totalSize / 1024)}KB`);
    console.log(`   Cached requests: ${resourceAnalysis.cachedRequests} (${Math.round(resourceAnalysis.cachedRequests / resourceAnalysis.totalRequests * 100)}%)`);
    
    Object.entries(resourceAnalysis.resourceTypes).forEach(([type, data]) => {
      console.log(`   ${type}: ${data.count} files, ${Math.round(data.totalSize / 1024)}KB`);
    });
  }

  getResourceType(contentType, url) {
    if (contentType.includes('text/css') || url.includes('.css')) return 'CSS';
    if (contentType.includes('javascript') || url.includes('.js')) return 'JavaScript';
    if (contentType.includes('image/') || /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(url)) return 'Images';
    if (contentType.includes('text/html') || url.endsWith('/')) return 'HTML';
    if (contentType.includes('font/') || /\.(woff|woff2|ttf|otf)$/i.test(url)) return 'Fonts';
    return 'Other';
  }

  async setupRealUserMonitoring() {
    console.log('👥 Setting up Real User Monitoring...');
    
    // Generate RUM setup script
    const rumScript = `
// Real User Monitoring Setup
(function() {
  'use strict';
  
  const rumData = {
    sessionId: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
    startTime: performance.now(),
    metrics: {},
    events: []
  };

  // Core Web Vitals collection
  function collectWebVitals() {
    // LCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      rumData.metrics.lcp = Math.round(lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID
    new PerformanceObserver((list) => {
      const firstInput = list.getEntries()[0];
      if (firstInput) {
        rumData.metrics.fid = Math.round(firstInput.processingStart - firstInput.startTime);
      }
    }).observe({ entryTypes: ['first-input'] });

    // CLS
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      rumData.metrics.cls = Math.round(clsValue * 1000) / 1000;
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // Performance metrics collection
  function collectPerformanceMetrics() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        rumData.metrics.ttfb = Math.round(navigation.responseStart - navigation.requestStart);
        rumData.metrics.fcp = Math.round(paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0);
        rumData.metrics.domContentLoaded = Math.round(navigation.domContentLoadedEventEnd - navigation.navigationStart);
        rumData.metrics.loadComplete = Math.round(navigation.loadEventEnd - navigation.navigationStart);
        
        // Send metrics to monitoring service
        sendRUMData();
      }, 1000);
    });
  }

  // Error tracking
  function trackErrors() {
    window.addEventListener('error', (event) => {
      rumData.events.push({
        type: 'error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        timestamp: Date.now()
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      rumData.events.push({
        type: 'unhandled-promise-rejection',
        reason: event.reason.toString(),
        timestamp: Date.now()
      });
    });
  }

  // Send data to monitoring service
  function sendRUMData() {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/rum', JSON.stringify(rumData));
    } else {
      fetch('/api/rum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rumData)
      }).catch(() => {}); // Fail silently
    }
  }

  // Initialize monitoring
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      collectWebVitals();
      collectPerformanceMetrics();
      trackErrors();
    });
  } else {
    collectWebVitals();
    collectPerformanceMetrics();
    trackErrors();
  }
})();`;

    fs.writeFileSync('./public/rum-monitoring.js', rumScript);
    console.log('✅ RUM script generated and saved');
  }

  async generateMonitoringReport() {
    const report = {
      timestamp: new Date().toISOString(),
      testUrl: this.testUrl,
      coreWebVitals: this.metrics.coreWebVitals,
      loadingMetrics: this.metrics.loadingMetrics,
      runtimeMetrics: this.metrics.runtimeMetrics,
      resourceMetrics: this.metrics.resourceMetrics,
      performanceGrade: this.calculatePerformanceGrade(),
      recommendations: this.generateRecommendations()
    };

    fs.writeFileSync('./reports/performance-monitoring-report.json', JSON.stringify(report, null, 2));

    console.log('\n📊 Performance Monitoring Report');
    console.log('================================');
    console.log(`Performance Grade: ${report.performanceGrade}`);
    console.log(`\nCore Web Vitals:`);
    console.log(`  LCP: ${Math.round(report.coreWebVitals.lcp)}ms ${this.getVitalStatus('lcp', report.coreWebVitals.lcp)}`);
    console.log(`  FID: ${Math.round(report.coreWebVitals.fid)}ms ${this.getVitalStatus('fid', report.coreWebVitals.fid)}`);
    console.log(`  CLS: ${report.coreWebVitals.cls.toFixed(3)} ${this.getVitalStatus('cls', report.coreWebVitals.cls)}`);
    
    console.log(`\nLoad Performance:`);
    console.log(`  Page Load: ${report.loadingMetrics.averages.totalLoadTime}ms`);
    console.log(`  TTFB: ${Math.round(report.coreWebVitals.ttfb)}ms`);
    console.log(`  Resources: ${report.resourceMetrics.totalRequests} (${Math.round(report.resourceMetrics.totalSize / 1024)}KB)`);
    
    if (report.recommendations.length > 0) {
      console.log(`\nRecommendations:`);
      report.recommendations.forEach(rec => {
        console.log(`  • ${rec.title}: ${rec.description}`);
      });
    }
  }

  getVitalStatus(metric, value) {
    const thresholds = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 }
    };
    
    const threshold = thresholds[metric];
    if (value <= threshold.good) return '✅';
    if (value <= threshold.poor) return '⚠️';
    return '❌';
  }

  calculatePerformanceGrade() {
    const vitals = this.metrics.coreWebVitals;
    const loading = this.metrics.loadingMetrics.averages;
    
    let score = 100;
    
    // Core Web Vitals scoring
    if (vitals.lcp > 4000) score -= 25;
    else if (vitals.lcp > 2500) score -= 10;
    
    if (vitals.fid > 300) score -= 20;
    else if (vitals.fid > 100) score -= 5;
    
    if (vitals.cls > 0.25) score -= 20;
    else if (vitals.cls > 0.1) score -= 5;
    
    // Loading performance
    if (loading.totalLoadTime > 5000) score -= 15;
    else if (loading.totalLoadTime > 3000) score -= 5;
    
    if (score >= 90) return 'A+ (Excellent)';
    if (score >= 80) return 'A (Very Good)';
    if (score >= 70) return 'B (Good)';
    if (score >= 60) return 'C (Fair)';
    return 'D (Needs Improvement)';
  }

  generateRecommendations() {
    const recommendations = [];
    const vitals = this.metrics.coreWebVitals;
    const loading = this.metrics.loadingMetrics.averages;
    
    if (vitals.lcp > 2500) {
      recommendations.push({
        priority: 'high',
        title: 'Optimize Largest Contentful Paint',
        description: `LCP is ${Math.round(vitals.lcp)}ms, target is <2.5s`
      });
    }
    
    if (vitals.fid > 100) {
      recommendations.push({
        priority: 'medium',
        title: 'Reduce First Input Delay',
        description: `FID is ${Math.round(vitals.fid)}ms, target is <100ms`
      });
    }
    
    if (vitals.cls > 0.1) {
      recommendations.push({
        priority: 'medium',
        title: 'Minimize Layout Shifts',
        description: `CLS is ${vitals.cls.toFixed(3)}, target is <0.1`
      });
    }
    
    if (loading.totalLoadTime > 3000) {
      recommendations.push({
        priority: 'medium',
        title: 'Improve Page Load Speed',
        description: `Load time is ${loading.totalLoadTime}ms, target is <3s`
      });
    }
    
    return recommendations;
  }
}

// Execute if run directly
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  monitor.monitorPerformance().then(() => {
    console.log('✅ Performance monitoring setup complete');
  });
}

module.exports = PerformanceMonitor;
```

## Expected Outputs

- ✅ Performance monitoring operational
- ✅ Baseline metrics established
- ✅ Real user metrics collecting
- ✅ Performance alerts configured

## Success Criteria

| Metric | Target | Status |
|--------|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s | TBD |
| FID (First Input Delay) | < 100ms | TBD |
| CLS (Cumulative Layout Shift) | < 0.1 | TBD |
| Page Load Time | < 3s | TBD |

## Performance Thresholds

### Core Web Vitals
- **LCP**: Good (<2.5s), Poor (>4.0s)
- **FID**: Good (<100ms), Poor (>300ms)  
- **CLS**: Good (<0.1), Poor (>0.25)

### Loading Metrics
- **TTFB**: Good (<200ms), Poor (>600ms)
- **FCP**: Good (<1.8s), Poor (>3.0s)
- **Page Load**: Good (<3s), Poor (>5s)

## Alert Configuration

### Critical Alerts
- LCP > 4 seconds
- Page load time > 5 seconds
- Error rate > 5%

### Warning Alerts  
- LCP > 2.5 seconds
- FID > 100ms
- CLS > 0.1

## Troubleshooting

### Poor LCP Scores
- Optimize server response times
- Remove render-blocking resources
- Optimize critical resource loading
- Use CDN for static assets

### High FID Values
- Minimize main thread work
- Break up long-running tasks
- Use web workers for heavy computations
- Optimize third-party scripts

### Layout Shift Issues
- Set dimensions for images and embeds
- Avoid inserting content above existing content
- Use CSS transforms instead of layout-triggering properties

## Next Task

[Task 4: Error Tracking & Alerting Setup](./04-error-tracking.md)

---

**Task Status**: 📋 Ready  
**Dependencies**: Tasks 1-2 completed  
**Estimated Time**: 60 minutes  
**Critical Path**: Yes