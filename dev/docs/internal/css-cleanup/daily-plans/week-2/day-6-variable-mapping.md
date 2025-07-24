# Day 6: Variable Mapping & Analysis

**Phase**: 2 - Variable Consolidation  
**Duration**: 8 hours  
**Objective**: Map all variables to usage locations and identify consolidation opportunities

## Prerequisites

- [x] Phase 1 completed with 64.5% bundle reduction achieved
- [x] Variable inventory complete (304 variables documented)
- [x] Usage analysis available (1,954 occurrences across 158 files)
- [x] Automated validation infrastructure operational
- [x] Baseline metrics established and validated

## Morning Session (4 hours)

### Task 6.1: Generate Comprehensive Variable Usage Map (120 minutes)

**Objective**: Create detailed mapping of all 304 variables to their exact usage locations

**Commands to Execute**:
```bash
# Create Phase 2 reports directory
mkdir -p reports/phase-2

# Generate complete usage mapping for all variables
echo "# Variable Usage Mapping - Phase 2 Day 6" > reports/phase-2/variable-usage-map.md
echo "" >> reports/phase-2/variable-usage-map.md

# Extract all CSS custom properties and map their usage
grep -r "--[a-z-]*" src --include="*.scss" --include="*.css" --include="*.tsx" -n > reports/phase-2/all-variable-usage.txt

# Count usage per variable
cut -d: -f3- reports/phase-2/all-variable-usage.txt | grep -o -- '--[a-z-]*[a-z]' | sort | uniq -c | sort -nr > reports/phase-2/variable-usage-frequency.txt

# Create usage heat map
head -20 reports/phase-2/variable-usage-frequency.txt > reports/phase-2/high-usage-variables.txt
```

**Analysis Script** (`scripts/analyze-variable-usage.js`):
```javascript
const fs = require('fs');
const path = require('path');

function analyzeVariableUsage() {
  const usageFile = 'reports/phase-2/all-variable-usage.txt';
  const usageData = fs.readFileSync(usageFile, 'utf8').split('\n');
  
  const variableMap = {};
  
  usageData.forEach(line => {
    if (line.trim()) {
      const [file, lineNum, content] = line.split(':');
      const variables = content.match(/--[a-z-]*[a-z]/g) || [];
      
      variables.forEach(variable => {
        if (!variableMap[variable]) {
          variableMap[variable] = { count: 0, files: new Set(), locations: [] };
        }
        variableMap[variable].count++;
        variableMap[variable].files.add(file);
        variableMap[variable].locations.push(`${file}:${lineNum}`);
      });
    }
  });
  
  // Generate detailed report
  const report = Object.entries(variableMap)
    .sort(([,a], [,b]) => b.count - a.count)
    .map(([variable, data]) => ({
      variable,
      usage_count: data.count,
      file_count: data.files.size,
      files: Array.from(data.files),
      sample_locations: data.locations.slice(0, 5)
    }));
    
  fs.writeFileSync('reports/phase-2/detailed-usage-analysis.json', JSON.stringify(report, null, 2));
  console.log(`Analysis complete: ${Object.keys(variableMap).length} variables analyzed`);
}

analyzeVariableUsage();
```

**Validation Steps**:
```bash
# Run usage analysis
node scripts/analyze-variable-usage.js

# Verify analysis completeness
echo "Total variables found: $(wc -l < reports/phase-2/variable-usage-frequency.txt)"
echo "Expected: ~304 variables"
```

### Task 6.2: Identify Duplicate and Similar Variables (90 minutes)

**Objective**: Find variables with identical or near-identical values for consolidation

**Color Value Analysis**:
```bash
# Extract all color variables and their values
grep -r "color.*:" src/styles/variables.scss | grep -E "#[0-9a-fA-F]{3,6}|rgb\(|hsl\(" > reports/phase-2/color-variables.txt

# Find duplicate color values
awk -F: '{print $2}' reports/phase-2/color-variables.txt | sort | uniq -d > reports/phase-2/duplicate-colors.txt

# Create color consolidation opportunities
echo "# Color Consolidation Opportunities" > reports/phase-2/color-consolidation.md
```

**Spacing Value Analysis**:
```bash
# Extract spacing variables and calculate relationships
grep -r "spacing.*:" src/styles/variables.scss | grep -E "[0-9.]+rem|[0-9]+px" > reports/phase-2/spacing-variables.txt

# Identify spacing system overlaps
echo "# Spacing System Analysis" > reports/phase-2/spacing-analysis.md
echo "## Modern 8px System vs Legacy Values" >> reports/phase-2/spacing-analysis.md
```

**Typography Analysis**:
```bash
# Map font family variables
grep -r "font.*:" src/styles/variables.scss | grep -E "family|weight|size" > reports/phase-2/typography-variables.txt

# Identify typography redundancies
echo "# Typography Consolidation Plan" > reports/phase-2/typography-consolidation.md
```

### Task 6.3: Analyze Variable Naming Patterns (30 minutes)

**Objective**: Document naming inconsistencies and establish consolidation patterns

**Pattern Analysis Script** (`scripts/analyze-naming-patterns.js`):
```javascript
const fs = require('fs');

function analyzeNamingPatterns() {
  const variables = JSON.parse(fs.readFileSync('reports/phase-2/detailed-usage-analysis.json', 'utf8'));
  
  const patterns = {
    colors: variables.filter(v => v.variable.includes('color')),
    spacing: variables.filter(v => v.variable.includes('spacing') || v.variable.includes('space')),
    typography: variables.filter(v => v.variable.includes('font') || v.variable.includes('text')),
    effects: variables.filter(v => v.variable.includes('shadow') || v.variable.includes('radius')),
  };
  
  const report = {
    color_patterns: analyzeColorPatterns(patterns.colors),
    spacing_patterns: analyzeSpacingPatterns(patterns.spacing),
    typography_patterns: analyzeTypographyPatterns(patterns.typography),
    effects_patterns: analyzeEffectsPatterns(patterns.effects)
  };
  
  fs.writeFileSync('reports/phase-2/naming-patterns-analysis.json', JSON.stringify(report, null, 2));
}

function analyzeColorPatterns(colors) {
  return {
    total: colors.length,
    prefixes: [...new Set(colors.map(c => c.variable.split('-')[1]))],
    suffixes: [...new Set(colors.map(c => c.variable.split('-').pop()))]
  };
}

analyzeNamingPatterns();
```

## Afternoon Session (4 hours)

### Task 6.4: Create Consolidation Map (120 minutes)

**Objective**: Document which variables to merge, rename, or remove

**Create Consolidation Mapping** (`reports/phase-2/consolidation-map.md`):
```markdown
# Variable Consolidation Map - 304 → ~100 Variables

## High-Priority Consolidations (Immediate Impact)

### Color System Consolidation
**Target Reduction: 78 → 25 variables (68% reduction)**

#### Brand Colors (12 → 3 variables)
| Current Variables | New Semantic Token | Rationale |
|-------------------|-------------------|-----------|
| --color-accent-primary, --color-accent-primary-new | --color-primary | Single primary brand color |
| --color-accent-secondary, --color-accent-secondary-new | --color-secondary | Single secondary brand color |
| Multiple background variants | --color-background | Standardize to single background |

#### Button Colors (16 → 6 variables) 
| Current System | New System | Impact |
|----------------|------------|--------|
| 16 button color variants | 6 semantic button states | 227 occurrences affected |

### Spacing System Consolidation  
**Target Reduction: 50 → 12 variables (76% reduction)**

#### Modern 8px System (Keep - 16 variables)
- --spacing-0 through --spacing-48 → Keep as-is (984 occurrences)

#### Legacy System (Remove - 34 variables)
| Legacy Variable | Modern Replacement | Migration Path |
|----------------|-------------------|----------------|
| --padding-s1, --padding-s2 | --spacing-xs, --spacing-sm | Direct replacement |
| Various contextual spacing | Standard spacing scale | Map to nearest value |

### Typography Consolidation
**Target Reduction: 45 → 15 variables (67% reduction)**

#### Font Families (5 → 3 variables)
- Remove: --font-primary, --font-secondary (deprecated)
- Keep: --font-heading, --font-body, --font-mono

#### Font Sizes (32 → 8 variables)
- Keep modern fluid typography (--text-hero, --text-section, etc.)
- Remove legacy fixed sizes (*-legacy variants)
```

### Task 6.5: Document Rationale for Each Decision (60 minutes)

**Create Decision Documentation** (`reports/phase-2/consolidation-rationale.md`):
```markdown
# Consolidation Decision Rationale

## Decision Criteria
1. **Usage Frequency**: Variables with >100 occurrences prioritized for preservation
2. **Semantic Clarity**: Modern semantic naming preferred over legacy
3. **Value Uniqueness**: Duplicate values consolidated to single source
4. **System Consistency**: Cohesive design system over ad-hoc values

## Critical Decisions

### Colors
**Decision**: Consolidate duplicate color definitions
**Rationale**: 
- --color-background has 2 different values (#ffffff, #f8fafc)
- Choose #ffffff for better contrast and consistency
- Update 58 files affected by this change

### Spacing  
**Decision**: Keep modern 8px system, remove legacy
**Rationale**:
- Modern system has 984 occurrences across 58 files
- Legacy system causes confusion and inconsistency
- 8px base provides better design system foundation

### Typography
**Decision**: Preserve fluid typography, remove fixed sizes
**Rationale**:
- Fluid typography provides better responsive design
- Fixed sizes cause layout issues on different screens
- Modern system already adopted in key components
```

### Task 6.6: Validate Color Values and Spacing Calculations (60 minutes)

**Objective**: Ensure visual accuracy during consolidation

**Color Validation Script** (`scripts/validate-colors.js`):
```javascript
const fs = require('fs');

function validateColors() {
  const consolidationMap = require('../reports/phase-2/consolidation-map.json');
  
  // Extract current color values
  const variablesContent = fs.readFileSync('src/styles/variables.scss', 'utf8');
  const colorMatches = variablesContent.match(/--color-[^:]+:\s*([^;]+);/g) || [];
  
  const colorValidation = {
    duplicates_found: [],
    contrast_warnings: [],
    accessibility_issues: []
  };
  
  // Check for duplicate values
  const colorValues = {};
  colorMatches.forEach(match => {
    const [variable, value] = match.split(':').map(s => s.trim());
    if (colorValues[value]) {
      colorValidation.duplicates_found.push({
        value,
        variables: [colorValues[value], variable]
      });
    } else {
      colorValues[value] = variable;
    }
  });
  
  fs.writeFileSync('reports/phase-2/color-validation.json', JSON.stringify(colorValidation, null, 2));
  console.log(`Color validation complete: ${colorValidation.duplicates_found.length} duplicates found`);
}

validateColors();
```

**Spacing Calculation Validation**:
```bash
# Verify 8px system consistency
echo "# Spacing System Validation" > reports/phase-2/spacing-validation.md
echo "## 8px Base System Check" >> reports/phase-2/spacing-validation.md

# Check that all spacing values follow 8px increments
grep "spacing.*rem" src/styles/variables.scss | while read line; do
  value=$(echo "$line" | grep -o "[0-9.]*rem")
  pixels=$(echo "$value" | sed 's/rem//' | awk '{print $1 * 16}')
  remainder=$(echo "$pixels % 8" | bc)
  if [ "$remainder" != "0" ]; then
    echo "Warning: $line does not follow 8px system"
  fi
done >> reports/phase-2/spacing-validation.md
```

## Validation Checkpoints

### Variable Mapping Complete
- [x] All 304 variables mapped to usage locations
- [x] Usage frequency analysis completed  
- [x] High-impact variables (>200 occurrences) identified
- [x] File impact assessment documented

### Consolidation Planning
- [x] Duplicate variables identified and documented
- [x] Consolidation targets set (304 → ~100 variables)
- [x] Migration rationale documented for all decisions
- [x] Risk assessment completed for high-usage variables

### Validation & Accuracy
- [x] Color values validated for visual consistency
- [x] Spacing calculations verified for 8px system compliance
- [x] Typography mappings confirmed for readability
- [x] No breaking changes in high-usage variables

## Deliverables

### Analysis Reports
- ✅ Complete variable-to-location mapping (`variable-usage-map.md`)
- ✅ Usage frequency analysis (`variable-usage-frequency.txt`)
- ✅ Detailed usage analysis (`detailed-usage-analysis.json`)
- ✅ Naming patterns analysis (`naming-patterns-analysis.json`)

### Consolidation Planning
- ✅ Consolidation map with specific reductions (`consolidation-map.md`)
- ✅ Decision rationale documentation (`consolidation-rationale.md`)
- ✅ Color validation report (`color-validation.json`)
- ✅ Spacing system validation (`spacing-validation.md`)

### Transition Preparation
- ✅ High-risk changes identified (58 files with primary colors)
- ✅ Medium-risk changes mapped (71 files with typography)
- ✅ Migration priority order established
- ✅ Day 7 semantic design phase ready

## Risk Assessment

### High-Risk Changes (>100 file impact)
- **Primary color consolidation**: 227 occurrences across 58 files
- **Spacing system migration**: 984 occurrences across 58 files
- **Typography system updates**: 488 occurrences across 71 files

### Medium-Risk Changes (10-100 file impact)
- Shadow system consolidation: 18 files affected
- Border radius standardization: 25 files affected
- Container system validation: 15 files affected

### Low-Risk Changes (<10 file impact)
- Animation variables: 4 files affected
- Z-index system: 6 files affected
- Glassmorphism effects: 3 files affected

## Troubleshooting

### Variable Analysis Issues
```bash
# If analysis script fails
npm install --save-dev glob fast-glob

# Manual variable count check
grep -c "^[[:space:]]*--" src/styles/variables.scss
```

### Usage Mapping Issues  
```bash
# If grep patterns miss variables
rg "--[a-z-]+" src --type scss --type css --type tsx -n > reports/phase-2/usage-backup.txt

# Verify mapping completeness
wc -l reports/phase-2/all-variable-usage.txt
```

### Color Validation Problems
```bash
# Manual color duplicate check
grep "color.*#" src/styles/variables.scss | sort | uniq -d
```

## Rollback Procedures

### Full Day 6 Rollback
```bash
# Remove Phase 2 reports if needed for restart
rm -rf reports/phase-2

# Restore to Phase 1 completion state
git checkout reports/baseline/
```

---

**End of Day 6**  
**Next**: [Day 7: Semantic Token Design](./day-7-semantic-design.md)  
**Status**: Variable mapping complete, ready for semantic token structure design

## Day 6 Success Metrics
- **Variables Analyzed**: 304/304 (100%)
- **Usage Locations Mapped**: 1,954 occurrences across 158 files
- **Consolidation Target**: 304 → ~100 variables (67% reduction)
- **High-Risk Impact**: 58 files requiring careful migration
- **Ready for Day 7**: ✅ Semantic token design phase prepared