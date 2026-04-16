export type ImportSource = {
    file: string;
    nomColumn?: string;
    nomValue?: string;
    typeProtectionColumn?: string;
    typeProtectionValue?: string;
    gestionnaireColumn?: string;
    gestionnaireValue?: string;
    sourceValue: string;
};

export type GeoJsonProperties = Record<string, string | number | boolean | null>;

export type GeoJsonFeature = {
    type: 'Feature';
    geometry: {
        type: string;
        coordinates: unknown;
    };
    properties: GeoJsonProperties | null;
};

export type GeoJsonCollection = {
    type: 'FeatureCollection';
    features: GeoJsonFeature[];
};

export type ImportSourceResult = {
    file: string;
    inserted: number;
    corrected: number;
    skipped: number;
    error?: string;
};

export type ImportResult = {
    sources: ImportSourceResult[];
    totalInserted: number;
};
