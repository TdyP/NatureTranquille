import {pool} from './client';

export type DepartementSummary = {
    slug: string;
    code: string;
    nom: string;
};

export type DepartementDetail = {
    code: string;
    nom: string;
    zonesCount: number;
};

export type DepartementBounds = [[number, number], [number, number]];

export type ZoneSummary = {
    id: number;
    nom: string | null;
    typeProtection: string | null;
};

export async function getDepartementsWithZones(): Promise<DepartementSummary[]> {
    try {
        const pg = pool();
        const result = await pg.query<DepartementSummary>(`
            SELECT DISTINCT
                LOWER(REGEXP_REPLACE(nom_departement, '[^a-zA-Z0-9]', '-', 'g')) || '-' || code_departement AS slug,
                code_departement AS code,
                nom_departement AS nom
            FROM zones
            WHERE nom_departement IS NOT NULL AND code_departement IS NOT NULL
            ORDER BY code_departement
        `);
        return result.rows;
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('[DB] Database not available, returning mock data for build');
        }
        return [];
    }
}

export async function getDepartementBySlug(slug: string): Promise<DepartementDetail | null> {
    try {
        const parts = slug.split('-');
        const code = parts[parts.length - 1];

        const pg = pool();
        const result = await pg.query<DepartementDetail>(`
            SELECT
                code_departement AS code,
                nom_departement AS nom,
                COUNT(*) AS "zonesCount"
            FROM zones
            WHERE code_departement = $1 AND nom_departement IS NOT NULL
            GROUP BY code_departement, nom_departement
            LIMIT 1
        `, [code]);

        return result.rows[0] ?? null;
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('[DB] Database not available, returning null for getDepartementBySlug');
        }
        return null;
    }
}

export async function getDepartementBounds(code: string): Promise<DepartementBounds | null> {
    try {
        const pg = pool();
        const result = await pg.query<{
            minLng: number;
            minLat: number;
            maxLng: number;
            maxLat: number;
        }>(`
            SELECT
                ST_XMin(ST_Extent(geometry)) AS "minLng",
                ST_YMin(ST_Extent(geometry)) AS "minLat",
                ST_XMax(ST_Extent(geometry)) AS "maxLng",
                ST_YMax(ST_Extent(geometry)) AS "maxLat"
            FROM zones
            WHERE code_departement = $1
        `, [code]);

        const row = result.rows[0];
        if (!row || row.minLng == null) return null;

        return [[row.minLng, row.minLat], [row.maxLng, row.maxLat]];
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('[DB] Database not available, returning null for getDepartementBounds');
        }
        return null;
    }
}

export async function getZonesByDepartement(code: string): Promise<ZoneSummary[]> {
    try {
        const pg = pool();
        const result = await pg.query<ZoneSummary>(`
            SELECT
                id,
                nom,
                type_protection AS "typeProtection"
            FROM zones
            WHERE code_departement = $1
            ORDER BY nom NULLS LAST
        `, [code]);

        return result.rows;
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('[DB] Database not available, returning empty array for getZonesByDepartement');
        }
        return [];
    }
}
