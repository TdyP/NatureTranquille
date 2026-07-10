import {spawnSync} from 'node:child_process';
import type {Pool} from 'pg';
import type {GeoJsonCollection, GeoJsonProperties, ImportResult, ImportSource, ImportSourceResult} from './types';

export function readGeoJsonFromOgr(file: string): GeoJsonCollection {
    const result = spawnSync('ogr2ogr', ['-f', 'GeoJSON', '/vsistdout/', '-t_srs', 'EPSG:4326', file], {
        encoding: 'utf-8',
        maxBuffer: 256 * 1024 * 1024,
    });
    if (result.error) {
        throw new Error(`Failed to run ogr2ogr: ${result.error.message}`);
    }
    if (result.status !== 0) {
        throw new Error(`ogr2ogr failed (exit ${result.status}): ${result.stderr}`);
    }
    return JSON.parse(result.stdout) as GeoJsonCollection;
}

function resolveProperty(
    properties: GeoJsonProperties | null,
    column: string | undefined,
    fixedValue: string | undefined,
): string | null {
    if (column !== undefined && properties !== null && properties[column] != null) {
        return String(properties[column]);
    }
    return fixedValue ?? null;
}

async function importSource(
    pool: Pool,
    source: ImportSource,
    geoJsonReader: (file: string) => GeoJsonCollection,
): Promise<ImportSourceResult> {
    const sourceResult: ImportSourceResult = {
        file: source.file,
        inserted: 0,
        corrected: 0,
        skipped: 0,
    };

    let collection: GeoJsonCollection;
    try {
        collection = geoJsonReader(source.file);
    } catch (err) {
        sourceResult.error = (err as Error).message;
        return sourceResult;
    }

    for (const feature of collection.features) {
        const nom = resolveProperty(feature.properties, source.nomColumn, source.nomValue);
        const typeProtection = resolveProperty(
            feature.properties,
            source.typeProtectionColumn,
            source.typeProtectionValue,
        );
        const gestionnaire = resolveProperty(feature.properties, source.gestionnaireColumn, source.gestionnaireValue);
        const geomJson = JSON.stringify(feature.geometry);

        try {
            const validityResult = await pool.query<{is_valid: boolean}>(
                'SELECT ST_IsValid(ST_GeomFromGeoJSON($1)) AS is_valid',
                [geomJson],
            );
            const isValid = validityResult.rows[0]?.is_valid ?? false;
            if (!isValid) {
                sourceResult.corrected++;
            }

            const insertResult = await pool.query(
                `WITH candidate AS (
                    SELECT
                        ST_Multi(
                            CASE WHEN ST_IsValid(ST_GeomFromGeoJSON($5))
                                 THEN ST_GeomFromGeoJSON($5)
                                 ELSE ST_MakeValid(ST_GeomFromGeoJSON($5))
                            END
                        )::geometry(MULTIPOLYGON, 4326) AS geometry
                )
                INSERT INTO public.zones (nom, type_protection, gestionnaire, source, date_maj, geometry)
                SELECT $1, $2, $3, $4, NOW(), c.geometry
                FROM candidate c
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM public.zones z
                    WHERE md5(ST_AsBinary(z.geometry)) = md5(ST_AsBinary(c.geometry))
                )`,
                [nom, typeProtection, gestionnaire, source.sourceValue, geomJson],
            );

            if (insertResult.rowCount === 1) {
                sourceResult.inserted++;
            } else {
                sourceResult.skipped++;
            }
        } catch (err) {
            sourceResult.skipped++;
            console.error(`Skipped feature from ${source.file}: ${(err as Error).message}`);
        }
    }

    return sourceResult;
}

export async function runImport(
    pool: Pool,
    sources: ImportSource[],
    geoJsonReader: (file: string) => GeoJsonCollection = readGeoJsonFromOgr,
): Promise<ImportResult> {
    const sourceResults: ImportSourceResult[] = [];
    for (const source of sources) {
        const result = await importSource(pool, source, geoJsonReader);
        sourceResults.push(result);
    }
    const totalInserted = sourceResults.reduce((sum, r) => sum + r.inserted, 0);
    return {sources: sourceResults, totalInserted};
}
