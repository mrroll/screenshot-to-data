###########
# Builder #
###########
FROM node:20-slim as builder
# https://andrekoenig.de/articles/using-bun-as-the-package-manager-in-production-ready-docker-images
RUN apt update && apt install -y bash curl unzip && \
    curl https://bun.sh/install | bash -s -- bun-v1.1.3
ENV PATH="${PATH}:/root/.bun/bin"

ADD package.json /srv/package.json
ADD bun.lockb /srv/bun.lockb
ADD patches /srv/patches
ADD turbo.json /srv/turbo.json

ADD packages /srv/packages
ADD apps /srv/apps

WORKDIR /srv
RUN bun install --frozen-lockfile

WORKDIR /srv
RUN npm run build -- --filter=./apps/api

RUN bun install --frozen-lockfile --production --ignore-scripts

#######
# App #
#######
FROM node:20-slim
COPY --from=builder /srv/node_modules /srv/node_modules
COPY --from=builder /srv/apps/api /srv/apps/api

WORKDIR /srv/apps/api

ENV NODE_ENV=production
ENV TZ=UTC

CMD ["../../node_modules/tsx/dist/cli.mjs", "--require", "dotenv-expand/config", "./build/index.js"]