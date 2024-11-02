import '@/drizzle/envConfig';

import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';

import type { NewUser } from '@/drizzle/schema';
import { users } from '@/drizzle/schema';
import * as schema from '@/drizzle/schema';

export const db = drizzle(sql, { schema });

export const insertUser = async (user: NewUser) => {
  return db.insert(users).values(user).returning();
};
