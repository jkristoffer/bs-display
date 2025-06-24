# Quiz Component Guide

This file provides guidance for Claude Code when working with the quiz component system.

## Overview

The quiz component is a **product recommendation engine** that helps users find the best smartboard/interactive display for their needs through a 6-question assessment.

## Architecture

### Core Files
- **`Quiz.tsx`** - Main component that orchestrates the entire quiz flow
- **`quizState.ts`** - State management using useReducer with centralized actions
- **`types.ts`** - TypeScript interfaces for all quiz data structures
- **`quiz-styles.scss`** - Complete styling for all quiz components (22.63kB)
- **`quizdata.json`** - Quiz questions, options, and result configurations

### Component Structure
```
components/
├── QuizIntro.tsx          # Landing page with start button
├── QuizQuestions.tsx      # Question display and option selection
├── QuizResultHeader.tsx   # Result title and category display
├── ProductRecommendations.tsx  # Primary product matches
├── AlternativeRecommendations.tsx  # Secondary options
└── CategoryScores.tsx     # Score breakdown visualization
```

### Utilities
- **`utils/productMatcher.ts`** - Product filtering and scoring algorithms

## Key Patterns

### State Management
- Uses **useReducer** pattern for complex state transitions
- Centralized actions: `START_QUIZ`, `TOGGLE_OPTION`, `SUBMIT_QUIZ`, `SET_ACTIVE_TAB`, `VIEW_ALTERNATIVE`
- State includes: selections, current screen, results, scores, hybrid detection

### Product Matching
- **Weighted scoring system** - Each question has configurable weights
- **Hybrid detection** - 70% threshold for secondary category recommendations
- **Feature filtering** - Matches products by touch technology, size, and features

### Scoring Algorithm
```typescript
// Simple weighted sum approach
categoryScores[option.value] += questionWeight;
// For multi-select: questionWeight / selectedCount
```

## Working with Quiz Components

### Adding New Questions
1. Update `quizdata.json` with new question object
2. Ensure `type` is either `'single'` or `'multi'`
3. Add `weight` property (default: 1)
4. Include `maxSelections` for multi-select questions

### Modifying Product Matching
1. Edit criteria in `utils/productMatcher.ts`
2. Update `categoryToProductCriteria` object
3. Adjust scoring weights in `scoreProductMatch()` function

### Styling Guidelines
- All styles are in `quiz-styles.scss` - **DO NOT** create separate CSS files
- Use existing CSS variables: `--color-accent-primary`, `--spacing-md`, etc.
- Follow responsive patterns with `@media (max-width: $breakpoint-md)`
- Component classes: `.quiz-container`, `.cta-button`, `.result-header`, etc.

### Quiz Flow States
1. **`intro`** - Welcome screen with start button
2. **`questions`** - Multi-step question flow
3. **`results`** - Results display with tabs and recommendations

## Data Structure

### Question Format
```json
{
  "id": "question-id",
  "type": "single|multi",
  "weight": 1,
  "maxSelections": 3,
  "question": "Question text",
  "options": [
    {
      "id": "unique-option-id",
      "label": "Display text",
      "value": "education|corporate|creative|general"
    }
  ]
}
```

### Product Matching
- Products are imported from `../../data/models.all.js`
- Matching criteria: `touchTechnology`, `size`, `features`, `resolution`
- Scoring weights: touch (30%), size (25%), features (30%), resolution (15%)

## Common Tasks

### Debugging Quiz Issues
1. Check browser console for state transitions
2. Verify `quizdata.json` structure
3. Test product matching with different category combinations
4. Validate CSS classes exist in `quiz-styles.scss`

### Performance Considerations
- Quiz bundle size: ~51kB (optimized from original 53kB)
- Product matching runs on client-side
- Results are calculated in real-time
- State updates are optimized with useReducer

### Testing Recommendations
- Test all question combinations
- Verify hybrid detection with close scores
- Check responsive behavior on mobile
- Validate product recommendations match expected criteria

## Important Notes

- **Keep TypeScript** - Complex state management benefits from type safety
- **Centralized styling** - All CSS in one file prevents conflicts
- **Simple scoring** - Weighted sum approach is maintainable and predictable
- **No server dependency** - Entire quiz runs client-side
- **Product data sync** - Quiz results depend on `models.all.js` structure

## Troubleshooting

### Common Issues
1. **Missing styles** - Check if CSS classes exist in `quiz-styles.scss`
2. **Product matching fails** - Verify product data structure in `models.all.js`
3. **State not updating** - Check reducer action types and payload
4. **Hybrid detection** - Ensure scores meet 70% threshold

### Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (validates quiz bundle)
- `npm run lint` - Check for TypeScript/style issues