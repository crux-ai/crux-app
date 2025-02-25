import '@/drizzle/envConfig';

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/drizzle/schema.ts',
  dialect: 'postgresql',
  out: './migrations',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
},
);
