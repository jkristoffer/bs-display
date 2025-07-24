// Stylelint Configuration for CSS Cleanup Project
// This configuration enforces the new CSS architecture patterns

module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-css-modules'
  ],
  
  plugins: [
    'stylelint-scss',
    'stylelint-high-performance-animation'
  ],
  
  rules: {
    // Enforce semantic variable naming
    'custom-property-pattern': [
      '^(color|spacing|font|shadow|radius|z|transition|breakpoint)-[a-z0-9-]+$',
      {
        message: 'Custom properties must follow semantic naming: color-*, spacing-*, font-*, etc.'
      }
    ],
    
    // SCSS variable naming
    'scss/dollar-variable-pattern': [
      '^(color|spacing|font|shadow|radius|z|transition|breakpoint)-[a-z0-9-]+$',
      {
        message: 'SCSS variables must follow semantic naming: $color-*, $spacing-*, $font-*, etc.'
      }
    ],
    
    // Prevent hardcoded values
    'declaration-property-value-disallowed-list': {
      '/.*/': [
        // Prevent hardcoded colors
        '/^#[0-9a-fA-F]{3,6}$/',
        '/^rgb\\(/',
        '/^rgba\\(/',
        '/^hsl\\(/',
        '/^hsla\\(/',
        // Prevent hardcoded sizes (with exceptions)
        '/^[0-9]+px$/',
        '/^[0-9]+em$/',
        '/^[0-9]+rem$/'
      ]
    },
    
    // Allow only approved values
    'declaration-property-value-allowed-list': {
      'color': [
        // Only allow variables and semantic keywords
        '/^\\$color-/',
        '/^var\\(--color-/',
        'transparent',
        'inherit',
        'currentColor'
      ],
      'background-color': [
        '/^\\$color-/',
        '/^var\\(--color-/',
        'transparent',
        'inherit'
      ],
      'border-color': [
        '/^\\$color-/',
        '/^var\\(--color-/',
        'transparent',
        'inherit'
      ],
      'padding': [
        '/^\\$spacing-/',
        '/^var\\(--spacing-/',
        '0',
        'inherit'
      ],
      'margin': [
        '/^\\$spacing-/',
        '/^var\\(--spacing-/',
        '0',
        'auto',
        'inherit'
      ],
      'font-size': [
        '/^\\$font-size-/',
        '/^var\\(--font-size-/',
        'inherit'
      ],
      'font-weight': [
        '/^\\$font-weight-/',
        '/^var\\(--font-weight-/',
        'inherit',
        'normal',
        'bold'
      ]
    },
    
    // CSS Modules specific rules
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]*$',
      {
        message: 'CSS Module class names should be camelCase'
      }
    ],
    
    // Performance rules
    'plugin/no-low-performance-animation-properties': true,
    
    // SCSS specific rules
    'scss/at-import-partial-extension': 'never',
    'scss/at-import-partial-extension-blacklist': ['scss'],
    
    // Prevent global styles in modules
    'selector-pseudo-class-disallowed-list': [
      'global'
    ],
    
    // Enforce consistent spacing
    'declaration-block-semicolon-newline-after': 'always',
    'rule-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment']
      }
    ],
    
    // File organization
    'no-duplicate-selectors': true,
    'no-descending-specificity': true,
    
    // Modern CSS practices
    'property-disallowed-list': [
      'float',
      'clear'
    ],
    
    // Accessibility
    'font-family-no-missing-generic-family-keyword': true,
    
    // Browser compatibility
    'property-no-vendor-prefix': [
      true,
      {
        ignoreProperties: ['appearance']
      }
    ]
  },
  
  ignoreFiles: [
    'node_modules/**/*',
    'dist/**/*',
    'public/**/*',
    'src/styles/legacy/**/*'
  ],
  
  overrides: [
    {
      // Stricter rules for component files
      files: ['src/components/**/*.module.scss'],
      rules: {
        // No global selectors in component modules
        'selector-max-universal': 0,
        'selector-max-type': 1,
        'selector-max-id': 0,
        
        // Enforce CSS Modules patterns
        'selector-class-pattern': [
          '^[a-z][a-zA-Z0-9]*$',
          {
            message: 'Component CSS classes must be camelCase for CSS Modules'
          }
        ]
      }
    },
    
    {
      // More lenient rules for global styles
      files: ['src/styles/global/**/*.scss'],
      rules: {
        'selector-class-pattern': null,
        'custom-property-pattern': null
      }
    },
    
    {
      // Variable definitions file
      files: ['src/styles/variables.scss'],
      rules: {
        'declaration-property-value-disallowed-list': null,
        'declaration-property-value-allowed-list': null
      }
    }
  ]
};