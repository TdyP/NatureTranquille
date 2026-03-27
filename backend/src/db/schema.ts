import {customType, index, integer, pgTable, text, timestamp} from 'drizzle-orm/pg-core';

const multipolygonGeometry = customType<{data: string; driverData: string}>({
    dataType() {
        return 'geometry(MULTIPOLYGON,4326)';
    },
    fromDriver(value: string): string {
        return value;
    },
    toDriver(value: string): string {
        return value;
    },
});

export const zones = pgTable(
    'zones',
    {
        id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
        nom: text('nom'),
        typeProtection: text('type_protection'),
        gestionnaire: text('gestionnaire'),
        source: text('source'),
        dateMaj: timestamp('date_maj', {withTimezone: true}),
        geometry: multipolygonGeometry('geometry').notNull(),
    },
    (table) => [
        index('zones_geometry_gist_idx').using('gist', table.geometry),
        index('zones_type_protection_idx').on(table.typeProtection),
    ],
);
