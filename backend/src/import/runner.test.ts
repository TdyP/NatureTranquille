import assert from 'node:assert/strict';
import {describe, it, mock} from 'node:test';
import type {Pool} from 'pg';

import {runImport} from './runner';
import type {GeoJsonCollection} from './types';

describe('runImport', () => {
    function makeCollection(count: number, nomPrefix = 'Zone'): GeoJsonCollection {
        return {
            type: 'FeatureCollection',
            features: Array.from({length: count}, (_, i) => ({
                type: 'Feature' as const,
                geometry: {type: 'MultiPolygon', coordinates: []},
                properties: {NOM: `${nomPrefix} ${i}`},
            })),
        };
    }

    function makePool(isValid = true): Pool {
        return {
            query: mock.fn(async (sql: string) => {
                if (sql.includes('SELECT')) {
                    return {rows: [{is_valid: isValid}]};
                }
                return {rows: []};
            }),
        } as unknown as Pool;
    }

    it('records error when geoJsonReader throws (file not found)', async () => {
        const pool = makePool();
        const failingReader = mock.fn((_file: string): GeoJsonCollection => {
            throw new Error('File not found');
        });
        const result = await runImport(pool, [{file: '/missing.shp', sourceValue: 'SRC'}], failingReader);
        assert.equal(result.sources[0].error, 'File not found');
        assert.equal(result.sources[0].inserted, 0);
        assert.equal(result.totalInserted, 0);
    });

    it('inserts features and returns correct counts', async () => {
        const pool = makePool(true);
        const collection = makeCollection(2);
        const reader = mock.fn((_file: string) => collection);
        const result = await runImport(
            pool,
            [{file: '/data/test.shp', sourceValue: 'TEST', nomColumn: 'NOM', typeProtectionValue: 'reserve'}],
            reader,
        );
        assert.equal(result.sources[0].inserted, 2);
        assert.equal(result.sources[0].corrected, 0);
        assert.equal(result.sources[0].skipped, 0);
        assert.equal(result.totalInserted, 2);
    });

    it('increments corrected count for invalid geometries', async () => {
        const pool = makePool(false);
        const collection: GeoJsonCollection = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {type: 'MultiPolygon', coordinates: []},
                    properties: null,
                },
            ],
        };
        const reader = mock.fn((_file: string) => collection);
        const result = await runImport(pool, [{file: '/data/test.shp', sourceValue: 'TEST'}], reader);
        assert.equal(result.sources[0].corrected, 1);
        assert.equal(result.sources[0].inserted, 1);
    });

    it('increments skipped count when INSERT fails', async () => {
        const pool = {
            query: mock.fn(async (sql: string) => {
                if (sql.includes('INSERT')) {
                    throw new Error('DB constraint error');
                }
                return {rows: [{is_valid: true}]};
            }),
        } as unknown as Pool;
        const collection: GeoJsonCollection = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {type: 'MultiPolygon', coordinates: []},
                    properties: null,
                },
            ],
        };
        const reader = mock.fn((_file: string) => collection);
        const result = await runImport(pool, [{file: '/data/test.shp', sourceValue: 'TEST'}], reader);
        assert.equal(result.sources[0].skipped, 1);
        assert.equal(result.sources[0].inserted, 0);
    });

    it('resolves nom from column mapping', async () => {
        let insertedNom: string | null = null;
        const pool = {
            query: mock.fn(async (sql: string, params: unknown[]) => {
                if (sql.includes('INSERT')) {
                    insertedNom = params[0] as string;
                    return {rows: []};
                }
                return {rows: [{is_valid: true}]};
            }),
        } as unknown as Pool;
        const collection: GeoJsonCollection = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {type: 'MultiPolygon', coordinates: []},
                    properties: {NAME: 'Réserve Test'},
                },
            ],
        };
        const reader = mock.fn((_file: string) => collection);
        await runImport(pool, [{file: '/data/test.shp', sourceValue: 'TEST', nomColumn: 'NAME'}], reader);
        assert.equal(insertedNom, 'Réserve Test');
    });

    it('resolves nom from fixed value when column absent', async () => {
        let insertedNom: string | null = null;
        const pool = {
            query: mock.fn(async (sql: string, params: unknown[]) => {
                if (sql.includes('INSERT')) {
                    insertedNom = params[0] as string;
                    return {rows: []};
                }
                return {rows: [{is_valid: true}]};
            }),
        } as unknown as Pool;
        const collection: GeoJsonCollection = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {type: 'MultiPolygon', coordinates: []},
                    properties: {},
                },
            ],
        };
        const reader = mock.fn((_file: string) => collection);
        await runImport(pool, [{file: '/data/test.shp', sourceValue: 'TEST', nomValue: 'Zone fixe'}], reader);
        assert.equal(insertedNom, 'Zone fixe');
    });

    it('handles multiple sources and sums totalInserted', async () => {
        const pool = makePool(true);
        const reader = mock.fn((file: string) => {
            if (file === '/data/a.shp') return makeCollection(3);
            if (file === '/data/b.shp') return makeCollection(2);
            throw new Error('Unknown file');
        });
        const result = await runImport(
            pool,
            [
                {file: '/data/a.shp', sourceValue: 'A'},
                {file: '/data/b.shp', sourceValue: 'B'},
            ],
            reader,
        );
        assert.equal(result.totalInserted, 5);
        assert.equal(result.sources[0].inserted, 3);
        assert.equal(result.sources[1].inserted, 2);
    });
});
