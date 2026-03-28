FROM node:25-alpine AS base

RUN npm install -g pnpm

FROM base AS build

WORKDIR /app
COPY package*.json .
COPY pnpm-lock.yaml .
RUN pnpm i
COPY . .

ENV PUBLIC_ORIGIN='http://localhost:3000'
ENV DATABASE_URL='libsql://dummy.turso.io'
ENV DATABASE_AUTH_TOKEN='dummy_token_for_build'
RUN pnpm run build
RUN pnpm prune --prod

FROM base

WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

ENV NODE_ENV='production'
ENV ORIGIN='http://localhost:3000'

EXPOSE 3000
CMD [ "node", "build" ]
