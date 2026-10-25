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
pnpm test
pnpm check
pnpm lint
pnpm build
node --env-file=.env build/
```

## Invoice PDFs

Preview displays the invoice as HTML. Download uses the `submitPdfOptions`
remote form to render the same template with `@formepdf/html` (Forme) on the
server and return PDF bytes for a browser download. No browser service or API
key is required. Invoice numbers advance only after PDF rendering succeeds.

The shared template and print styles are in `src/lib/components/Invoice.svelte`
and `src/lib/components/invoice.css`. Keep the styles within Forme's supported
HTML/CSS subset; rendering warnings are logged on the server. `pnpm test` covers
both themes, multiline/escaped text, empty invoices, and multi-page rendering.

## SvelteKit 3

Configuration lives in `vite.config.ts`. Library imports use `#lib` with explicit
file extensions, and runtime environment variables are declared in `src/env.ts`.
Database credentials are only required when the database is accessed, not to build.
The migration follows the [official SvelteKit 3 upgrade guide](https://svelte.dev/docs/kit/migrating-to-sveltekit-3).
PDF queries receive route parameters explicitly, and remote form controls use
`field.as(...)` to register submitted fields.

Set `PUBLIC_ORIGIN` to your public-facing origin **before building** (for example,
`PUBLIC_ORIGIN=https://invoice.example.com pnpm build`). This configures
`paths.origin` for CSRF checks; adapter-node no longer supports the `ORIGIN`
runtime variable. Docker Compose passes `PUBLIC_ORIGIN` as both a build argument
and runtime environment variable. Rebuild when changing it. For local production
testing, set both `PUBLIC_ORIGIN` and `BETTER_AUTH_URL` in `.env` to
`http://localhost:3000` before building and starting the server.

TypeScript uses the latest supported 6.x release (6.0.3). TypeScript 7 is not yet
supported by SvelteKit, svelte-check, or typescript-eslint and breaks Kit's sync
step. Other direct dependencies use current stable releases.

Upstream peer ranges still produce install warnings: Runed declares SvelteKit 2
compatibility, and Formsnap declares Superforms 2 compatibility. Authenticated
database and GitHub OAuth flows require your configured services.
