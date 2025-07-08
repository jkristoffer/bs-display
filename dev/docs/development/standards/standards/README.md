# Development Standards

This directory contains implementation standards for consistent development patterns in the BigShine Display project.

## Philosophy

- **AI-First**: Clear patterns optimized for AI assistant development
- **Practical**: Guidelines that improve code quality without overhead
- **Consistent**: Standardized approaches across all development work

## Standards Files

- [`component-standards.md`](./component-standards.md) - React/Astro component patterns and file structure
- [`file-naming.md`](./file-naming.md) - Naming conventions for files and directories
- [`styling-patterns.md`](./styling-patterns.md) - SCSS modules and CSS architecture
- [`data-management.md`](./data-management.md) - Static data organization and configuration patterns
- **NEW**: [`GRADIENT_SYSTEM_QUICK_REFERENCE.md`](./GRADIENT_SYSTEM_QUICK_REFERENCE.md) - Complete guide to the modern gradient system

## 🎨 New Gradient System

The project now includes a comprehensive **modern gradient system** with:
- **25+ utility classes** for instant styling
- **8 gradient backgrounds** for sections and cards
- **4 gradient text effects** for headlines
- **3 glassmorphism effects** for modern interfaces
- **Enhanced button system** with 7 variants
- **Fluid typography** that scales across devices
- **Hardware-accelerated animations**

**Quick Start**: Visit `/test-gradients` to see all effects in action, or check the [Gradient System Quick Reference](./GRADIENT_SYSTEM_QUICK_REFERENCE.md) for complete usage examples.

## Relationship to AI Development

These standards provide **detailed implementation guidance** that supports the AI development patterns defined in [`CLAUDE.md`](../../CLAUDE.md). 

- **CLAUDE.md**: Complete AI guidance including workflows, collaboration patterns, and mandatory practices
- **Standards (this directory)**: Specific implementation details for components, styling, files, and data

## Usage

**For AI Assistants:**
1. Follow the mandatory patterns in CLAUDE.md first
2. Reference these standards for specific implementation details
3. Apply patterns consistently across all development work

**For Code Maintenance:**
- Gradually align existing code with these standards during updates
- Use standards as reference when making architectural decisions
- Update standards when better patterns emerge through usage