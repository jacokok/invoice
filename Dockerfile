FROM node:lts-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS deps

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG PUBLIC_ORIGIN=http://localhost:3000
# Build-time placeholders for SvelteKit's postbuild analyse step (runs server code).
# Override with --build-arg if needed. Runtime values come from environment variables.
ARG DATABASE_URL=libsql://placeholder.invalid
ARG DATABASE_AUTH_TOKEN=placeholder

ENV PUBLIC_ORIGIN=${PUBLIC_ORIGIN}
ENV DATABASE_URL=${DATABASE_URL}
ENV DATABASE_AUTH_TOKEN=${DATABASE_AUTH_TOKEN}

RUN pnpm run build

FROM base AS prod-deps

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

FROM base

WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=prod-deps /app/node_modules ./node_modules
COPY package.json ./

ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "build"]
