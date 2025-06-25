# Development Standards

This directory contains lightweight standards for consistent development patterns. These are **guidelines, not rigid rules** - they can evolve as the project grows.

## Philosophy

- **Standards First, Tools Later**: Define how things should be done, add automation only when manual adherence breaks down
- **AI-Friendly**: Clear patterns help AI assistants provide better code
- **Scalable**: Start simple, add complexity only when needed

## Standards Files

### Current Development Standards
- [`component-standards.md`](./component-standards.md) - React/Astro component patterns
- [`work-item-template.md`](./work-item-template.md) - Project management format
- [`file-naming.md`](./file-naming.md) - Naming conventions
- [`styling-patterns.md`](./styling-patterns.md) - SCSS and CSS standards

### AI-Agent-First Standards (Future)
- [`ai-agent-work-items.md`](./ai-agent-work-items.md) - Machine-parseable work item format for AI agents
- [`agent-coordination.md`](./agent-coordination.md) - Multi-agent coordination protocols
- [`automated-verification.md`](./automated-verification.md) - Automated testing from acceptance criteria

## Usage

1. **For New Development**: Follow these patterns
2. **For Existing Code**: Gradually align during maintenance
3. **For AI Assistance**: Reference these in prompts for consistent output

## Evolution

Standards should change when:
- Current patterns create more friction than value
- Project scale demands different approaches
- Team consensus identifies better patterns

Update standards through discussion, not unilateral changes.