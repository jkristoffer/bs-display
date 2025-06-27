#!/usr/bin/env node

/**
 * Agent Performance Tracker
 * 
 * Tracks and analyzes AI agent performance over time for the orchestrator system.
 * Provides insights into which agents produce the highest quality code.
 * 
 * Usage:
 *   node scripts/agent-performance-tracker.js --log [review-results]
 *   node scripts/agent-performance-tracker.js --report [agent-id]
 *   node scripts/agent-performance-tracker.js --summary
 */

import fs from 'fs/promises';
import path from 'path';

class AgentPerformanceTracker {
  constructor() {
    this.dataFile = 'agent-performance.json';
    this.data = {
      agents: {},
      tasks: {},
      summary: {
        totalTasks: 0,
        totalAgents: 0,
        averageScore: 0,
        lastUpdated: new Date().toISOString()
      }
    };
  }

  async load() {
    try {
      const content = await fs.readFile(this.dataFile, 'utf-8');
      this.data = JSON.parse(content);
    } catch (error) {
      // File doesn't exist yet, use defaults
      if (error.code !== 'ENOENT') {
        console.warn('Error loading performance data:', error.message);
      }
    }
  }

  async save() {
    try {
      await fs.writeFile(this.dataFile, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving performance data:', error.message);
    }
  }

  async logReviewResult(reviewResult) {
    await this.load();

    const { metadata, overallScore, files } = reviewResult;
    const { agentId, taskId, timestamp } = metadata;

    if (!agentId) {
      console.warn('No agent ID provided in review result');
      return;
    }

    // Initialize agent if doesn't exist
    if (!this.data.agents[agentId]) {
      this.data.agents[agentId] = {
        agentId,
        tasksCompleted: 0,
        totalScore: 0,
        averageScore: 0,
        scores: [],
        strengths: [],
        weaknesses: [],
        firstSeen: timestamp,
        lastActivity: timestamp,
        tasks: []
      };
    }

    const agent = this.data.agents[agentId];

    // Update agent stats
    agent.tasksCompleted++;
    agent.totalScore += overallScore;
    agent.averageScore = Math.round(agent.totalScore / agent.tasksCompleted);
    agent.scores.push(overallScore);
    agent.lastActivity = timestamp;
    agent.tasks.push(taskId);

    // Keep only last 100 scores for performance
    if (agent.scores.length > 100) {
      agent.scores = agent.scores.slice(-100);
    }

    // Log task details
    if (taskId) {
      this.data.tasks[taskId] = {
        taskId,
        agentId,
        score: overallScore,
        filesAnalyzed: files.length,
        timestamp,
        categories: {
          functionalProgramming: this.getCategoryScore(reviewResult, 'functionalProgramming'),
          projectStandards: this.getCategoryScore(reviewResult, 'projectStandards'),
          typeScript: this.getCategoryScore(reviewResult, 'typeScript'),
          reactPatterns: this.getCategoryScore(reviewResult, 'reactPatterns')
        }
      };
    }

    // Update agent strengths and weaknesses
    this.updateAgentInsights(agent, reviewResult);

    // Update summary
    this.updateSummary();

    await this.save();

    console.log(`📊 Logged performance for agent ${agentId}: ${overallScore}/100`);
  }

  getCategoryScore(reviewResult, category) {
    const scores = reviewResult.files
      .map(f => f[category]?.score)
      .filter(s => s !== undefined);
    
    return scores.length > 0 
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : 0;
  }

  updateAgentInsights(agent, reviewResult) {
    // Analyze category performance to determine strengths/weaknesses
    const categoryScores = {
      functionalProgramming: this.getCategoryScore(reviewResult, 'functionalProgramming'),
      projectStandards: this.getCategoryScore(reviewResult, 'projectStandards'),
      typeScript: this.getCategoryScore(reviewResult, 'typeScript'),
      reactPatterns: this.getCategoryScore(reviewResult, 'reactPatterns')
    };

    // Determine strengths (scores > 80)
    const strengths = Object.entries(categoryScores)
      .filter(([, score]) => score >= 80)
      .map(([category]) => category);

    // Determine weaknesses (scores < 70)
    const weaknesses = Object.entries(categoryScores)
      .filter(([, score]) => score < 70)
      .map(([category]) => category);

    // Update agent insights (simple frequency-based approach)
    strengths.forEach(strength => {
      if (!agent.strengths.includes(strength)) {
        agent.strengths.push(strength);
      }
    });

    weaknesses.forEach(weakness => {
      if (!agent.weaknesses.includes(weakness)) {
        agent.weaknesses.push(weakness);
      }
    });

    // Keep only top 3 strengths and weaknesses
    agent.strengths = agent.strengths.slice(0, 3);
    agent.weaknesses = agent.weaknesses.slice(0, 3);
  }

  updateSummary() {
    const agents = Object.values(this.data.agents);
    const tasks = Object.values(this.data.tasks);

    this.data.summary = {
      totalTasks: tasks.length,
      totalAgents: agents.length,
      averageScore: agents.length > 0 
        ? Math.round(agents.reduce((sum, agent) => sum + agent.averageScore, 0) / agents.length)
        : 0,
      lastUpdated: new Date().toISOString()
    };
  }

  async generateAgentReport(agentId) {
    await this.load();

    const agent = this.data.agents[agentId];
    if (!agent) {
      console.log(`❌ Agent ${agentId} not found`);
      return;
    }

    console.log('\n🤖 AGENT PERFORMANCE REPORT');
    console.log('='.repeat(40));
    console.log(`Agent ID: ${agent.agentId}`);
    console.log(`Tasks Completed: ${agent.tasksCompleted}`);
    console.log(`Average Score: ${agent.averageScore}/100`);
    console.log(`Score Trend: ${this.getScoreTrend(agent.scores)}`);
    console.log(`First Seen: ${new Date(agent.firstSeen).toLocaleDateString()}`);
    console.log(`Last Activity: ${new Date(agent.lastActivity).toLocaleDateString()}`);

    if (agent.strengths.length > 0) {
      console.log(`\n💪 Strengths: ${agent.strengths.join(', ')}`);
    }

    if (agent.weaknesses.length > 0) {
      console.log(`⚠️ Areas for Improvement: ${agent.weaknesses.join(', ')}`);
    }

    // Recent performance
    const recentScores = agent.scores.slice(-10);
    if (recentScores.length > 0) {
      const recentAverage = Math.round(recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length);
      console.log(`\n📈 Recent Performance (last 10 tasks): ${recentAverage}/100`);
    }

    // Performance grade
    const grade = this.getPerformanceGrade(agent.averageScore);
    console.log(`🎯 Overall Grade: ${grade}`);

    return agent;
  }

  async generateSummaryReport() {
    await this.load();

    const agents = Object.values(this.data.agents);
    const tasks = Object.values(this.data.tasks);

    console.log('\n📊 ORCHESTRATOR PERFORMANCE SUMMARY');
    console.log('='.repeat(45));
    console.log(`Total Agents: ${this.data.summary.totalAgents}`);
    console.log(`Total Tasks: ${this.data.summary.totalTasks}`);
    console.log(`Overall Average Score: ${this.data.summary.averageScore}/100`);
    console.log(`Last Updated: ${new Date(this.data.summary.lastUpdated).toLocaleString()}`);

    if (agents.length > 0) {
      // Top performing agents
      const topAgents = agents
        .sort((a, b) => b.averageScore - a.averageScore)
        .slice(0, 5);

      console.log('\n🏆 TOP PERFORMING AGENTS:');
      topAgents.forEach((agent, index) => {
        console.log(`${index + 1}. ${agent.agentId}: ${agent.averageScore}/100 (${agent.tasksCompleted} tasks)`);
      });

      // Category analysis
      const categoryAverages = {
        functionalProgramming: 0,
        projectStandards: 0,
        typeScript: 0,
        reactPatterns: 0
      };

      if (tasks.length > 0) {
        Object.keys(categoryAverages).forEach(category => {
          const scores = tasks.map(task => task.categories[category]).filter(score => score > 0);
          categoryAverages[category] = scores.length > 0 
            ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
            : 0;
        });

        console.log('\n📈 CATEGORY PERFORMANCE:');
        console.log(`⚡ Functional Programming: ${categoryAverages.functionalProgramming}/100`);
        console.log(`📏 Project Standards: ${categoryAverages.projectStandards}/100`);
        console.log(`🔷 TypeScript: ${categoryAverages.typeScript}/100`);
        console.log(`⚛️ React Patterns: ${categoryAverages.reactPatterns}/100`);
      }

      // Improvement recommendations
      console.log('\n💡 RECOMMENDATIONS:');
      const lowestCategory = Object.entries(categoryAverages)
        .sort(([,a], [,b]) => a - b)[0];
      
      if (lowestCategory[1] < 75) {
        console.log(`- Focus on improving ${lowestCategory[0]} (lowest score: ${lowestCategory[1]}/100)`);
      }

      const underperformingAgents = agents.filter(agent => agent.averageScore < 70);
      if (underperformingAgents.length > 0) {
        console.log(`- ${underperformingAgents.length} agents need additional training`);
      }
    }

    return {
      summary: this.data.summary,
      agents: agents.length,
      topAgent: agents.length > 0 ? agents.sort((a, b) => b.averageScore - a.averageScore)[0] : null
    };
  }

  getScoreTrend(scores) {
    if (scores.length < 5) return 'Insufficient data';
    
    const recent = scores.slice(-5);
    const older = scores.slice(-10, -5);
    
    if (older.length === 0) return 'Stable';
    
    const recentAvg = recent.reduce((sum, score) => sum + score, 0) / recent.length;
    const olderAvg = older.reduce((sum, score) => sum + score, 0) / older.length;
    
    const diff = recentAvg - olderAvg;
    
    if (diff > 5) return '📈 Improving';
    if (diff < -5) return '📉 Declining';
    return '➡️ Stable';
  }

  getPerformanceGrade(score) {
    if (score >= 90) return 'A (Excellent)';
    if (score >= 80) return 'B (Good)';
    if (score >= 70) return 'C (Satisfactory)';
    if (score >= 60) return 'D (Needs Improvement)';
    return 'F (Poor)';
  }

  async exportData(format = 'json') {
    await this.load();
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `agent-performance-export-${timestamp}.${format}`;
    
    if (format === 'json') {
      await fs.writeFile(filename, JSON.stringify(this.data, null, 2));
    } else if (format === 'csv') {
      // Simple CSV export for agents
      const agents = Object.values(this.data.agents);
      const csvHeaders = 'AgentID,TasksCompleted,AverageScore,Strengths,Weaknesses,LastActivity\n';
      const csvRows = agents.map(agent => 
        `${agent.agentId},${agent.tasksCompleted},${agent.averageScore},"${agent.strengths.join(';')}","${agent.weaknesses.join(';')}",${agent.lastActivity}`
      ).join('\n');
      
      await fs.writeFile(filename, csvHeaders + csvRows);
    }
    
    console.log(`📄 Data exported to ${filename}`);
    return filename;
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const tracker = new AgentPerformanceTracker();

  try {
    if (args.includes('--log')) {
      const logIndex = args.indexOf('--log') + 1;
      const resultFile = args[logIndex];
      
      if (!resultFile) {
        throw new Error('Review result file required for --log');
      }
      
      const content = await fs.readFile(resultFile, 'utf-8');
      const reviewResult = JSON.parse(content);
      await tracker.logReviewResult(reviewResult);
    }
    else if (args.includes('--report')) {
      const reportIndex = args.indexOf('--report') + 1;
      const agentId = args[reportIndex];
      
      if (!agentId) {
        throw new Error('Agent ID required for --report');
      }
      
      await tracker.generateAgentReport(agentId);
    }
    else if (args.includes('--summary')) {
      await tracker.generateSummaryReport();
    }
    else if (args.includes('--export')) {
      const exportIndex = args.indexOf('--export') + 1;
      const format = args[exportIndex] || 'json';
      await tracker.exportData(format);
    }
    else {
      console.log(`
🤖 Agent Performance Tracker

Usage:
  node scripts/agent-performance-tracker.js --log <review-result.json>    Log review results
  node scripts/agent-performance-tracker.js --report <agent-id>           Generate agent report
  node scripts/agent-performance-tracker.js --summary                     Generate summary report
  node scripts/agent-performance-tracker.js --export [json|csv]           Export performance data

Examples:
  node scripts/agent-performance-tracker.js --log review-results.json
  node scripts/agent-performance-tracker.js --report claude-dev-1
  node scripts/agent-performance-tracker.js --summary
  node scripts/agent-performance-tracker.js --export csv
      `);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default AgentPerformanceTracker;