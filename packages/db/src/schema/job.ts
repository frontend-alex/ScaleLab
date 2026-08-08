import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { users } from "./user.js";

export const jobStatusEnum = pgEnum("job_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const jobs = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),

  type: varchar("type", { length: 100 }).notNull(),

  status: jobStatusEnum("status")
    .default("pending")
    .notNull(),

  progress: integer("progress")
    .default(0)
    .notNull(),

  input: jsonb("input")
    .$type<Record<string, unknown>>()
    .notNull(),

  result: jsonb("result")
    .$type<Record<string, unknown>>(),

  error: text("error"),

  attempts: integer("attempts")
    .default(0)
    .notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  startedAt: timestamp("started_at", { withTimezone: true }),

  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
