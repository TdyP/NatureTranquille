import {Router, Request, Response} from 'express';
import {pool} from '../db/client';

const router = Router();

/**
 * Tile cache with LRU eviction strategy
 */
class TileCache {
    private cache = new Map<string, {data: Buffer; timestamp: number}>();
    private readonly maxSize: number;

    constructor(maxSize = 1000) {
        this.maxSize = maxSize;
    }

    get(key: string): Buffer | undefined {
        const entry = this.cache.get(key);
        if (entry) {
            // Update timestamp for LRU
            entry.timestamp = Date.now();
            return entry.data;
        }
        return undefined;
    }

    set(key: string, data: Buffer): void {
        // If cache is full, remove oldest entry
        if (this.cache.size >= this.maxSize) {
            let oldestKey: string | null = null;
            let oldestTimestamp = Infinity;

            for (const [k, v] of this.cache.entries()) {
                if (v.timestamp < oldestTimestamp) {
                    oldestTimestamp = v.timestamp;
                    oldestKey = k;
                }
            }

            if (oldestKey) {
                this.cache.delete(oldestKey);
            }
        }

        this.cache.set(key, {data, timestamp: Date.now()});
    }

    has(key: string): boolean {
        return this.cache.has(key);
    }
}

const tileCache = new TileCache(1000);

/**
 * Validate tile coordinates
 */
function validateTileCoordinates(z: number, x: number, y: number): string | null {
    // Validate z range (0-18)
    if (z < 0 || z > 18) {
        return `Invalid z coordinate: ${z}. Must be between 0 and 18.`;
    }

    // Calculate max value for x and y at this zoom level
    const maxCoord = Math.pow(2, z) - 1;

    // Validate x range
    if (x < 0 || x > maxCoord) {
        return `Invalid x coordinate: ${x}. Must be between 0 and ${maxCoord} for zoom level ${z}.`;
    }

    // Validate y range
    if (y < 0 || y > maxCoord) {
        return `Invalid y coordinate: ${y}. Must be between 0 and ${maxCoord} for zoom level ${z}.`;
    }

    return null;
}

/**
 * Generate MVT tile from PostGIS
 */
async function generateTile(z: number, x: number, y: number): Promise<Buffer | null> {
    const startTime = performance.now();

    // SQL query to generate MVT tile
    // Tolerances are kept conservative to avoid collapsing small zones into invalid geometries.
    // clip_geom=false avoids straight-line artefacts at tile boundaries (MapLibre clips client-side).
    const query = `
        WITH mvtgeom AS (
            SELECT
                id,
                nom,
                type_protection AS "typeProtection",
                gestionnaire,
                source,
                date_maj AS "dateMaj",
                code_departement AS "codeDepartement",
                ST_AsMVTGeom(
                    ST_Transform(
                        CASE
                            WHEN $1 BETWEEN 0 AND 8  THEN ST_SimplifyPreserveTopology(geometry, 0.001)
                            WHEN $1 BETWEEN 9 AND 12 THEN ST_SimplifyPreserveTopology(geometry, 0.0001)
                            ELSE geometry
                        END,
                        3857
                    ),
                    ST_TileEnvelope($1, $2, $3),
                    4096,
                    64,
                    true
                ) AS geom
            FROM zones
            WHERE geometry && ST_Transform(ST_TileEnvelope($1, $2, $3), 4326)
        )
        SELECT ST_AsMVT(mvtgeom.*, 'zones', 4096, 'geom', 'id') as tile
        FROM mvtgeom
        WHERE geom IS NOT NULL;
    `;

    try {
        const result = await pool.query(query, [z, x, y]);
        const duration = performance.now() - startTime;

        // Log performance
        if (duration > 100) {
            console.warn(`⚠️ Slow tile generation: ${z}/${x}/${y} in ${duration.toFixed(2)}ms`);
        } else {
            console.log(`Tile ${z}/${x}/${y} generated in ${duration.toFixed(2)}ms`);
        }

        const tile = result.rows[0]?.tile;

        // Check if tile is empty
        if (!tile || tile.length === 0) {
            return null;
        }

        return tile;
    } catch (error) {
        console.error(`Error generating tile ${z}/${x}/${y}:`, error);
        throw error;
    }
}

/**
 * GET /tiles/:z/:x/:y.mvt
 * Serve vector tiles in MVT format
 */
router.get('/tiles/:z/:x/:y.mvt', async (req: Request, res: Response): Promise<void> => {
    const {z, x, y} = req.params;

    // Parse parameters
    const zNum = parseInt(z, 10);
    const xNum = parseInt(x, 10);
    const yNum = parseInt(y, 10);

    // Validate numeric parameters
    if (isNaN(zNum) || isNaN(xNum) || isNaN(yNum)) {
        res.status(400).json({
            error: 'Invalid tile coordinates. z, x, and y must be numeric values.',
        });
        return;
    }

    // Validate coordinate ranges
    const validationError = validateTileCoordinates(zNum, xNum, yNum);
    if (validationError) {
        res.status(400).json({error: validationError});
        return;
    }

    // Generate cache key
    const cacheKey = `${zNum}-${xNum}-${yNum}`;
    const cacheHit = tileCache.has(cacheKey);

    try {
        let tile: Buffer | null | undefined;

        if (cacheHit) {
            tile = tileCache.get(cacheKey);
            console.log(`Tile ${zNum}/${xNum}/${yNum} served from cache (HIT)`);
        } else {
            tile = await generateTile(zNum, xNum, yNum);

            if (tile) {
                tileCache.set(cacheKey, tile);
                console.log(`Tile ${zNum}/${xNum}/${yNum} cached (MISS)`);
            }
        }

        res.setHeader('Access-Control-Allow-Origin', '*');

        // Return tile or 204 if empty
        if (!tile || tile.length === 0) {
            // Do not cache empty tiles: they may become non-empty after a data import.
            res.setHeader('Cache-Control', 'no-store');
            res.status(204).send();
            return;
        }

        res.setHeader('Content-Type', 'application/vnd.mapbox-vector-tile');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.status(200).send(tile);
    } catch (error) {
        console.error(`Error serving tile ${zNum}/${xNum}/${yNum}:`, error);
        res.status(500).json({
            error: 'Internal server error while generating tile',
        });
    }
});

export default router;
