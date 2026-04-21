import {drizzle} from 'drizzle-orm/node-postgres';
import {Pool} from 'pg';

function createPool(): Pool {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL is required');
    }
    return new Pool({connectionString});
}

const globalForPool = global as typeof global & {_pgPool?: Pool};

const pool = globalForPool._pgPool ?? createPool();

if (process.env.NODE_ENV !== 'production') {
    globalForPool._pgPool = pool;
}

export const db = drizzle(pool);
export {pool};
