import fs from 'node:fs';
import path from 'node:path';
import child_process from 'node:child_process';
import type {ImportSource} from './types';

export type DiscoveredSource = ImportSource & {
    sourceDir: string;
};

type XmlMetadata = {
    title: string;
    alternateTitle: string;
    organisation: string;
};

type ColumnMapping = {
    nomColumn?: string;
    typeProtectionColumn?: string;
    gestionnaireColumn?: string;
};

const NOM_PATTERNS = ['NOM', 'NOM_SITE', 'NOM_RESERV', 'LIBELLE', 'NAME', 'DENOMINATION'];
const TYPE_PROTECTION_PATTERNS = ['TYPE_PROT', 'TYPE_PROTE', 'TYPEPROTEC', 'TYPE', 'CATEGORIE'];
const GESTIONNAIRE_PATTERNS = ['GESTIONNAI', 'GESTIONNAIR', 'OPERATEUR', 'GESTIO'];

export function extractXmlMetadata(xmlPath: string): XmlMetadata {
    const content = fs.readFileSync(xmlPath, 'utf-8');

    const extract = (tag: string): string => {
        const match = content.match(new RegExp(`<${tag}>\\s*<gco:CharacterString>([^<]+)<\\/gco:CharacterString>`));
        return match?.[1]?.trim() ?? '';
    };

    return {
        title: extract('gmd:title'),
        alternateTitle: extract('gmd:alternateTitle'),
        organisation: extract('gmd:organisationName'),
    };
}

export function getShapefileColumns(shpPath: string): string[] {
    const result = child_process.spawnSync('ogrinfo', ['-al', '-so', shpPath], {
        encoding: 'utf-8',
    });
    if (result.error || result.status !== 0) return [];

    const columns: string[] = [];
    const EXCLUDED = new Set(['Geometry', 'INFO', 'Feature', 'FID', 'Layer']);
    for (const line of (result.stdout as string).split('\n')) {
        const match = line.match(/^(\w+):\s+\w/);
        if (match && !EXCLUDED.has(match[1])) {
            columns.push(match[1]);
        }
    }
    return columns;
}

export function autoMapColumns(columns: string[]): ColumnMapping {
    const upper = columns.map((c) => c.toUpperCase());

    const findBestMatch = (patterns: string[]): string | undefined => {
        for (const pattern of patterns) {
            const idx = upper.indexOf(pattern);
            if (idx !== -1) return columns[idx];
        }
        for (const pattern of patterns) {
            const prefix = pattern.substring(0, 8);
            const idx = upper.findIndex((c) => c.startsWith(prefix));
            if (idx !== -1) return columns[idx];
        }
        return undefined;
    };

    return {
        nomColumn: findBestMatch(NOM_PATTERNS),
        typeProtectionColumn: findBestMatch(TYPE_PROTECTION_PATTERNS),
        gestionnaireColumn: findBestMatch(GESTIONNAIRE_PATTERNS),
    };
}

export function titleToTypeProtection(title: string): string {
    const normalized = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');

    if (normalized.includes('nationale') && normalized.includes('chasse')) {
        return 'reserve_nationale_chasse_faune_sauvage';
    }
    if (normalized.includes('chasse')) {
        return 'reserve_chasse_faune_sauvage';
    }
    if (normalized.includes('naturelle') && normalized.includes('nationale')) {
        return 'reserve_naturelle_nationale';
    }
    if (normalized.includes('naturelle') && normalized.includes('regionale')) {
        return 'reserve_naturelle_regionale';
    }
    return normalized.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

export function discoverSources(
    rawDir: string,
    columnGetter: (shpPath: string) => string[] = getShapefileColumns,
): DiscoveredSource[] {
    const entries = fs.readdirSync(rawDir, {withFileTypes: true});
    const sources: DiscoveredSource[] = [];

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const dirPath = path.join(rawDir, entry.name);
        const files = fs.readdirSync(dirPath) as unknown as string[];

        const shpFile = files.find((f) => f.toLowerCase().endsWith('.shp'));
        if (!shpFile) {
            console.warn(`Skipping ${entry.name}: no .shp file found`);
            continue;
        }
        const shpPath = path.join(dirPath, shpFile);

        const xmlFile = files.find((f) => f.toLowerCase().endsWith('.xml'));
        let metadata: XmlMetadata = {title: '', alternateTitle: entry.name, organisation: ''};
        if (xmlFile) {
            try {
                const parsed = extractXmlMetadata(path.join(dirPath, xmlFile));
                metadata = {
                    title: parsed.title,
                    alternateTitle: parsed.alternateTitle || entry.name,
                    organisation: parsed.organisation,
                };
            } catch (err) {
                console.warn(`Failed to parse XML in ${entry.name}: ${(err as Error).message}`);
            }
        }

        const columns = columnGetter(shpPath);
        const mapping = autoMapColumns(columns);

        const source: DiscoveredSource = {
            file: shpPath,
            sourceValue: metadata.alternateTitle,
            sourceDir: dirPath,
            ...mapping,
        };

        if (!mapping.typeProtectionColumn && metadata.title) {
            source.typeProtectionValue = titleToTypeProtection(metadata.title);
        }
        if (!mapping.gestionnaireColumn && metadata.organisation) {
            source.gestionnaireValue = metadata.organisation;
        }

        sources.push(source);
    }

    return sources;
}
