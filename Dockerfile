FROM node:22-alpine AS base

ENV CHROME_BIN="/usr/bin/chromium-browser"

RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    tini \
    ttf-freefont \
    chromium

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build

WORKDIR /app
COPY package*.json .
COPY pnpm-lock.yaml .
RUN pnpm i
COPY . .

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
# Use tini as entry point to kill those zombies
ENTRYPOINT [ "/sbin/tini", "--" ]
CMD [ "node", "build" ]