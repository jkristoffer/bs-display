#!/usr/bin/env node

/**
 * Code Review API Server
 * 
 * Provides HTTP endpoints for programmatic access to the code review agent.
 * Designed for AI orchestrator systems and automated workflows.
 * 
 * Usage:
 *   node scripts/code-review-api.js [--port 3001]
 * 
 * Endpoints:
 *   POST /review/file     - Analyze single file
 *   POST /review/batch    - Analyze multiple files
 *   GET  /health          - Health check
 *   GET  /metrics         - Performance metrics
 */

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import CodeReviewAgent from './code-review-agent.js';

const app = express();
const upload = multer({ dest: 'temp/' });

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Performance tracking
let requestCount = 0;
let totalProcessingTime = 0;
const startTime = Date.now();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: Date.now() - startTime,
    requests: requestCount,
    averageProcessingTime: requestCount > 0 ? Math.round(totalProcessingTime / requestCount) : 0
  });
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.json({
    requests: requestCount,
    totalProcessingTime,
    averageProcessingTime: requestCount > 0 ? Math.round(totalProcessingTime / requestCount) : 0,
    uptime: Date.now() - startTime,
    timestamp: new Date().toISOString()
  });
});

// Analyze single file endpoint
app.post('/review/file', async (req, res) => {
  const startProcessing = Date.now();
  requestCount++;

  try {
    const { 
      filePath, 
      content, 
      agentId, 
      taskId, 
      outputFormat = 'json',
      thresholds 
    } = req.body;

    if (!filePath && !content) {
      return res.status(400).json({
        error: 'Either filePath or content is required'
      });
    }

    // Create agent with options
    const agent = new CodeReviewAgent({
      aiMode: true,
      agentId,
      taskId,
      outputFormat,
      thresholds
    });

    let tempFilePath = null;
    let analysisResult;

    if (content) {
      // Create temporary file from content
      tempFilePath = path.join('temp', `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.tsx`);
      await fs.mkdir('temp', { recursive: true });
      await fs.writeFile(tempFilePath, content);
      analysisResult = await agent.analyzeFile(tempFilePath);
    } else {
      // Analyze existing file
      analysisResult = await agent.analyzeFile(filePath);
    }

    // Generate results
    const results = agent.generateReport();

    // Cleanup temp file
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (error) {
        console.warn('Failed to cleanup temp file:', error.message);
      }
    }

    const processingTime = Date.now() - startProcessing;
    totalProcessingTime += processingTime;

    res.json({
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
    res.status(500).json({
      success: false,
      error: error.message,
      metadata: {
        processingTime,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Analyze multiple files endpoint
app.post('/review/batch', async (req, res) => {
  const startProcessing = Date.now();
  requestCount++;

  try {
    const { 
      files, 
      directory,
      agentId, 
      taskId, 
      outputFormat = 'json',
      thresholds 
    } = req.body;

    if (!files && !directory) {
      return res.status(400).json({
        error: 'Either files array or directory is required'
      });
    }

    // Create agent with options
    const agent = new CodeReviewAgent({
      aiMode: true,
      agentId,
      taskId,
      outputFormat,
      thresholds
    });

    let analysisResult;

    if (directory) {
      // Analyze directory
      analysisResult = await agent.analyzeBatch(directory);
    } else {
      // Analyze specific files
      for (const file of files) {
        if (file.content) {
          // Handle content-based files
          const tempFilePath = path.join('temp', `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.tsx`);
          await fs.mkdir('temp', { recursive: true });
          await fs.writeFile(tempFilePath, file.content);
          await agent.analyzeFile(tempFilePath);
          
          try {
            await fs.unlink(tempFilePath);
          } catch (error) {
            console.warn('Failed to cleanup temp file:', error.message);
          }
        } else if (file.path) {
          // Handle file path-based files
          await agent.analyzeFile(file.path);
        }
      }
      analysisResult = agent.generateReport();
    }

    const processingTime = Date.now() - startProcessing;
    totalProcessingTime += processingTime;

    res.json({
      success: true,
      results: analysisResult,
      metadata: {
        processingTime,
        filesAnalyzed: analysisResult.files.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startProcessing;
    totalProcessingTime += processingTime;

    console.error('Batch review error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      metadata: {
        processingTime,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// File upload endpoint (for orchestrator file uploads)
app.post('/review/upload', upload.single('file'), async (req, res) => {
  const startProcessing = Date.now();
  requestCount++;

  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }

    const { agentId, taskId, outputFormat = 'json' } = req.body;

    // Create agent with options
    const agent = new CodeReviewAgent({
      aiMode: true,
      agentId,
      taskId,
      outputFormat: outputFormat
    });

    // Analyze uploaded file
    await agent.analyzeFile(req.file.path);
    const results = agent.generateReport();

    // Cleanup uploaded file
    try {
      await fs.unlink(req.file.path);
    } catch (error) {
      console.warn('Failed to cleanup uploaded file:', error.message);
    }

    const processingTime = Date.now() - startProcessing;
    totalProcessingTime += processingTime;

    res.json({
      success: true,
      results,
      metadata: {
        originalName: req.file.originalname,
        processingTime,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startProcessing;
    totalProcessingTime += processingTime;

    // Cleanup uploaded file on error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.warn('Failed to cleanup uploaded file after error:', cleanupError.message);
      }
    }

    console.error('Upload review error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      metadata: {
        processingTime,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Agent performance tracking endpoint
app.get('/agents/performance', async (req, res) => {
  try {
    // This would typically read from a database or log files
    // For now, return mock data structure
    res.json({
      agents: [
        {
          agentId: 'claude-dev-1',
          tasksCompleted: 45,
          averageScore: 78,
          lastActivity: new Date().toISOString(),
          strengths: ['functional-programming', 'typescript'],
          weaknesses: ['project-standards']
        }
      ],
      summary: {
        totalTasks: 45,
        averageScore: 78,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
function startServer() {
  const args = process.argv.slice(2);
  const portIndex = args.indexOf('--port');
  const port = portIndex !== -1 && args[portIndex + 1] ? parseInt(args[portIndex + 1]) : 3001;

  app.listen(port, () => {
    console.log(`🚀 Code Review API Server running on port ${port}`);
    console.log(`📊 Health check: http://localhost:${port}/health`);
    console.log(`📈 Metrics: http://localhost:${port}/metrics`);
    console.log();
    console.log('API Endpoints:');
    console.log(`  POST http://localhost:${port}/review/file`);
    console.log(`  POST http://localhost:${port}/review/batch`);
    console.log(`  POST http://localhost:${port}/review/upload`);
    console.log(`  GET  http://localhost:${port}/agents/performance`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully');
    process.exit(0);
  });
}

// Example client usage
function printExampleUsage() {
  console.log(`
🤖 Code Review API Examples

# Single file analysis
curl -X POST http://localhost:3001/review/file \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "const add = (a, b) => a + b;",
    "agentId": "claude-dev-1",
    "taskId": "create-utility-function",
    "outputFormat": "json"
  }'

# Batch file analysis
curl -X POST http://localhost:3001/review/batch \\
  -H "Content-Type: application/json" \\
  -d '{
    "directory": "src/components",
    "agentId": "claude-dev-1",
    "outputFormat": "minimal"
  }'

# File upload
curl -X POST http://localhost:3001/review/upload \\
  -F "file=@MyComponent.tsx" \\
  -F "agentId=claude-dev-1" \\
  -F "taskId=create-component"

# Agent performance
curl http://localhost:3001/agents/performance
  `);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    printExampleUsage();
  } else {
    startServer();
  }
}

export default app;