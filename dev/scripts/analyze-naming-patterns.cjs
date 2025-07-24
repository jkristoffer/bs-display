const fs = require('fs');

function analyzeNamingPatterns() {
  const detailedAnalysis = JSON.parse(fs.readFileSync('reports/phase-2/detailed-usage-analysis.json', 'utf8'));
  
  const patterns = {
    colors: detailedAnalysis.filter(v => v.variable.includes('color')),
    spacing: detailedAnalysis.filter(v => v.variable.includes('spacing') || v.variable.includes('space')),
    typography: detailedAnalysis.filter(v => v.variable.includes('font') || v.variable.includes('text')),
    effects: detailedAnalysis.filter(v => v.variable.includes('shadow') || v.variable.includes('radius') || v.variable.includes('gradient')),
    layout: detailedAnalysis.filter(v => v.variable.includes('container') || v.variable.includes('breakpoint')),
    animation: detailedAnalysis.filter(v => v.variable.includes('duration') || v.variable.includes('ease')),
    zindex: detailedAnalysis.filter(v => v.variable.includes('z-'))
  };
  
  function analyzeColorPatterns(colors) {
    const prefixes = [...new Set(colors.map(c => {
      const parts = c.variable.split('-');
      return parts.length > 2 ? parts[1] : null;
    }).filter(Boolean))];
    
    const suffixes = [...new Set(colors.map(c => {
      const parts = c.variable.split('-');
      return parts.length > 2 ? parts[parts.length - 1] : null;
    }).filter(Boolean))];
    
    const semanticColors = colors.filter(c => 
      c.variable.includes('primary') || c.variable.includes('secondary') || 
      c.variable.includes('success') || c.variable.includes('error') || 
      c.variable.includes('warning') || c.variable.includes('info')
    );
    
    return {
      total: colors.length,
      prefixes,
      suffixes,
      semantic_colors: semanticColors.length,
      high_usage: colors.filter(c => c.usage_count > 50).length,
      patterns: {
        accent_pattern: colors.filter(c => c.variable.includes('accent')).length,
        button_pattern: colors.filter(c => c.variable.includes('button')).length,
        text_pattern: colors.filter(c => c.variable.includes('text')).length,
        surface_pattern: colors.filter(c => c.variable.includes('surface') || c.variable.includes('background')).length
      }
    };
  }
  
  function analyzeSpacingPatterns(spacing) {
    const numericSpacing = spacing.filter(s => /--spacing-\d+/.test(s.variable));
    const semanticSpacing = spacing.filter(s => /--spacing-(xs|sm|md|lg|xl|xxl)/.test(s.variable));
    const contextualSpacing = spacing.filter(s => 
      s.variable.includes('padding') || s.variable.includes('margin') || 
      s.variable.includes('gap') || s.variable.includes('container')
    );
    
    return {
      total: spacing.length,
      numeric_system: numericSpacing.length,
      semantic_system: semanticSpacing.length,
      contextual_system: contextualSpacing.length,
      high_usage: spacing.filter(s => s.usage_count > 50).length
    };
  }
  
  function analyzeTypographyPatterns(typography) {
    const fontSizes = typography.filter(t => t.variable.includes('font-size') || t.variable.includes('text-'));
    const fontFamilies = typography.filter(t => t.variable.includes('font-') && !t.variable.includes('size') && !t.variable.includes('weight'));
    const fontWeights = typography.filter(t => t.variable.includes('weight'));
    const lineHeights = typography.filter(t => t.variable.includes('line-height'));
    
    const fluidTypography = typography.filter(t => t.variable.startsWith('--text-'));
    const legacyTypography = typography.filter(t => t.variable.includes('legacy') || t.variable.includes('font-size-h'));
    
    return {
      total: typography.length,
      font_sizes: fontSizes.length,
      font_families: fontFamilies.length,
      font_weights: fontWeights.length,
      line_heights: lineHeights.length,
      fluid_system: fluidTypography.length,
      legacy_system: legacyTypography.length,
      high_usage: typography.filter(t => t.usage_count > 50).length
    };
  }
  
  function analyzeEffectsPatterns(effects) {
    const shadows = effects.filter(e => e.variable.includes('shadow'));
    const radius = effects.filter(e => e.variable.includes('radius'));
    const gradients = effects.filter(e => e.variable.includes('gradient'));
    
    return {
      total: effects.length,
      shadows: shadows.length,
      border_radius: radius.length,
      gradients: gradients.length,
      high_usage: effects.filter(e => e.usage_count > 10).length
    };
  }
  
  const report = {
    analysis_date: new Date().toISOString(),
    total_variables_analyzed: detailedAnalysis.length,
    category_breakdown: {
      colors: analyzeColorPatterns(patterns.colors),
      spacing: analyzeSpacingPatterns(patterns.spacing),
      typography: analyzeTypographyPatterns(patterns.typography),
      effects: analyzeEffectsPatterns(patterns.effects),
      layout: {
        total: patterns.layout.length,
        high_usage: patterns.layout.filter(l => l.usage_count > 10).length
      },
      animation: {
        total: patterns.animation.length,
        high_usage: patterns.animation.filter(a => a.usage_count > 10).length
      },
      zindex: {
        total: patterns.zindex.length,
        high_usage: patterns.zindex.filter(z => z.usage_count > 5).length
      }
    },
    naming_consistency_issues: {
      mixed_naming_conventions: [
        'spacing: numeric vs semantic (--spacing-8 vs --spacing-md)',
        'typography: fluid vs legacy (--text-body vs --font-size-body-regular)',
        'colors: accent vs primary inconsistency'
      ],
      consolidation_opportunities: [
        `${patterns.colors.length} color variables can be reduced to ~25`,
        `${patterns.spacing.length} spacing variables can be reduced to ~12`,
        `${patterns.typography.length} typography variables can be reduced to ~15`
      ]
    }
  };
  
  fs.writeFileSync('reports/phase-2/naming-patterns-analysis.json', JSON.stringify(report, null, 2));
  
  console.log('Naming pattern analysis complete:');
  console.log(`- Colors: ${patterns.colors.length} variables`);
  console.log(`- Spacing: ${patterns.spacing.length} variables`);
  console.log(`- Typography: ${patterns.typography.length} variables`);
  console.log(`- Effects: ${patterns.effects.length} variables`);
  
  return report;
}

// Run if called directly
if (require.main === module) {
  analyzeNamingPatterns();
}

module.exports = analyzeNamingPatterns;