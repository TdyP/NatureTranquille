import {describe, it, after} from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import request from 'supertest';
import tilesRouter from './tiles';
import {pool} from '../db/client';

const dbAvailable = !!process.env.DATABASE_URL;

describe('Tiles endpoint - Parameter validation', () => {
    const app = express();
    app.use('/', tilesRouter);
    it('should return 400 for non-numeric z parameter', async () => {
        const response = await request(app).get('/tiles/abc/0/0.mvt');
        assert.equal(response.status, 400);
        assert.ok(response.body.error);
    });

    it('should return 400 for non-numeric x parameter', async () => {
        const response = await request(app).get('/tiles/10/abc/0.mvt');
        assert.equal(response.status, 400);
        assert.ok(response.body.error);
    });

    it('should return 400 for non-numeric y parameter', async () => {
        const response = await request(app).get('/tiles/10/0/abc.mvt');
        assert.equal(response.status, 400);
        assert.ok(response.body.error);
    });

    it('should return 400 for z < 0', async () => {
        const response = await request(app).get('/tiles/-1/0/0.mvt');
        assert.equal(response.status, 400);
        assert.ok(response.body.error.includes('z'));
    });

    it('should return 400 for z > 18', async () => {
        const response = await request(app).get('/tiles/19/0/0.mvt');
        assert.equal(response.status, 400);
        assert.ok(response.body.error.includes('z'));
    });

    it('should return 400 for x out of range for given z', async () => {
        // For z=2, x should be 0-3 (2^2 - 1 = 3)
        const response = await request(app).get('/tiles/2/4/0.mvt');
        assert.equal(response.status, 400);
        assert.ok(response.body.error.includes('x'));
    });

    it('should return 400 for y out of range for given z', async () => {
        // For z=2, y should be 0-3
        const response = await request(app).get('/tiles/2/0/4.mvt');
        assert.equal(response.status, 400);
        assert.ok(response.body.error.includes('y'));
    });

    it('should accept valid tile coordinates', async () => {
        const response = await request(app).get('/tiles/10/523/357.mvt');
        // Should not return 400, will return 200 or 204
        assert.notEqual(response.status, 400);
    });
});

describe('Tiles endpoint - Response headers', {skip: !dbAvailable && 'DATABASE_URL not set'}, () => {
    const app = express();
    app.use('/', tilesRouter);

    it('should set correct Content-Type header', async () => {
        // Use unique coordinates for this test to avoid cache/timing issues
        const response = await request(app).get('/tiles/10/500/350.mvt');
        // Check that we got a response (200 or 204)
        assert.ok(response.status === 200 || response.status === 204);
        // If 200 (tile with data), check content-type
        if (response.status === 200) {
            assert.ok(
                response.headers['content-type']?.includes('application/vnd.mapbox-vector-tile') ||
                    response.type === 'application/vnd.mapbox-vector-tile',
            );
        }
    });

    it('should set Cache-Control header', async () => {
        const response = await request(app).get('/tiles/9/261/179.mvt');
        if (response.status === 200) {
            assert.ok(response.headers['cache-control']?.includes('public, max-age=86400'));
        } else {
            assert.equal(response.headers['cache-control'], 'no-store');
        }
    });

    it('should set CORS header', async () => {
        const response = await request(app).get('/tiles/9/262/180.mvt');
        assert.equal(response.headers['access-control-allow-origin'], '*');
    });
});

describe('Tiles endpoint - Empty tiles', {skip: !dbAvailable && 'DATABASE_URL not set'}, () => {
    const app = express();
    app.use('/', tilesRouter);

    it('should return 204 No Content for tile with no zones', async () => {
        // Use coordinates far from any data (middle of ocean)
        const response = await request(app).get('/tiles/5/0/0.mvt');
        assert.equal(response.status, 204);
    });
});

describe('Tiles endpoint - Tile cache', {skip: !dbAvailable && 'DATABASE_URL not set'}, () => {
    const app = express();
    app.use('/', tilesRouter);
    it('should serve from cache on second request', async () => {
        const coords = '/tiles/8/130/89.mvt';

        // First request - cache miss
        const response1 = await request(app).get(coords);

        // Second request - cache hit (should be faster)
        const response2 = await request(app).get(coords);

        // Both should succeed
        assert.ok(response1.status < 300);
        assert.ok(response2.status < 300);

        // Response should be identical if both are 200
        if (response1.status === 200 && response2.status === 200) {
            assert.deepEqual(response1.body, response2.body);
        }
    });

    // Clean up pool after ALL tests (not just this describe block)
    after(async () => {
        await pool.end();
    });
});
