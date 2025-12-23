# Repository Guidelines

## Project Structure & Module Organization

This is a web app that should run and look well in mobile. It's a personal
fasting log keeper app, so we won't bother too much with authentication and
authorization, just the bare minimum to not expose my data.

Tech stack is:

- Deno: Javascript runtime and dev tools for linting and prettifying code
- Hono: web server
- Sqlite: database
- Htmx + Alpine.js: front-end
- Shadcn-classless: styling
- iconify: images for buttons

- `main.ts` holds the Hono app entry point and route definitions.
- `deno.json` defines imports, compiler options, and task aliases.
- `README.md` is minimal and only documents the start command.

## Build, Test, and Development Commands

- `deno task start`: runs the server with network access using `main.ts`.
- `deno run --allow-net main.ts`: direct equivalent of the task, useful for
  quick edits.

## Coding Style & Naming Conventions

- TypeScript with Deno; keep imports explicit and prefer single quotes as in
  `main.ts`.
- Use 2-space indentation (match existing formatting).
- Route handlers should be concise and return Hono responses (e.g.,
  `c.text(...)`).

## Testing Guidelines

- No test framework is configured yet.
- If adding tests, document the runner and add a `deno task test` entry in
  `deno.json`.

## Commit & Pull Request Guidelines

- No commit history is available here; use clear, imperative messages (e.g.,
  "Add fasting log endpoint").
- PRs should describe the change, how to run it locally, and any new routes or
  API behavior.

## Configuration & Security Notes

- The app currently requires `--allow-net` to serve HTTP; avoid adding broader
  permissions unless needed.
