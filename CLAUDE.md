# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

This is a fasting log application built with Deno and Oak framework. The
application serves a static HTML frontend that uses Datastar for reactive UI
components.

It will use plain CSS for styling HTML, not Tailwind no other CSS frameworks.

## Architecture

- **Backend**: Simple Deno server using Oak framework (main.ts:1-16)
  - Serves static files from the `view/` directory
  - Runs on port 3500
- **Frontend**: Single HTML page with Datastar framework integration
  - Uses Datastar v1.0.0-beta.11 for reactive data binding
  - Currently contains example code (toaster question) to be replaced with
    fasting log functionality

## Development Commands

```bash
# Start development server with auto-reload
deno task dev

# Start production server
deno task start

# Check code formatting, linting, and type checking
deno task check

# Format code (uses semicolon-free style)
deno fmt

# Lint code
deno lint

# Type check
deno check **/*.ts
```

## Code Style

- No semicolons (configured in deno.json:8)
- Uses Deno's recommended lint rules
- TypeScript with strict checking enabled
- Unless required, prefer to use arrow functions instead of `function`, so
  instead of creating something like:

```ts
async function someFunction(param1: any, param2: any) {
  // ...
}
```

Please create it like:

```ts
const someFunction = async (param1: any, param2: any) => {
  // ...
}
```

- Try to think harder when creating new functions and not use `any` to describe
  parameters or output types. Also try to define output types for all functions
  created.
- When a type or a class is imported **only** to indicate a type, then please
  import it separatedly, for example: Instead of

```ts
import { Application, Context, Router } from "https://deno.land/x/oak/mod.ts"
```

Do

```ts
import type { Context } from "https://deno.land/x/oak/mod.ts"

import { Application, Router } from "https://deno.land/x/oak/mod.ts"
```

And put all the type imports at the beginning of the file.

## Code Organization

- **No complex code in strings**: Avoid creating complex logic inside HTML data attributes or string literals. Only short expressions (function calls, simple ternary operators) are allowed in strings. Any code that spans more than a single short line must be extracted into its own module or a general-purpose module.

Examples of what NOT to do:
```html
<!-- BAD: Complex logic in data attribute -->
<button data-on-click="
  $isSubmitting = true;
  $loginError = '';
  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: $email, password: $password })
  })
  .then(response => response.json())
  .then(data => {
    // more complex logic...
  });
">
```

Examples of what TO do:
```html
<!-- GOOD: Simple function call -->
<button data-on-click="login()">

<!-- GOOD: Short ternary operator -->
<span data-text="$isSubmitting ? 'Loading...' : 'Submit'">
```

## Testing

- when creating utility functions, also add unit tests for those functions using
  integrated Deno testing facilities.

## Workflow

- Be sure to typecheck when you’re done making a series of code changes
- Prefer running single tests, and not the whole test suite, for performance
