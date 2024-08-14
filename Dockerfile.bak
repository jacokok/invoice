FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json .
COPY pnpm-lock.yaml .
RUN npm install -g pnpm
RUN pnpm i
COPY . .

RUN pnpm run build
RUN pnpm prune --prod

FROM node:22-alpine AS app

WORKDIR /app

ENV NODE_ENV=production \
    CHROME_BIN="/usr/bin/chromium-browser"

RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    ttf-freefont \
    chromium    

COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD [ "node", "build" ]
