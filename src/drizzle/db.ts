import '@/drizzle/envConfig';

import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';

import type { User } from '@/drizzle/schema';
import { userTable } from '@/drizzle/schema';
import * as schema from '@/drizzle/schema';

export const db = drizzle(sql, { schema });

export const insertUser = async (user: User) => {
  return db.insert(userTable).values(user).returning();
};
