import {check, index, integer, pgTable, serial, text, timestamp, varchar} from 'drizzle-orm/pg-core';
import {sql} from 'drizzle-orm';

export const signalements = pgTable(
    'signalements',
    {
        id: serial('id').primaryKey(),
        type: varchar('type', {length: 50}).notNull(),
        description: text('description').notNull(),
        email: varchar('email', {length: 255}),
        ipHash: varchar('ip_hash', {length: 64}).notNull(),
        status: varchar('status', {length: 20}).default('nouveau'),
        notesInternes: text('notes_internes'),
        zoneId: integer('zone_id'),
        createdAt: timestamp('created_at', {withTimezone: true}).defaultNow(),
        updatedAt: timestamp('updated_at', {withTimezone: true}).defaultNow(),
    },
    (table) => [
        check('signalements_type_check', sql`${table.type} IN ('erreur', 'suggestion', 'nouvelle-donnee', 'autre')`),
        check('signalements_status_check', sql`${table.status} IN ('nouveau', 'en-cours', 'resolu', 'rejete')`),
        index('idx_signalements_status').on(table.status),
        index('idx_signalements_created_at').on(table.createdAt),
        index('idx_signalements_ip_hash').on(table.ipHash, table.createdAt),
    ],
);
