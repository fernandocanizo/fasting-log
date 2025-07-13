# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a fasting log application built with Deno and Oak framework. The application serves a static HTML frontend that uses Datastar for reactive UI components.

## Architecture

- **Backend**: Simple Deno server using Oak framework (main.ts:1-16)
  - Serves static files from the `view/` directory
  - Runs on port 3500
- **Frontend**: Single HTML page with Datastar framework integration
  - Uses Datastar v1.0.0-beta.11 for reactive data binding
  - Currently contains example code (toaster question) to be replaced with fasting log functionality

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