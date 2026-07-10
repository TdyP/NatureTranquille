/**
 * @jest-environment node
 */

import {getTableColumns, getTableName} from 'drizzle-orm';
import {signalements} from '../schema';

describe('signalements Drizzle schema', () => {
    it('has correct table name', () => {
        expect(getTableName(signalements)).toBe('signalements');
    });

    it('has all required columns', () => {
        const columns = getTableColumns(signalements);
        const expected = [
            'id',
            'type',
            'description',
            'email',
            'ipHash',
            'status',
            'notesInternes',
            'zoneId',
            'createdAt',
            'updatedAt',
        ] as const;

        for (const col of expected) {
            expect(columns).toHaveProperty(col);
        }
    });

    it('id is a serial primary key', () => {
        const columns = getTableColumns(signalements);
        expect(columns.id.primary).toBe(true);
    });

    it('type column has max length of 50 and is not null', () => {
        const columns = getTableColumns(signalements);
        const col = columns.type as {length?: number; notNull: boolean};
        expect(col.length).toBe(50);
        expect(col.notNull).toBe(true);
    });

    it('description is a text column (not null)', () => {
        const columns = getTableColumns(signalements);
        expect(columns.description.notNull).toBe(true);
        expect(columns.description.getSQLType()).toBe('text');
    });

    it('email column is optional (nullable)', () => {
        const columns = getTableColumns(signalements);
        expect(columns.email.notNull).toBe(false);
    });

    it('ip_hash column has max length of 64 (SHA-256 hex) and is not null', () => {
        const columns = getTableColumns(signalements);
        const col = columns.ipHash as {length?: number; notNull: boolean};
        expect(col.length).toBe(64);
        expect(col.notNull).toBe(true);
    });

    it('status column defaults to "nouveau"', () => {
        const columns = getTableColumns(signalements);
        expect(columns.status.default).toBe('nouveau');
    });

    it('notes_internes column is optional', () => {
        const columns = getTableColumns(signalements);
        expect(columns.notesInternes.notNull).toBe(false);
    });

    it('zone_id column is optional (nullable FK reference)', () => {
        const columns = getTableColumns(signalements);
        expect(columns.zoneId.notNull).toBe(false);
    });

    it('created_at has timezone and defaults to now()', () => {
        const columns = getTableColumns(signalements);
        expect(columns.createdAt.hasDefault).toBe(true);
        expect(columns.createdAt.getSQLType()).toBe('timestamp with time zone');
    });

    it('updated_at has timezone and defaults to now()', () => {
        const columns = getTableColumns(signalements);
        expect(columns.updatedAt.hasDefault).toBe(true);
        expect(columns.updatedAt.getSQLType()).toBe('timestamp with time zone');
    });
});
