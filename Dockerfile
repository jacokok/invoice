FROM node:22-alpine

ENV CHROME_BIN="/usr/bin/chromium-browser"

RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    ttf-freefont \
    chromium

RUN echo "alias pm='pnpm'" >> /etc/bash.bashrc
RUN npm i -g pnpm

WORKDIR /app

COPY package*.json .
COPY pnpm-lock.yaml .
RUN pnpm i
COPY . .
RUN pnpm build

# COPY --from=build /app/build ./build
# COPY --from=build /app/package.json ./package.json
# COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD [ "pnpm", "preview" ]
