import type { InferInsertModel } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: text('email').unique().notNull(),
    password: text('password').notNull(),
  },
);

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: integer('userId')
    .references(() => users.id)
    .notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

export type NewUser = InferInsertModel<typeof users>;
export type NewSession = InferInsertModel<typeof sessions>;
