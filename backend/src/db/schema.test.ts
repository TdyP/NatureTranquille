import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {getTableColumns, getTableName} from 'drizzle-orm';

import {zones} from './schema';

describe('zones table schema', () => {
    it('table name is "zones"', () => {
        assert.equal(getTableName(zones), 'zones');
    });

    it('has all required columns', () => {
        const columns = getTableColumns(zones);
        const expectedColumns: (keyof typeof columns)[] = [
            'id',
            'nom',
            'typeProtection',
            'gestionnaire',
            'source',
            'dateMaj',
            'geometry',
        ];

        for (const col of expectedColumns) {
            assert.ok(col in columns, `Missing column: ${col}`);
        }
    });

    it('id column is a primary key generated always as identity', () => {
        const columns = getTableColumns(zones);
        assert.equal(columns.id.primary, true);
        const idCol = columns.id as unknown as {generatedIdentity?: {type: string}};
        assert.ok(idCol.generatedIdentity, 'id should have identity config');
        assert.equal(idCol.generatedIdentity?.type, 'always');
    });

    it('geometry column is not nullable', () => {
        const columns = getTableColumns(zones);
        assert.equal(columns.geometry.notNull, true);
    });

    it('date_maj column has timezone', () => {
        const columns = getTableColumns(zones);
        const col = columns.dateMaj as unknown as {getSQLType: () => string};
        assert.equal(col.getSQLType(), 'timestamp with time zone', 'date_maj should be a timestamp with timezone');
    });

    it('geometry column data type is geometry(MULTIPOLYGON,4326)', () => {
        const columns = getTableColumns(zones);
        const geometryCol = columns.geometry as unknown as {getSQLType: () => string};
        assert.equal(geometryCol.getSQLType(), 'geometry(MULTIPOLYGON,4326)');
    });
});
