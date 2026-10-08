# Invoice

Should really think of a better name

![icon](static/icon.svg)

## Run

Requires Node.js 22.17+ and pnpm 10.30.3.

```bash
pnpm install --frozen-lockfile
cp .env.example .env
# Configure your database and GitHub OAuth credentials in .env
pnpm dev
```

## Playwright

```bash
pnpm exec playwright install firefox
pnpm exec playwright install
```

## Test Build

```bash
pnpm check
pnpm lint
pnpm build
ORIGIN=http://localhost:3000 node --env-file=.env build/
```

## SvelteKit 3

Configuration lives in `vite.config.ts`. Library imports use `#lib` with explicit
file extensions, and runtime environment variables are declared in `src/env.ts`.
Database credentials are only required when the database is accessed, not to build.
TypeScript remains on 6.0.2 while the other direct dependencies use current releases.

Upstream peer ranges still produce install warnings: Better Auth and Runed declare
SvelteKit 2 compatibility, and Formsnap declares Superforms 2 compatibility. Type
checking, linting, production builds, and unauthenticated production smoke tests
pass; authenticated database and GitHub OAuth flows require your configured services.
