# AI Orchestrator Integration Guide

> **Quick reference for integrating the code review system with AI orchestrator workflows**

## ⚡ Quick Setup

```bash
# 1. Start API server (for programmatic access)
node scripts/code-review-api-simple.js --port 3001

# 2. Test API endpoint
curl http://localhost:3001/health

# 3. Verify code review agent
node scripts/code-review-agent.js --help
```

## 🤖 AI Agent Workflow

### **Standard Pattern**
```bash
# 1. AI generates code
# 2. Run code review with agent tracking
node scripts/code-review-agent.js \
  --file [generated-file] \
  --ai-mode \
  --agent-id "[agent-identifier]" \
  --task-id "[task-identifier]" \
  --format json

# 3. Check exit code (1 = failing score < 60)
# 4. Log performance data
node scripts/agent-performance-tracker.js --log review-results.json
```

### **API Integration Pattern**
```bash
# POST request to review endpoint
curl -X POST http://localhost:3001/review \
  -H "Content-Type: application/json" \
  -d '{
    "content": "[generated-code]",
    "agentId": "[agent-identifier]", 
    "taskId": "[task-identifier]"
  }'
```

## 📊 Performance Monitoring

### **Agent Performance Reports**
```bash
# Individual agent performance
node scripts/agent-performance-tracker.js --report [agent-id]

# System-wide summary
node scripts/agent-performance-tracker.js --summary

# Export performance data
node scripts/agent-performance-tracker.js --export csv
```

### **Key Metrics Tracked**
- **Overall Score**: 0-100 quality rating
- **Category Scores**: Functional Programming (40%), Project Standards (20%), TypeScript (20%), React (20%)
- **Strengths/Weaknesses**: Automatic identification of agent capabilities
- **Performance Trends**: Improving, stable, or declining over time
- **Task Completion**: Success rates and quality correlation

## 🎯 Quality Thresholds

| Score Range | Grade | Action Required |
|-------------|-------|-----------------|
| 90-100 | A (Excellent) | ✅ Ready for use |
| 80-89 | B (Good) | ⚠️ Minor improvements recommended |
| 70-79 | C (Satisfactory) | ⚠️ Some issues to address |
| 60-69 | D (Needs Work) | ❌ Significant changes required |
| 0-59 | F (Failing) | ❌ Major refactoring needed |

## 🔧 Output Formats

### **JSON Format** (Recommended for APIs)
```json
{
  "summary": {
    "overallScore": 95,
    "grade": "A (Excellent)",
    "status": "EXCELLENT"
  },
  "metadata": {
    "agentId": "claude-dev-1",
    "taskId": "create-component"
  },
  "categories": {
    "functionalProgramming": 90,
    "projectStandards": 94,
    "typeScript": 100,
    "reactPatterns": 100
  },
  "issues": ["Array mutation detected"],
  "recommendations": ["Use spread operator for immutable updates"]
}
```

### **Minimal Format** (For Quick Checks)
```
SCORE: 95/100
STATUS: EXCELLENT
GRADE: A (Excellent)
TOP_ISSUES: Array mutation detected; Missing spread operator
```

## 🚨 Error Handling

### **Exit Codes**
- **0**: Success (score ≥ threshold)
- **1**: Failure (score < threshold or error)

### **Common Issues & Solutions**

**Low Functional Programming Scores**:
- Check for array mutations (push, pop, splice)
- Ensure immutable updates with spread operators
- Use pure functions without side effects
- Prefer map/filter/reduce over imperative loops

**Missing Agent Tracking**:
- Always include `--agent-id` and `--task-id` parameters
- Use consistent agent naming conventions
- Verify performance tracker receives valid JSON

**API Connection Issues**:
- Ensure API server is running on correct port
- Check firewall/network settings for local connections
- Verify JSON request format matches expected schema

## 📈 Best Practices

### **For Orchestrator Systems**
1. **Always track agent performance** - Use consistent agent IDs
2. **Set quality thresholds** - Don't allow failing code to proceed
3. **Monitor trends** - Watch for declining agent performance
4. **Use batch analysis** - For efficiency with multiple files
5. **Cache results** - Avoid re-analyzing unchanged code

### **For AI Agents**
1. **Learn from feedback** - Use recommendations to improve future code
2. **Focus on functional programming** - 40% of score comes from FP compliance
3. **Follow project standards** - Consistent file naming and structure
4. **Include proper TypeScript** - Type annotations and interfaces
5. **Use React best practices** - Hooks, memoization, functional components

## 🔗 Integration Examples

### **Node.js Orchestrator**
```javascript
import { spawn } from 'child_process';

async function reviewGeneratedCode(filePath, agentId, taskId) {
  const result = await new Promise((resolve, reject) => {
    const process = spawn('node', [
      'scripts/code-review-agent.js',
      '--file', filePath,
      '--ai-mode',
      '--agent-id', agentId,
      '--task-id', taskId,
      '--format', 'json'
    ]);
    
    let output = '';
    process.stdout.on('data', (data) => output += data);
    process.on('close', (code) => {
      if (code === 0) {
        resolve(JSON.parse(output));
      } else {
        reject(new Error(`Review failed with code ${code}`));
      }
    });
  });
  
  return result.summary.overallScore;
}
```

### **Python Orchestrator**
```python
import subprocess
import json

def review_code(file_path, agent_id, task_id):
    result = subprocess.run([
        'node', 'scripts/code-review-agent.js',
        '--file', file_path,
        '--ai-mode',
        '--agent-id', agent_id,
        '--task-id', task_id,
        '--format', 'json'
    ], capture_output=True, text=True)
    
    if result.returncode != 0:
        raise Exception(f"Review failed: {result.stderr}")
    
    data = json.loads(result.stdout)
    return data['summary']['overallScore']
```

### **Shell Script Integration**
```bash
#!/bin/bash
review_and_check() {
    local file="$1"
    local agent="$2"
    local task="$3"
    local threshold="${4:-70}"
    
    score=$(node scripts/code-review-agent.js \
        --file "$file" \
        --ai-mode \
        --agent-id "$agent" \
        --task-id "$task" \
        --format minimal | grep "SCORE:" | cut -d' ' -f2 | cut -d'/' -f1)
    
    if [ "$score" -lt "$threshold" ]; then
        echo "❌ Code quality too low: $score/100 (threshold: $threshold)"
        return 1
    else
        echo "✅ Code quality acceptable: $score/100"
        return 0
    fi
}

# Usage
review_and_check "MyComponent.tsx" "claude-dev-1" "create-component" 75
```

---

## 📚 Related Documentation

- **[CODE_REVIEW_AGENT.md](./CODE_REVIEW_AGENT.md)** - Complete system documentation
- **[CLAUDE.md](./CLAUDE.md)** - Project development standards and functional programming requirements
- **[Functional Programming Standards](./CLAUDE.md#functional-programming-standards)** - Detailed FP requirements

---

*This guide covers the essential integration patterns for AI orchestrator systems. For advanced configuration and troubleshooting, see the complete documentation.*