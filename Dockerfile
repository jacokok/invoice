FROM node:22 AS build

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
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
ENV NODE_ENV=production

# RUN chown -R node /usr/src/app
# USER node
CMD [ "node", "build" ]
