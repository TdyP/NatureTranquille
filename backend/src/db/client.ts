import dotenv from 'dotenv';
import {drizzle} from 'drizzle-orm/node-postgres';
import {Pool} from 'pg';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is required to initialize database connection');
}

export const pool = new Pool({
    connectionString,
});

export const db = drizzle(pool);
