# Routes Documentation

> **Auto-generated on 2025-06-27T07:57:26.415Z**  
> This documentation is automatically generated from the codebase.  
> Run `npm run docs:routes` to update.

## Overview

This document provides a comprehensive overview of all routes in the Big Shine Display website, including static pages, dynamic routes, API endpoints, and content collections.

## Route Summary

| Type | Count |
|------|-------|
| Static Routes | 16 |
| Dynamic Routes | 4 |
| API Endpoints | 2 |
| Content Collections | 2 |
| **Total Routes** | **26** |


## Static Routes

### `/`

| Property | Value |
|----------|-------|
| **File** | `index.astro` |
| **Type** | Static Route |
| **SEO Priority** | 1 |


### `/404`

| Property | Value |
|----------|-------|
| **File** | `404.astro` |
| **Type** | Static Route |
| **SEO Priority** | 0.7 |


### `/contact`

| Property | Value |
|----------|-------|
| **File** | `contact.astro` |
| **Type** | Static Route |
| **SEO Priority** | 0.7 |


### `/design-system`

| Property | Value |
|----------|-------|
| **File** | `design-system.astro` |
| **Type** | Static Route |
| **SEO Priority** | 0.7 |


### `/dev/routes`

| Property | Value |
|----------|-------|
| **File** | `dev/routes.astro` |
| **Type** | Static Route |
| **SEO Priority** | 0.7 |


### `/flexible-payment`

| Property | Value |
|----------|-------|
| **File** | `flexible-payment.astro` |
| **Type** | Static Route |
| **SEO Priority** | 0.7 |


### `/lecterns`

| Property | Value |
|----------|-------|
| **File** | `lecterns.astro` |
| **Type** | Static Route |
| **SEO Priority** | 0.7 |


### `/products`

| Property | Value |
|----------|-------|
| **File** | `products/index.astro` |
| **Type** | Static Route |
| **SEO Priority** | 0.7 |


### `/products/accessories`

| Property | Value |
|----------|-------|
| **File** | `products/accessories/index.astro` |
| **Type** | Static Route |
| **SEO Priority** | 0.7 |


### `/products/lecterns`

| Property | Value |
|----------|-------|
| **File** | `products/lecterns/index.astro` |
| **Type** | Static Route |
| **SEO Priority** | 0.7 |


### `/products/smartboards`

| Property | Value |
|----------|-------|
| **File** | `products/smartboards/index.astro` |
| **Type** | Static Route |
| **SEO Priority** | 0.7 |


### `/quiz`

| Property | Value |
|----------|-------|
| **File** | `quiz.astro` |
| **Type** | Static Route |
| **SEO Priority** | 0.7 |


### `/robots.txt`

| Property | Value |
|----------|-------|
| **File** | `robots.txt.ts` |
| **Type** | Static Route |
| **SEO Priority** | 0.7 |


### `/smart-whiteboard-buying-guide`

| Property | Value |
|----------|-------|
| **File** | `smart-whiteboard-buying-guide.astro` |
| **Type** | Static Route |
| **SEO Priority** | 0.7 |


### `/smartboards`

| Property | Value |
|----------|-------|
| **File** | `smartboards.astro` |
| **Type** | Static Route |
| **SEO Priority** | 0.7 |


### `/terms-and-conditions`

| Property | Value |
|----------|-------|
| **File** | `terms-and-conditions.astro` |
| **Type** | Static Route |
| **SEO Priority** | 0.7 |



## Dynamic Routes

### `/blog/[id]`

| Property | Value |
|----------|-------|
| **File** | `blog/[id].astro` |
| **Type** | Dynamic Route |
| **SEO Priority** | 0.7 |
| **Parameters** | `id` |

**Examples:**

- [`/blog/best-smart-whiteboard-brands-2025`](/blog/best-smart-whiteboard-brands-2025) - Best Smart Whiteboard Brands 2025
- [`/blog/capacitive-vs-infrared-touch-screen`](/blog/capacitive-vs-infrared-touch-screen) - Capacitive vs Infrared Touch Screen
- [`/blog/how-smartboards-work`](/blog/how-smartboards-work) - How Smart Boards Work

**Parameters:**

- **`id`** (single) - Generated from filename


### `/products/lecterns/[brand]/[id]`

| Property | Value |
|----------|-------|
| **File** | `products/lecterns/[brand]/[id].astro` |
| **Type** | Dynamic Route |
| **SEO Priority** | 0.7 |
| **Parameters** | `id`, `brand` |

**Examples:**

- [`/products/lecterns/smart/podium-624`](/products/lecterns/smart/podium-624) - SMART Podium 624
- [`/products/lecterns/maxhub/smart-lectern`](/products/lecterns/maxhub/smart-lectern) - Maxhub Smart Lectern

**Parameters:**

- **`id`** (single) - Generated from filename
- **`brand`** (generated) - Generated from getStaticPaths


### `/products/smartboards/[brand]/[id]`

| Property | Value |
|----------|-------|
| **File** | `products/smartboards/[brand]/[id].astro` |
| **Type** | Dynamic Route |
| **SEO Priority** | 0.7 |
| **Parameters** | `id`, `brand` |

**Examples:**

- [`/products/smartboards/smart/mx-v5`](/products/smartboards/smart/mx-v5) - SMART Board MX V5
- [`/products/smartboards/metz/metz-board`](/products/smartboards/metz/metz-board) - Metz Interactive Board
- [`/products/smartboards/infinitypro/x-series`](/products/smartboards/infinitypro/x-series) - InfinityPro X-Series

**Parameters:**

- **`id`** (single) - Generated from filename
- **`brand`** (generated) - Generated from getStaticPaths


### `/use-cases/[slug]`

| Property | Value |
|----------|-------|
| **File** | `use-cases/[slug].astro` |
| **Type** | Dynamic Route |
| **SEO Priority** | 0.7 |
| **Parameters** | `slug` |

**Examples:**

- [`/use-cases/corporate-lobby-display`](/use-cases/corporate-lobby-display) - Corporate Lobby Display Solution
- [`/use-cases/retail-led-wall`](/use-cases/retail-led-wall) - Retail LED Wall Implementation

**Parameters:**

- **`slug`** (single) - Generated from filename



## Content Collections

### `/blog`

| Property | Value |
|----------|-------|
| **File** | `blog/index.astro` |
| **Type** | Content Collection |
| **SEO Priority** | 0.8 |


### `/use-cases`

| Property | Value |
|----------|-------|
| **File** | `use-cases/index.astro` |
| **Type** | Content Collection |
| **SEO Priority** | 0.7 |



## API Endpoints

### `/api/blog-posts`

| Property | Value |
|----------|-------|
| **File** | `api/blog-posts.ts` |
| **Type** | API Endpoint |
| **SEO Priority** | 0.7 |


### `/api/contact`

| Property | Value |
|----------|-------|
| **File** | `api/contact.ts` |
| **Type** | API Endpoint |
| **SEO Priority** | 0.7 |



## Generated Routes

### `/products/lecterns/[brand]`

| Property | Value |
|----------|-------|
| **File** | `products/lecterns/[brand]/index.astro` |
| **Type** | Static Generated |
| **SEO Priority** | 0.7 |
| **Parameters** | `brand` |

**Parameters:**

- **`brand`** (generated) - Generated from getStaticPaths


### `/products/smartboards/[brand]`

| Property | Value |
|----------|-------|
| **File** | `products/smartboards/[brand]/index.astro` |
| **Type** | Static Generated |
| **SEO Priority** | 0.7 |
| **Parameters** | `brand` |

**Parameters:**

- **`brand`** (generated) - Generated from getStaticPaths



---

## Maintenance

This documentation is automatically generated by `scripts/generate-routes-docs.js`.

### Update Documentation

```bash
npm run docs:routes
```

### Add New Routes

1. Create new files in `src/pages/`
2. Run `npm run docs:routes` to update documentation
3. Commit both route files and updated `ROUTES.md`

### Sitemap Configuration

Route priorities and change frequencies are configured in `astro.config.mjs` under the sitemap integration.

**Last updated:** 2025-06-27T07:57:26.415Z
