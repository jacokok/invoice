# Invoice

Should really think of a better name

![icon](static/icon.svg)

## Run

```bash
nix-shell
pm dev
```

## Playwright

```bash
pnpm exec playwright install firefox
pnpm exec playwright install
```

## Test Build

```bash
pnpm build
ORIGIN=http://localhost:3000 node --env-file=.env build/
```
