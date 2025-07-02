#!/usr/bin/env node

/**
 * Automation Tools Listing Script
 * 
 * Provides a comprehensive overview of all automation tools available in the project
 */

const tools = {
  "🤖 Code Quality & Review": {
    description: "Automated code analysis and standards enforcement",
    tools: [
      {
        name: "Code Review Agent",
        npm: "npm run tools:code-review -- --file [file]",
        command: "node scripts/code-review-agent.js --file [file]",
        description: "Analyzes functional programming compliance and project standards",
        examples: [
          "npm run tools:code-review -- --file src/components/MyComponent.tsx",
          "npm run tools:code-review -- --file [file] --ai-mode --agent-id [agent] --task-id [task]"
        ]
      },
      {
        name: "Code Review API",
        npm: "npm run tools:code-review-api",
        command: "node scripts/code-review-api-simple.js --port 3001",
        description: "HTTP API server for programmatic code analysis",
        examples: [
          "npm run tools:code-review-api"
        ]
      },
      {
        name: "Performance Tracker",
        npm: "npm run tools:performance",
        command: "node scripts/agent-performance-tracker.js --summary",
        description: "Tracks AI agent performance and learning metrics",
        examples: [
          "npm run tools:performance",
          "npm run tools:performance -- --log review-results.json"
        ]
      }
    ]
  },
  "📝 Content & SEO Automation": {
    description: "Automated blog generation and SEO optimization",
    tools: [
      {
        name: "Blog Post Generator",
        npm: "npm run tools:blog-generate",
        command: "node scripts/generate-blog-post.js",
        description: "Generates SEO-optimized blog posts from content queue",
        examples: [
          "npm run tools:blog-generate"
        ]
      },
      {
        name: "SEO Analysis Agent",
        npm: "npm run tools:seo-analyze -- [file]",
        command: "node scripts/seo-agent.js [file]",
        description: "Comprehensive SEO analysis with 9-category scoring",
        examples: [
          "npm run tools:seo-analyze -- src/content/blog/my-post.md",
          "npm run tools:seo-analyze -- --format json"
        ]
      },
      {
        name: "SEO PR Review",
        npm: "npm run tools:seo-cli -- seo-review --pr [number]",
        command: "node scripts/claude-seo.js seo-review --pr [number]",
        description: "Review PRs for SEO quality (auto-detects latest PR if no number)",
        examples: [
          "npm run tools:seo-cli -- seo-review --pr 123",
          "npm run tools:seo-cli -- seo-review --pr"
        ]
      },
      {
        name: "SEO Auto-Optimizer",
        npm: "npm run tools:seo-optimize -- [file]",
        command: "node scripts/seo-optimizer.js [file]",
        description: "Intelligently optimizes content for better SEO scores",
        examples: [
          "npm run tools:seo-optimize -- src/content/blog/my-post.md",
          "npm run tools:seo-optimize -- --backup"
        ]
      },
      {
        name: "SEO PR Auto-Optimizer",
        npm: "npm run tools:seo-cli -- seo-auto-optimize --pr [number]",
        command: "node scripts/claude-seo.js seo-auto-optimize --pr [number]",
        description: "Auto-optimize PRs for SEO (auto-detects latest PR if no number)",
        examples: [
          "npm run tools:seo-cli -- seo-auto-optimize --pr 123",
          "npm run tools:seo-cli -- seo-auto-optimize --pr"
        ]
      },
      {
        name: "Claude SEO Interface",
        npm: "npm run tools:seo-cli -- [command]",
        command: "node scripts/claude-seo.js [command]",
        description: "CLI interface for SEO operations",
        examples: [
          "npm run tools:seo-cli -- review --file blog.md",
          "npm run tools:seo-cli -- optimize --file blog.md"
        ]
      }
    ]
  },
  "🛠️ Development Tools": {
    description: "Development workflow automation and optimization",
    tools: [
      {
        name: "Image Optimizer",
        command: "npm run optimize:images",
        description: "Optimizes images for web performance",
        examples: [
          "npm run optimize:images",
          "node scripts/optimize-images.js"
        ]
      },
      {
        name: "Route Documentation Generator",
        command: "npm run docs:routes",
        description: "Auto-generates route documentation",
        examples: [
          "npm run docs:routes",
          "node scripts/generate-routes-docs.js"
        ]
      }
    ]
  },
  "⚡ GitHub Workflows": {
    description: "Automated CI/CD and quality assurance workflows",
    tools: [
      {
        name: "Automated Blog Generation",
        file: ".github/workflows/automated-blog-generation.yml",
        description: "Generates blog posts every 3 days automatically",
        trigger: "Schedule (every 3 days) or manual dispatch"
      },
      {
        name: "SEO Review Automation",
        file: ".github/workflows/seo-review-trigger.yml", 
        description: "Analyzes SEO on PR creation/updates",
        trigger: "PR created/updated with blog content"
      },
      {
        name: "Code Review Automation",
        file: ".github/workflows/code-review-automation.yml",
        description: "Automated code quality analysis on PRs",
        trigger: "PR created/updated"
      }
    ]
  },
  "🗂️ Configuration Files": {
    description: "Automation configuration and data files",
    tools: [
      {
        name: "Content Queue",
        file: "content-queue.json",
        description: "Manages scheduled blog post generation",
        usage: "Edit directly to add new content to generation queue"
      }
    ]
  }
};

function printSection(title, section) {
  console.log(`\n${title}`);
  console.log("=".repeat(title.length + 2));
  console.log(`${section.description}\n`);

  section.tools.forEach(tool => {
    console.log(`📋 ${tool.name}`);
    console.log(`   ${tool.description}`);
    
    if (tool.npm) {
      console.log(`   NPM: ${tool.npm}`);
    }
    
    if (tool.command) {
      console.log(`   Direct: ${tool.command}`);
    }
    
    if (tool.file) {
      console.log(`   File: ${tool.file}`);
    }
    
    if (tool.trigger) {
      console.log(`   Trigger: ${tool.trigger}`);
    }
    
    if (tool.usage) {
      console.log(`   Usage: ${tool.usage}`);
    }
    
    if (tool.examples && tool.examples.length > 0) {
      console.log(`   Examples:`);
      tool.examples.forEach(example => {
        console.log(`     ${example}`);
      });
    }
    console.log("");
  });
}

function main() {
  console.log("🤖 BS Display - Automation Tools Overview");
  console.log("==========================================");
  console.log("Complete list of available automation tools and workflows\n");

  Object.entries(tools).forEach(([title, section]) => {
    printSection(title, section);
  });

  console.log("📚 Quick References:");
  console.log("====================");
  console.log("• All tools have npm shortcuts (npm run tools:*) for easy access");
  console.log("• Documentation: See CLAUDE.md for detailed usage patterns");
  console.log("• Code Review: Always run after generating code");
  console.log("• SEO Tools: Target 75+ score for publication");
  console.log("• GitHub Actions: Automated workflows for quality assurance");
  console.log("• Content Queue: Edit content-queue.json for blog automation");
  console.log("\n💡 Common Commands:");
  console.log("• npm run tools - Show this list");
  console.log("• npm run tools:code-review -- --file [file] - Review code");
  console.log("• npm run tools:seo-analyze -- [file] - Analyze SEO");
  console.log("• npm run tools:seo-cli -- seo-review --pr - Review latest PR for SEO");
  console.log("• npm run tools:seo-cli -- seo-auto-optimize --pr - Auto-optimize latest PR");
  console.log("• npm run tools:blog-generate - Generate blog post");
}

main();