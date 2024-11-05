import type { InferInsertModel } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const userTable = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: text('email').unique().notNull(),
    password: text('password').notNull(),
  },
);

export const sessionTable = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export type User = InferInsertModel<typeof userTable>;
export type Session = InferInsertModel<typeof sessionTable>;
