FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS build
WORKDIR /repo

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json ./
COPY apps/worker/package.json apps/worker/package.json
COPY packages/env/package.json packages/env/package.json
COPY packages/queue/package.json packages/queue/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json

RUN pnpm install --frozen-lockfile

COPY apps/worker apps/worker
COPY packages/env packages/env
COPY packages/queue packages/queue
COPY packages/typescript-config packages/typescript-config

RUN pnpm exec turbo run build --filter=worker

FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV WORKER_PORT=3002

COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/apps/worker/node_modules ./apps/worker/node_modules
COPY --from=build /repo/apps/worker/dist ./apps/worker/dist
COPY --from=build /repo/packages/env/dist ./packages/env/dist
COPY --from=build /repo/packages/env/package.json ./packages/env/package.json
COPY --from=build /repo/packages/env/node_modules ./packages/env/node_modules
COPY --from=build /repo/packages/queue/dist ./packages/queue/dist
COPY --from=build /repo/packages/queue/package.json ./packages/queue/package.json
COPY --from=build /repo/packages/queue/node_modules ./packages/queue/node_modules

EXPOSE 3002

CMD ["node", "apps/worker/dist/main.js"]
