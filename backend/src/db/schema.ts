import {customType, index, integer, pgTable, text, timestamp, varchar} from 'drizzle-orm/pg-core';

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
        codeDepartement: varchar('code_departement', {length: 3}),
        nomDepartement: text('nom_departement'),
        geometry: multipolygonGeometry('geometry').notNull(),
    },
    (table) => [
        index('zones_geometry_gist_idx').using('gist', table.geometry),
        index('zones_type_protection_idx').on(table.typeProtection),
        index('idx_zones_code_departement').on(table.codeDepartement),
    ],
);

export const departements = pgTable('departements', {
    code: varchar('code', {length: 3}).primaryKey(),
    nom: text('nom').notNull(),
});
