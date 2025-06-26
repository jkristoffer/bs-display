# Data Management Standards

## Overview

Guidelines for organizing static data, configuration files, and business information across the project.

## Directory Structure

### Static Configuration Data
```
src/config/
├── company.json      # Company information, branding, specializations
├── contact.json      # Addresses, phone numbers, emails
├── business.json     # Hours, services, payment options
├── social.json       # Social media links and handles
├── seo.json         # SEO metadata and structured data
└── index.ts         # TypeScript exports and type definitions
```

### Product Data
```
src/data/
├── models.*.json    # Product specifications by brand
├── lecterns.*.json  # Lectern product data
└── schema.*.json    # Data validation schemas
```

## Configuration Standards

### File Organization
- **Company Info**: `src/config/company.json` - Name, tagline, target markets, geographic coverage
- **Contact Details**: `src/config/contact.json` - Addresses, phones, emails by location
- **Business Operations**: `src/config/business.json` - Hours, services, payment methods
- **Social Media**: `src/config/social.json` - Platform links and handles
- **SEO Data**: `src/config/seo.json` - Metadata, structured data, organization info

### Data Quality
- **Mark Placeholder Data**: Use `_note` fields to identify unverified information
- **Consistent Formatting**: Phone numbers with country codes, standardized email domains
- **Type Safety**: Export TypeScript interfaces from `index.ts`

### Import Patterns
```typescript
// Preferred import method
import { companyConfig, contactConfig } from '@/config';

// Individual imports when needed
import companyConfig from '@/config/company.json';
```

### Usage Guidelines

#### When to Use Config Data
- Contact information in headers/footers
- Company details in SEO components
- Business hours on contact pages
- Social media links in navigation
- Structured data for search engines

#### When to Use Product Data (`src/data/`)
- Product catalogs and specifications
- Filter options and categories
- Pricing and availability
- Technical specifications

### Data Validation
- Use JSON schemas for product data validation
- Include TypeScript interfaces for config objects
- Validate contact information consistency across files
- Check for placeholder data before production

### Migration Strategy
When moving hardcoded data to config:
1. Extract data to appropriate config file
2. Update components to import from config
3. Add TypeScript types if needed
4. Mark any placeholder data for verification
5. Test that functionality remains unchanged

## Examples

### Component Usage
```astro
---
import { contactConfig, businessConfig } from '@/config';
---

<footer>
  <p>{contactConfig.primary.address}</p>
  <p>Hours: {businessConfig.hours.formatted.weekdays}</p>
</footer>
```

### Type-Safe Access
```typescript
import { type ContactConfig, contactConfig } from '@/config';

const primaryEmail: string = contactConfig.primary.email;
```

### Conditional Rendering
```jsx
import { socialConfig } from '@/config';

{!socialConfig._note && (
  <SocialLinks platforms={socialConfig.platforms} />
)}
```

## Benefits

- **Centralized Management**: Single source of truth for business information
- **Type Safety**: TypeScript interfaces prevent data access errors
- **Easy Updates**: Change business details without touching multiple components
- **Placeholder Tracking**: Clear identification of data needing verification
- **SEO Consistency**: Structured data matches contact information automatically