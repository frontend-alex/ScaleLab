FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS build
WORKDIR /repo

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/env/package.json packages/env/package.json
COPY packages/contracts/package.json packages/contracts/package.json

RUN pnpm install --frozen-lockfile

COPY apps/api apps/api
COPY packages/db packages/db
COPY packages/env packages/env
COPY packages/contracts packages/contracts

RUN pnpm exec turbo run build --filter=api

FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV API_PORT=3001
ENV HOSTNAME=0.0.0.0

COPY --from=build /repo/node_modules ./node_modules

COPY --from=build /repo/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /repo/apps/api/dist ./apps/api/dist

COPY --from=build /repo/packages/db/dist ./packages/db/dist
COPY --from=build /repo/packages/db/package.json ./packages/db/package.json
COPY --from=build /repo/packages/db/node_modules ./packages/db/node_modules

COPY --from=build /repo/packages/env/dist ./packages/env/dist
COPY --from=build /repo/packages/env/package.json ./packages/env/package.json
COPY --from=build /repo/packages/env/node_modules ./packages/env/node_modules

COPY --from=build /repo/packages/contracts/dist ./packages/contracts/dist
COPY --from=build /repo/packages/contracts/package.json ./packages/contracts/package.json
COPY --from=build /repo/packages/contracts/node_modules ./packages/contracts/node_modules

EXPOSE 3001

CMD ["node", "apps/api/dist/main.js"]
