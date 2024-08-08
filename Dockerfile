FROM node:22 AS builder

WORKDIR /app
COPY package*.json .
COPY pnpm-lock.yaml .
RUN npm install -g pnpm
RUN pnpm i
COPY . .

RUN pnpm run build
RUN pnpm prune --prod

FROM node:22 AS app

WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/package.json .

EXPOSE 5173
ENV NODE_ENV=production

# RUN chown -R node /usr/src/app
# USER node
CMD [ "node", "build" ]
