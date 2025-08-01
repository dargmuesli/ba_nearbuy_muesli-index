#############
# Create base image.

FROM node:22.17.1-alpine AS base-image

# The `CI` environment variable must be set for pnpm to run in headless mode
ENV CI=true

WORKDIR /srv/app/

RUN corepack enable \
    && apk update \
    && apk add --no-cache git


#############
# Serve Nuxt in development mode.

FROM base-image AS development

COPY ./docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

VOLUME /srv/.pnpm-store
VOLUME /srv/app

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pnpm", "run", "dev", "--host"]
EXPOSE 3001

# TODO: support healthcheck while starting (https://github.com/nuxt/framework/issues/6915)
# HEALTHCHECK --interval=10s CMD wget -O /dev/null http://localhost:3001/api/healthcheck || exit 1


########################
# Prepare Nuxt.

FROM base-image AS prepare

COPY ./pnpm-lock.yaml package.json ./

RUN pnpm fetch

COPY ./ ./

RUN pnpm install --offline


########################
# Build for Node deployment.

FROM prepare AS build-node

ENV NODE_ENV=production
RUN pnpm --dir src run build:node


########################
# Nuxt: lint

FROM prepare AS lint

RUN pnpm -r run lint


#######################
# Collect build, lint and test results.

FROM base-image AS collect

COPY --from=build-node /srv/app/src/.output ./.output
COPY --from=build-node /srv/app/src/package.json ./package.json
COPY --from=lint /srv/app/package.json /tmp/package.json


#######################
# Provide a web server.
# Requires node (cannot be static) as the server acts as backend too.

FROM collect AS production

ENV NODE_ENV=production

# Update dependencies.
RUN apk update \
    && apk upgrade --no-cache

ENTRYPOINT ["pnpm"]
CMD ["pnpm", "run", "start:node"]
# HEALTHCHECK --interval=10s CMD wget -O /dev/null http://localhost:3000/api/healthcheck || exit 1
EXPOSE 3000
LABEL org.opencontainers.image.source="https://github.com/dargmuesli/ba_nearbuy_muesli-index"
LABEL org.opencontainers.image.description="Calculates the 'Muesli index', representing the availability of ingredients required for a yummy muesli. Requests for missing ingredients can be added with one click."
