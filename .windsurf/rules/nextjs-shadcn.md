---
trigger: always_on
---

You are an expert in TypeScript, React, Node.js, Next.js App Router, Shadcn UI, TailwindCSS.

## Code Style and Structure

- Write concise, technical TypeScript code using the rules below
- Use functional and declarative programming patterns; avoid classes
- Prefer iteration and modularization over code duplication
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Structure files: exported component, subcomponents, helpers, static content

## Rules

- No unused variables.
- For multi-line if statements, use curly braces.
- Always handle the error function parameter and error in try/catch blocks.
- Use camelcase for variables and functions.
- Use PascalCase for constructors and React components.

## Naming Conventions

- Use lowercase with dashes for directories (e.g., components/auth-wizard).
- Use named exports; avoid default exports (e.g. export const Button = () => {})

# React Best Practices

- Implement hooks correctly (useState, useEffect, useContext, useReducer, useMemo, useCallback, useActionState).
- Follow the Rules of Hooks (only call hooks at the top level, only call hooks from React functions).
- Create custom hooks to extract reusable component logic.
- Prefer composition over inheritance.
- Use children prop and render props pattern for flexible, reusable components.
- Implement React.lazy() and Suspense for code splitting.
- Use refs sparingly and mainly for DOM access.
- Prefer controlled components over uncontrolled components.
- Implement error boundaries to catch and handle errors gracefully.
- Use cleanup functions in useEffect to prevent memory leaks.
- Use short-circuit evaluation and ternary operators for conditional rendering.
- Use dynamic loading for non-critical components.

## UI and Styling

- Use Shadcn UI for component foundations from @`@/components/ui`
- Implement responsive design with Tailwind CSS v4; use a mobile-first approach.
- Use Tailwind for utility classes and rapid prototyping.
- Implement dark mode support

## Forms and Validation

- Use controlled components for form inputs.
- Implement form validation (client-side and server-side).
- Do not use react-hook-form; use native form element, always utilize React Server Functions using form actions, with either the useActionState hook or useTransition where appropriate.
- Use Zod for schema validation.

## Page Metadata

- Page metadata should be created using Next.js metadata export (e.g. export const metadata)
- For dynamic metadata, use Next.js generateMetadata() function

## Error Handling and Validation

- Prioritize error handling and edge cases.
- Handle errors and edge cases at the beginning of functions.
- Use early returns for error conditions to avoid deeply nested if statements.
- Place the happy path last in the function for improved readability.
- Avoid unnecessary else statements; use if-return pattern instead.
- Use guard clauses to handle preconditions and invalid states early.
- Implement proper error logging and user-friendly error messages.

## Accessibility (a11y)

- Use semantic HTML elements.
- Implement proper ARIA attributes.
- Ensure keyboard navigation support.

## Security

- Sanitize user inputs to prevent XSS attacks.
- Use dangerouslySetInnerHTML sparingly and only with sanitized content.
- Use "server-only" library on server-side data functions
- Apply "use server" directive in React Server Functions - only use Server Functions for data mutation. NEVER apply "use server" directive for standard data fetching.

Follow latest Next.js conventions for Data Fetching, Rendering, and Routing. See @Next.js Documentation
