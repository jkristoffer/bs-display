#!/usr/bin/env node

/**
 * Simple Code Review API Server (Node.js built-in modules only)
 * 
 * Provides HTTP endpoints for programmatic access to the code review agent.
 * Uses only Node.js built-in modules for maximum compatibility.
 * 
 * Usage:
 *   node scripts/code-review-api-simple.js [--port 3001]
 * 
 * Endpoints:
 *   POST /review     - Analyze code content
 *   GET  /health     - Health check
 */

import http from 'http';
import url from 'url';
import fs from 'fs/promises';
import CodeReviewAgent from './code-review-agent.js';

// Performance tracking
let requestCount = 0;
let totalProcessingTime = 0;
const startTime = Date.now();

// Helper function to parse JSON body
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Helper function to send JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data, null, 2));
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const pathname = parsedUrl.pathname;

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  try {
    // Health check endpoint
    if (method === 'GET' && pathname === '/health') {
      sendJSON(res, 200, {
        status: 'healthy',
        uptime: Date.now() - startTime,
        requests: requestCount,
        averageProcessingTime: requestCount > 0 ? Math.round(totalProcessingTime / requestCount) : 0
      });
      return;
    }

    // Metrics endpoint
    if (method === 'GET' && pathname === '/metrics') {
      sendJSON(res, 200, {
        requests: requestCount,
        totalProcessingTime,
        averageProcessingTime: requestCount > 0 ? Math.round(totalProcessingTime / requestCount) : 0,
        uptime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Code review endpoint
    if (method === 'POST' && pathname === '/review') {
      const startProcessing = Date.now();
      requestCount++;

      try {
        const body = await parseBody(req);
        const { 
          content, 
          agentId, 
          taskId, 
          outputFormat = 'json',
          thresholds 
        } = body;

        if (!content) {
          sendJSON(res, 400, {
            success: false,
            error: 'Content is required'
          });
          return;
        }

        // Create agent with options
        const agent = new CodeReviewAgent({
          aiMode: true,
          agentId,
          taskId,
          outputFormat,
          thresholds
        });

        // Create temporary file from content
        const tempFilePath = `temp-review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.tsx`;
        await fs.writeFile(tempFilePath, content);
        
        // Analyze file
        await agent.analyzeFile(tempFilePath);
        const results = agent.generateReport();

        // Cleanup temp file
        try {
          await fs.unlink(tempFilePath);
        } catch (error) {
          console.warn('Failed to cleanup temp file:', error.message);
        }

        const processingTime = Date.now() - startProcessing;
        totalProcessingTime += processingTime;

        sendJSON(res, 200, {
          success: true,
          results,
          metadata: {
            processingTime,
            timestamp: new Date().toISOString()
          }
        });

      } catch (error) {
        const processingTime = Date.now() - startProcessing;
        totalProcessingTime += processingTime;

        console.error('Review error:', error);
        sendJSON(res, 500, {
          success: false,
          error: error.message,
          metadata: {
            processingTime,
            timestamp: new Date().toISOString()
          }
        });
      }
      return;
    }

    // 404 for unknown routes
    sendJSON(res, 404, {
      success: false,
      error: 'Endpoint not found',
      availableEndpoints: [
        'GET /health',
        'GET /metrics', 
        'POST /review'
      ]
    });

  } catch (error) {
    console.error('Server error:', error);
    sendJSON(res, 500, {
      success: false,
      error: 'Internal server error'
    });
  }
});

// Start server
function startServer() {
  const args = process.argv.slice(2);
  const portIndex = args.indexOf('--port');
  const port = portIndex !== -1 && args[portIndex + 1] ? parseInt(args[portIndex + 1]) : 3001;

  server.listen(port, () => {
    console.log(`🚀 Simple Code Review API Server running on port ${port}`);
    console.log(`📊 Health check: http://localhost:${port}/health`);
    console.log(`📈 Metrics: http://localhost:${port}/metrics`);
    console.log(`🔍 Review endpoint: POST http://localhost:${port}/review`);
    console.log();
    console.log('Example usage:');
    console.log(`curl -X POST http://localhost:${port}/review \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -d '{"content": "const add = (a, b) => a + b;", "agentId": "test"}'`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully');
    server.close(() => process.exit(0));
  });

  process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully');
    server.close(() => process.exit(0));
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

export default server;