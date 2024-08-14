FROM mcr.microsoft.com/devcontainers/base:alpine-3.20

ENV CHROME_BIN="/usr/bin/chromium-browser"

RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    ttf-freefont \
    chromium \
    nodejs \
    npm

RUN echo "alias pm='pnpm'" >> /etc/bash.bashrc
RUN npm i -g pnpm