# Task 6: Load & Stress Testing
**Day 20, Hour 6 - 3:00-4:00 PM**  
**Duration**: 60 minutes  
**Complexity**: High  
**Risk**: Medium

## Objective

Validate performance under high load conditions, test system behavior under stress, identify performance bottlenecks, and confirm scalability requirements are met.

## Prerequisites

- ✅ Tasks 1-5 completed successfully
- ✅ Load testing tools installed
- ✅ Test environment accessible
- ✅ Performance baseline established

## Execution Steps

### Step 1: Load Testing Setup (10 minutes)

```bash
# Configure load testing
npm run load-test:setup
npm run load-test:configure
```

### Step 2: Concurrent User Testing (20 minutes)

```bash
# Test with increasing concurrent users
npm run load-test:concurrent:10
npm run load-test:concurrent:25
npm run load-test:concurrent:50
```

### Step 3: Stress Testing Execution (20 minutes)

```bash
# Run comprehensive stress tests
npm run stress-test:gradual-increase
npm run stress-test:spike-test
```

### Step 4: Performance Analysis (10 minutes)

```bash
# Analyze results
npm run load-test:analyze
npm run performance:report
```

## Automated Load Testing Script

```javascript
// File: scripts/load-testing.js
const { spawn } = require('child_process');
const fs = require('fs');

class LoadTesting {
  constructor() {
    this.baseUrl = process.env.TEST_URL || 'https://staging.example.com';
    this.testDuration = 300; // 5 minutes
    this.concurrentUsers = [10, 25, 50, 100];
    this.testPages = [
      '/',
      '/products',
      '/categories',
      '/search',
      '/product/sample'
    ];
  }

  async runLoadTests() {
    console.log('🔥 Starting load and stress testing...');
    
    const results = {
      loadTests: [],
      stressTests: [],
      summary: {}
    };

    // Run load tests with increasing concurrent users
    for (const users of this.concurrentUsers) {
      console.log(`\n📈 Testing with ${users} concurrent users...`);
      const result = await this.runLoadTest(users);
      results.loadTests.push(result);
      
      // Stop if we hit failure threshold
      if (result.errors > users * 0.05) { // 5% error threshold
        console.log(`⚠️  High error rate detected, stopping at ${users} users`);
        break;
      }
    }

    // Run stress test
    console.log('\n⚡ Running stress test...');
    const stressResult = await this.runStressTest();
    results.stressTests.push(stressResult);

    // Generate summary
    results.summary = this.generateSummary(results);
    
    this.saveResults(results);
    this.generateReport(results);
    
    return results;
  }

  async runLoadTest(concurrentUsers) {
    const testName = `load-test-${concurrentUsers}-users`;
    console.log(`Running ${testName}...`);

    // Artillery configuration for load testing
    const artilleryConfig = {
      config: {
        target: this.baseUrl,
        phases: [
          { duration: 60, arrivalRate: Math.floor(concurrentUsers / 6) }, // Ramp up
          { duration: 120, arrivalRate: concurrentUsers }, // Sustained load
          { duration: 60, arrivalRate: Math.floor(concurrentUsers / 3) }  // Ramp down
        ],
        processor: './load-test-processor.js'
      },
      scenarios: [
        {
          name: 'Homepage load test',
          weight: 30,
          flow: [
            { get: { url: '/' } },
            { think: 2 }
          ]
        },
        {
          name: 'Products browsing',
          weight: 40,
          flow: [
            { get: { url: '/products' } },
            { think: 3 },
            { get: { url: '/categories' } },
            { think: 2 }
          ]
        },
        {
          name: 'Search functionality',
          weight: 20,
          flow: [
            { get: { url: '/search?q=monitor' } },
            { think: 2 }
          ]
        },
        {
          name: 'Product details',
          weight: 10,
          flow: [
            { get: { url: '/product/sample' } },
            { think: 4 }
          ]
        }
      ]
    };

    // Save config and run test
    const configPath = `./temp/${testName}-config.json`;
    fs.writeFileSync(configPath, JSON.stringify(artilleryConfig, null, 2));

    return new Promise((resolve) => {
      const artillery = spawn('artillery', ['run', configPath, '--output', `./reports/${testName}.json`]);
      
      let output = '';
      let errorOutput = '';
      
      artillery.stdout.on('data', (data) => {
        output += data.toString();
        process.stdout.write(data);
      });
      
      artillery.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      artillery.on('close', (code) => {
        const result = this.parseArtilleryOutput(output);
        resolve({
          testName,
          concurrentUsers,
          exitCode: code,
          ...result,
          success: code === 0 && result.errors < concurrentUsers * 0.05,
          errorOutput: errorOutput
        });
      });
    });
  }

  async runStressTest() {
    console.log('Running stress test with increasing load...');
    
    // Gradual increase in load to find breaking point
    const stressConfig = {
      config: {
        target: this.baseUrl,
        phases: [
          { duration: 30, arrivalRate: 10 },   // Warm up
          { duration: 60, arrivalRate: 25 },   // Light load
          { duration: 60, arrivalRate: 50 },   // Moderate load
          { duration: 60, arrivalRate: 100 },  // Heavy load
          { duration: 60, arrivalRate: 200 },  // Stress load
          { duration: 30, arrivalRate: 500 }   // Breaking point
        ]
      },
      scenarios: [{
        name: 'Stress test scenario',
        flow: [
          { get: { url: '/' } },
          { get: { url: '/products' } },
          { think: 1 }
        ]
      }]
    };

    const configPath = './temp/stress-test-config.json';
    fs.writeFileSync(configPath, JSON.stringify(stressConfig, null, 2));

    return new Promise((resolve) => {
      const artillery = spawn('artillery', ['run', configPath, '--output', './reports/stress-test.json']);
      
      let output = '';
      artillery.stdout.on('data', (data) => {
        output += data.toString();
        process.stdout.write(data);
      });

      artillery.on('close', (code) => {
        const result = this.parseArtilleryOutput(output);
        resolve({
          testName: 'stress-test',
          exitCode: code,
          ...result,
          success: code === 0
        });
      });
    });
  }

  parseArtilleryOutput(output) {
    const lines = output.split('\n');
    const result = {
      requestsTotal: 0,
      requestsCompleted: 0,
      errors: 0,
      p95ResponseTime: 0,
      p99ResponseTime: 0,
      meanResponseTime: 0,
      rps: 0
    };

    lines.forEach(line => {
      // Parse Artillery summary statistics
      if (line.includes('http.requests:')) {
        const match = line.match(/http\.requests:\s*(\d+)/);
        if (match) result.requestsTotal = parseInt(match[1]);
      }
      
      if (line.includes('http.responses:')) {
        const match = line.match(/http\.responses:\s*(\d+)/);
        if (match) result.requestsCompleted = parseInt(match[1]);
      }
      
      if (line.includes('errors:')) {
        const match = line.match(/errors:\s*(\d+)/);
        if (match) result.errors = parseInt(match[1]);
      }
      
      if (line.includes('http.response_time:')) {
        const p95Match = line.match(/p95:\s*([\d.]+)/);
        const p99Match = line.match(/p99:\s*([\d.]+)/);
        const meanMatch = line.match(/mean:\s*([\d.]+)/);
        
        if (p95Match) result.p95ResponseTime = parseFloat(p95Match[1]);
        if (p99Match) result.p99ResponseTime = parseFloat(p99Match[1]);
        if (meanMatch) result.meanResponseTime = parseFloat(meanMatch[1]);
      }
      
      if (line.includes('http.request_rate:')) {
        const match = line.match(/mean:\s*([\d.]+)/);
        if (match) result.rps = parseFloat(match[1]);
      }
    });

    return result;
  }

  generateSummary(results) {
    const loadTests = results.loadTests.filter(t => t.success);
    const maxUsers = loadTests.length > 0 ? Math.max(...loadTests.map(t => t.concurrentUsers)) : 0;
    const maxRps = loadTests.length > 0 ? Math.max(...loadTests.map(t => t.rps)) : 0;
    const avgResponseTime = loadTests.length > 0 ? 
      loadTests.reduce((sum, test) => sum + test.meanResponseTime, 0) / loadTests.length : 0;
    
    return {
      maxConcurrentUsers: maxUsers,
      maxRequestsPerSecond: Math.round(maxRps),
      averageResponseTime: Math.round(avgResponseTime),
      totalErrors: results.loadTests.reduce((sum, test) => sum + test.errors, 0),
      allTestsPassed: results.loadTests.every(test => test.success),
      stressTestPassed: results.stressTests.length > 0 && results.stressTests[0].success
    };
  }

  saveResults(results) {
    fs.writeFileSync('./reports/load-testing-results.json', JSON.stringify(results, null, 2));
  }

  generateReport(results) {
    console.log('\n📊 Load Testing Report');
    console.log('======================');
    
    console.log('\n📈 Load Test Results:');
    results.loadTests.forEach(test => {
      const status = test.success ? '✅' : '❌';
      console.log(`  ${status} ${test.concurrentUsers} users: ${Math.round(test.meanResponseTime)}ms avg, ${test.errors} errors, ${Math.round(test.rps)} RPS`);
    });
    
    console.log('\n⚡ Stress Test Results:');
    results.stressTests.forEach(test => {
      const status = test.success ? '✅' : '❌';
      console.log(`  ${status} Peak performance: ${Math.round(test.rps)} RPS, ${Math.round(test.p95ResponseTime)}ms P95`);
    });
    
    console.log('\n📊 Summary:');
    console.log(`  Max Concurrent Users: ${results.summary.maxConcurrentUsers}`);
    console.log(`  Max Requests/Second: ${results.summary.maxRequestsPerSecond}`);
    console.log(`  Average Response Time: ${results.summary.averageResponseTime}ms`);
    console.log(`  Total Errors: ${results.summary.totalErrors}`);
    console.log(`  Overall Status: ${results.summary.allTestsPassed ? '✅ PASS' : '❌ FAIL'}`);
    
    // Performance grade
    const grade = this.calculatePerformanceGrade(results.summary);
    console.log(`  Performance Grade: ${grade}`);
  }

  calculatePerformanceGrade(summary) {
    let score = 100;
    
    // Deduct points for low concurrent user capacity
    if (summary.maxConcurrentUsers < 50) score -= 20;
    else if (summary.maxConcurrentUsers < 25) score -= 40;
    else if (summary.maxConcurrentUsers < 10) score -= 60;
    
    // Deduct points for high response times
    if (summary.averageResponseTime > 2000) score -= 30;
    else if (summary.averageResponseTime > 1000) score -= 15;
    else if (summary.averageResponseTime > 500) score -= 5;
    
    // Deduct points for errors
    if (summary.totalErrors > 100) score -= 25;
    else if (summary.totalErrors > 50) score -= 15;
    else if (summary.totalErrors > 10) score -= 5;
    
    if (score >= 90) return 'A+ (Excellent)';
    if (score >= 80) return 'A (Very Good)';
    if (score >= 70) return 'B (Good)';
    if (score >= 60) return 'C (Fair)';
    return 'D (Needs Improvement)';
  }
}

// Execute if run directly
if (require.main === module) {
  const tester = new LoadTesting();
  tester.runLoadTests().then(results => {
    process.exit(results.summary.allTestsPassed ? 0 : 1);
  });
}

module.exports = LoadTesting;
```

## Expected Outputs

- ✅ System handles ≥25 concurrent users reliably
- ✅ Performance degradation <50% under load
- ✅ No memory leaks detected  
- ✅ Error rate <5% under normal load
- ✅ Response times remain reasonable under stress

## Success Criteria

| Metric | Target | Status |
|--------|--------|--------|
| Max Concurrent Users | ≥ 25 | TBD |
| Error Rate | < 5% | TBD |
| P95 Response Time | < 2000ms | TBD |
| System Stability | No crashes | TBD |

## Performance Benchmarks

### Excellent Performance
- 50+ concurrent users
- < 500ms average response time
- < 1% error rate
- Linear scalability

### Good Performance  
- 25+ concurrent users
- < 1000ms average response time
- < 3% error rate
- Predictable degradation

### Acceptable Performance
- 10+ concurrent users
- < 2000ms average response time
- < 5% error rate
- Stable under normal load

## Troubleshooting

### High Error Rates
- Check server resource limits
- Review database connection pools
- Analyze application logs
- Monitor memory usage

### Poor Response Times
- Profile application bottlenecks
- Check database query performance
- Review CDN configuration
- Optimize asset delivery

### System Instability
- Monitor server resources
- Check for memory leaks
- Review error handling
- Validate graceful degradation

## Load Testing Best Practices

1. **Gradual Ramp-up**: Start with low load and gradually increase
2. **Realistic Scenarios**: Test user journeys, not just homepage
3. **Monitor Resources**: Track CPU, memory, and database metrics
4. **Error Analysis**: Investigate all errors, not just count them
5. **Sustained Load**: Test sustained load, not just peak spikes

## Next Task

[Task 7: Rollback Procedures Testing](./07-rollback-procedures.md)

---

**Task Status**: 📋 Ready  
**Dependencies**: Tasks 1-5 completed  
**Estimated Time**: 60 minutes  
**Critical Path**: Yes