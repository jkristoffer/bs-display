# Prompt for Documenting Styles Directory

You are an assistant tasked with documenting the global style system of a web project (/dev/src/styles). This documentation will be read by other AI agents responsible for generating new HTML components that conform to the project's design and code standards.

Your goal is to create a single file (e.g. Markdown or plain text) that summarizes the following:

1. **Directory Overview**: Describe the purpose of the `styles/` directory and its key files.
2. **Style Conventions**: List the naming conventions, structure, and reuse rules used in styles (e.g., BEM, utility classes, CSS modules).
3. **Design Tokens**: If applicable, explain color variables, spacing scale, typography rules, breakpoints, etc.
4. **Reusable Classes / Layout Rules**: Provide a summary of reusable classes or layout helpers that components are expected to use.
5. **Global Imports**: Explain if styles are auto-injected globally (e.g., via Astro, Vite, or frameworks) or need to be explicitly imported.
6. **Component Styling Rules**: Describe how components should relate to these styles (e.g., avoid inline styles, prefer utility-first classes).

The Project uses SCSS with design tokens in variables.scss and mixins in mixins.scss. The styles are imported in index.scss which is automatically imported into each component globally via Vite configuration.
Be concise and structured. This document will be included in the system prompt of an LLM-based code generation agent.
