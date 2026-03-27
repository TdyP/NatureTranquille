import {migrate} from 'drizzle-orm/node-postgres/migrator';

import {db, pool} from './client';

const run = async (): Promise<void> => {
    await migrate(db, {
        migrationsFolder: './drizzle',
    });

    await pool.end();
};

run().catch(async (error: unknown) => {
    // eslint-disable-next-line no-console
    console.error('Database migration failed', error);
    await pool.end();
    process.exit(1);
});
