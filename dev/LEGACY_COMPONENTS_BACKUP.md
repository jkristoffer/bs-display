# Legacy Components Backup

This file documents the content of orphaned components removed during Issue #4 resolution.

## BaseHead.astro (removed 2025-06-29)
**Location**: `/src/components/BaseHead.astro`  
**Status**: Orphaned - no references found in codebase  
**Replacement**: `BaseLayout.astro` + `SEO.astro`

```astro
---
interface Props {
  title: string;
  description: string;
}
const { title, description } = Astro.props;
import '../styles/global.css';
---

<head>
  <meta charset="UTF-8" />
  <meta name="description" content={description} />
  <title>{title}</title>
  <link rel="icon" href="/assets/favicon.ico" type="image/x-icon" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
    rel="stylesheet"
  />
  <link href="/css/FilterUI.module.css" rel="stylesheet" />
</head>
```

## Index.Brands.astro (removed 2025-06-29)
**Location**: `/src/components/Index.Brands.astro`  
**Status**: Orphaned - no references found in codebase  
**Replacement**: `BrandsSection.astro` in `/src/components/home/BrandsSection/`

```astro
---
let brands = [
    {
        name: "METZ",
        logo_src: "brands/metz_logo.png"
    },
    {
        name: "SMART Board",
        logo_src: "brands/smart_screen_logo.png"
    },
    {
        name: "Promethean",
        logo_src: "brands/promethean_logo.png"
    }
]
---
<div class="brand-container">
    {brands.map(brand => (
        <div class="brand-card card">
            <header>{brand.name}</header>
            <img src=`/assets/${brand.logo_src}` alt="">
            <div>
                <button class="button-faint">Learn More</button>
            </div>
        </div>
    ))}
</div>
<style>
.brand-container {
    display: flex;
    flex-flow: row nowrap;
    gap: calc(var(--padding-s1));
    padding: var(--padding-s1) 0;
}
.brand-card {
    flex-grow: 1;
    img {
        width: 150px;
        margin: var(--padding-s1) 0;
    }
}
</style>
```

## Index.Usecases.astro (removed 2025-06-29)
**Location**: `/src/components/Index.Usecases.astro`  
**Status**: Orphaned - no references found in codebase  
**Replacement**: `UsecasesSection.astro` in `/src/components/home/UsecasesSection/`

*[Content truncated for brevity - full 175-line file with classroom, office, and training center use cases]*

## Removal Justification
- **Zero active references**: Comprehensive search found no imports or usage
- **Modern replacements exist**: Updated components actively used in current architecture
- **Architectural consistency**: Removal aligns with established feature-based organization
- **No functionality loss**: Modern components provide same or enhanced functionality

## Restoration Process
If these components need to be restored:
1. Copy content from this backup file
2. Create new component files in appropriate feature directories
3. Follow current component standards and TypeScript patterns
4. Update imports in consuming components