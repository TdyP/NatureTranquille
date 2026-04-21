import {drizzle} from 'drizzle-orm/node-postgres';
import {Pool} from 'pg';

const globalForPool = global as typeof global & {_pgPool?: Pool};

function getPool(): Pool {
    if (!globalForPool._pgPool) {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
            throw new Error('DATABASE_URL is required');
        }
        globalForPool._pgPool = new Pool({connectionString});
    }
    return globalForPool._pgPool;
}

export function getDb() {
    return drizzle(getPool());
}

export {getPool as pool};
