#############
# Serve Nuxt in development mode.

# Should be the specific version of node:alpine.
FROM node:16.8.0-alpine3.14@sha256:e9dec0675a05bded5e881c6839461c2209a4abd8bd16239daf2e59db57c4adaf AS development

# Update and install dependencies.
# `git` is required by the `yarn` command
RUN apk add --no-cache \
    git \
  && rm -rf /var/cache/apk/*

WORKDIR /srv/app/

COPY ./package.json ./yarn.lock ./

RUN yarn install

COPY ./ ./

# COPY ./sqitch/ /srv/sqitch/
# COPY ./docker-entrypoint.sh /usr/local/bin/

CMD ["yarn", "dev", "--hostname", "0.0.0.0"]
HEALTHCHECK --interval=10s CMD wget -O /dev/null http://localhost:3000/healthcheck || exit 1


########################
# Build Nuxt.

# Should be the specific version of node:alpine.
FROM node:16.8.0-alpine3.14@sha256:4ca6db20301c460ffa44b1d398788c903306f55de6ded981ab377d036c172836 AS build

ARG NUXT_ENV_STACK_DOMAIN=jonas-thelemann.de
ENV NUXT_ENV_STACK_DOMAIN=${NUXT_ENV_STACK_DOMAIN}
ENV NODE_ENV=production

# Update and install dependencies.
# - `git` is required by the `yarn` command
RUN apk add --no-cache \
    git \
  && rm -rf /var/cache/apk/*

WORKDIR /srv/app/

COPY --from=development /srv/app/ ./

RUN yarn run lint \
    && yarn run build

# Discard devDependencies.
RUN yarn install


#######################
# Provide a web server.
# Requires node (cannot be static) as the server acts as backend too.

# Should be the specific version of node:alpine.
FROM node:16.8.0-alpine3.14@sha256:4ca6db20301c460ffa44b1d398788c903306f55de6ded981ab377d036c172836 AS production

ENV NODE_ENV=production

# Update and install dependencies.
# - `git` is required by the `yarn` command
RUN apk add --no-cache \
    git \
  && rm -rf /var/cache/apk/*

WORKDIR /srv/app/

COPY --from=build /srv/app/ ./

CMD ["yarn", "start", "--hostname", "0.0.0.0"]
HEALTHCHECK --interval=10s CMD wget -O /dev/null http://localhost/healthcheck || exit 1
