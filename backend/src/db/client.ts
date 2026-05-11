import dotenv from 'dotenv';
import {drizzle} from 'drizzle-orm/node-postgres';
import {Pool} from 'pg';

dotenv.config();

let _pool: Pool | undefined;
let _db: ReturnType<typeof drizzle> | undefined;

function ensurePool(): Pool {
    if (!_pool) {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
            throw new Error('DATABASE_URL is required to initialize database connection');
        }
        _pool = new Pool({connectionString});
    }
    return _pool;
}

export const pool = new Proxy({} as Pool, {
    get(_, prop: string | symbol) {
        if (prop === 'end') {
            return () => _pool?.end() ?? Promise.resolve();
        }
        const p = ensurePool();
        const val = (p as any)[prop];
        return typeof val === 'function' ? (val as (...args: unknown[]) => unknown).bind(p) : val;
    },
});

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
    get(_, prop: string | symbol) {
        if (!_db) {
            _db = drizzle(ensurePool());
        }
        const val = (_db as any)[prop];
        return typeof val === 'function' ? (val as (...args: unknown[]) => unknown).bind(_db) : val;
    },
});
