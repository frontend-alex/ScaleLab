# ScaleLab

A TypeScript monorepo exploring a web application, authentication API, and asynchronous job worker with shared packages.

## Current status

Development foundation. Authentication and a demonstration queue worker exist; the worker simulates progress rather than performing a production business task.

## Features and implementation

- Next.js authentication pages and feature hooks.
- NestJS API using shared Zod contracts and a PostgreSQL/Drizzle data layer.
- Password hashing with scrypt and token creation in the authentication service.
- NestJS/BullMQ worker with queue events and job-progress updates.
- Shared contracts, database, queue, environment, UI, and TypeScript-configuration packages.
- Docker Compose configuration for local PostgreSQL, Redis, web, API, and worker services.

## Technology

TypeScript, Next.js/React, NestJS, Zod, Drizzle ORM, PostgreSQL, BullMQ, Redis, Turborepo, Biome, and pnpm. Root package.json requires Node >=20.9.0 and pins pnpm 9.0.0.

## Repository map

| Path | Purpose |
| --- | --- |
| [apps/web](apps/web) | Next.js application |
| [apps/api](apps/api) | Authentication API |
| [apps/worker](apps/worker) | Queue producer endpoint and worker |
| [packages/contracts](packages/contracts) | Shared schemas and API shapes |
| [packages/db](packages/db) | Database client and table definitions |
| [packages/queue](packages/queue) | Queue constants |
| [compose.dev.yaml](compose.dev.yaml) | Development database, Redis, and worker configuration |

## Local setup

Use the pnpm version declared in package.json. From the repository root:

```bash
git clone https://github.com/frontend-alex/ScaleLab.git
cd ScaleLab
pnpm install
cp .env.example .env
```

Fill NODE_ENV=development, API_PORT=3001, WORKER_PORT=3002, WEB_ORIGIN=http://localhost:3000, API_URL=http://localhost:3001, REDIS_URL, DATABASE_URL, and JWT_SECRET. Retain the development database values only for local use. Then run:

```bash
docker compose -f compose.yaml -f compose.dev.yaml up --build
```

The configured ports are web 3000, API 3001, worker 3002, PostgreSQL 5432, and Redis 6379. In a host-run development process, database/Redis URLs use localhost; inside Compose they use postgres/redis service names.

For host development, run pnpm build before pnpm dev so the shared packages have build output. Start PostgreSQL and Redis separately. Provision the database tables from packages/db/src/schema before using registration: the repository includes a Drizzle configuration but no database migration script in its package.json.

## Verification

```bash
pnpm build
pnpm check-types
pnpm lint
pnpm --filter api test:e2e
pnpm --filter worker test:e2e
```

Test scripts exist in the API and worker packages. The inspected API e2e test still expects the Nest starter response at GET /; that fixture is not proof of authentication coverage. These application commands were inspected, not executed.

## Limitations and next steps

- The demonstration worker uses timed simulated work; replace it with a real task before claiming domain functionality.
- The root production Compose file contains web/API only; the development overlay adds worker and supporting services.
- Database migration/provisioning needs a documented, repeatable command.
- Authentication verification, authorization, and meaningful integration coverage need explicit validation.

## Code review starting points

- [apps/api/src/auth/auth.service.ts](apps/api/src/auth/auth.service.ts)
- [apps/api/src/auth/auth.controller.ts](apps/api/src/auth/auth.controller.ts)
- [apps/worker/src/job/job.worker.ts](apps/worker/src/job/job.worker.ts)
- [apps/worker/src/job/job.controller.ts](apps/worker/src/job/job.controller.ts)
- [packages/db/drizzle.config.ts](packages/db/drizzle.config.ts)
