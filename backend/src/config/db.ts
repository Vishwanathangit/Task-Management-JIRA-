import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from './env';

// Node.js module caching ensures this client is initialized once as a Singleton across the application.
// Note for Vercel/serverless deployments: Use Supabase Connection Pooler URL (port 6543, pgbouncer mode)
// for DATABASE_URL in Vercel environment variables to prevent exhausting connection limits across serverless functions.
const client = postgres(env.DATABASE_URL);

export const db = drizzle(client);
