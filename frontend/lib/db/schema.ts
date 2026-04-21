import {index, pgTable, serial, text, timestamp, varchar} from 'drizzle-orm/pg-core';

export const signalements = pgTable(
    'signalements',
    {
        id: serial('id').primaryKey(),
        type: varchar('type', {length: 50}).notNull(),
        localisation: varchar('localisation', {length: 200}).notNull(),
        description: text('description').notNull(),
        email: varchar('email', {length: 255}),
        ipHash: varchar('ip_hash', {length: 64}).notNull(),
        status: varchar('status', {length: 20}).default('nouveau'),
        createdAt: timestamp('created_at', {withTimezone: true}).defaultNow(),
        updatedAt: timestamp('updated_at', {withTimezone: true}).defaultNow(),
    },
    (table) => [
        index('idx_signalements_status').on(table.status),
        index('idx_signalements_created_at').on(table.createdAt),
        index('idx_signalements_ip_hash').on(table.ipHash, table.createdAt),
    ],
);
