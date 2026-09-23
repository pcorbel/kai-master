# syntax=docker/dockerfile:1
#
# Digest-pinned so a rebuild is reproducible and Dependabot owns the bumps.
# The version matches `volta.node` in package.json, which is also what CI runs.
FROM node:26.9.0-alpine@sha256:dbaa92e5758cbbcf85d65d5403fdb530fe3442cbe8c6dbfb7ef23365450d5070 AS base

# ---------------------------------------------------------------------------
# deps: dependency install, cached independently of the source.
#
# Only the manifest and lockfile are copied here, so editing a component does
# not invalidate the install layer.
# ---------------------------------------------------------------------------
FROM base AS deps
WORKDIR /app

# Node 26 no longer bundles Corepack. `packageManager` in package.json decides
# the Yarn version, so nothing is pinned twice.
RUN npm install -g corepack@latest && corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
# --immutable: the build fails rather than silently resolving something the
# lockfile did not sanction.
RUN yarn install --immutable

# ---------------------------------------------------------------------------
# builder: compile the Nitro bundle.
#
# NODE_ENV is deliberately not production here: Nuxt needs devDependencies to
# build, and setting it would only be misleading.
# ---------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app
RUN npm install -g corepack@latest && corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.yarn ./.yarn
COPY . .

# Nothing secret exists at build time and nothing is needed: the one runtime
# setting (NUXT_BOOKS_BASE_URL) has a public default.
RUN yarn build

# ---------------------------------------------------------------------------
# runtime: the shipped image.
#
# Stateless. Reading progress lives in the reader's browser and the books are
# fetched from Project Aon on demand, so there is no volume to mount.
# ---------------------------------------------------------------------------
FROM base AS runtime
WORKDIR /app

# Patch the OS packages and delete the global npm. Nothing at run time uses
# npm: the container runs `node .output/server/index.mjs`, so shipping it is
# pure attack surface.
RUN apk upgrade --no-cache libcrypto3 libssl3 \
  && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

RUN addgroup -g 1001 -S nodejs \
  && adduser -S nuxt -u 1001 -G nodejs

COPY --from=builder --chown=nuxt:nodejs /app/.output ./.output

USER nuxt
EXPOSE 3000

# wget is already in busybox on alpine.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health >/dev/null || exit 1

CMD ["node", ".output/server/index.mjs"]
