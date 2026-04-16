import assert from 'node:assert/strict';
import {afterEach, describe, it, mock} from 'node:test';
import fs from 'node:fs';
import child_process from 'node:child_process';
import type {Dirent} from 'node:fs';

import {
    autoMapColumns,
    discoverSources,
    extractXmlMetadata,
    getShapefileColumns,
    titleToTypeProtection,
} from './discover';

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<gmd:MD_Metadata>
  <gmd:contact>
    <gmd:CI_ResponsibleParty>
      <gmd:organisationName><gco:CharacterString>DDT 73 (Savoie)</gco:CharacterString></gmd:organisationName>
    </gmd:CI_ResponsibleParty>
  </gmd:contact>
  <gmd:identificationInfo>
    <gmd:MD_DataIdentification>
      <gmd:citation>
        <gmd:CI_Citation>
          <gmd:title><gco:CharacterString>Réserve de chasse et de faune sauvage (Savoie)</gco:CharacterString></gmd:title>
          <gmd:alternateTitle><gco:CharacterString>N_RES_CHASSE_FAUNE_ZINF_S_073</gco:CharacterString></gmd:alternateTitle>
        </gmd:CI_Citation>
      </gmd:citation>
    </gmd:MD_DataIdentification>
  </gmd:identificationInfo>
</gmd:MD_Metadata>`;

function makeDirent(name: string, isDirectory: boolean): Dirent {
    return {
        name,
        path: '/data/raw',
        parentPath: '/data/raw',
        isDirectory: () => isDirectory,
        isFile: () => !isDirectory,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isSymbolicLink: () => false,
        isFIFO: () => false,
        isSocket: () => false,
    } as Dirent;
}

describe('extractXmlMetadata', () => {
    afterEach(() => mock.restoreAll());

    it('extracts title, alternateTitle and organisation from ISO 19115 XML', () => {
        mock.method(fs, 'readFileSync', () => SAMPLE_XML);
        const meta = extractXmlMetadata('/data/raw/savoie/meta.xml');
        assert.equal(meta.title, 'Réserve de chasse et de faune sauvage (Savoie)');
        assert.equal(meta.alternateTitle, 'N_RES_CHASSE_FAUNE_ZINF_S_073');
        assert.equal(meta.organisation, 'DDT 73 (Savoie)');
    });

    it('returns empty strings when tags are absent', () => {
        mock.method(fs, 'readFileSync', () => '<gmd:MD_Metadata></gmd:MD_Metadata>');
        const meta = extractXmlMetadata('/data/raw/savoie/meta.xml');
        assert.equal(meta.title, '');
        assert.equal(meta.alternateTitle, '');
        assert.equal(meta.organisation, '');
    });

    it('propagates error when file cannot be read', () => {
        mock.method(fs, 'readFileSync', () => {
            throw new Error('ENOENT: no such file');
        });
        assert.throws(() => extractXmlMetadata('/missing.xml'), /ENOENT/);
    });
});

describe('getShapefileColumns', () => {
    afterEach(() => mock.restoreAll());

    it('parses field names from ogrinfo output', () => {
        mock.method(child_process, 'spawnSync', () => ({
            status: 0,
            stdout: [
                "INFO: Open of 'test.shp' successful.",
                'Layer name: test',
                'Geometry: Polygon',
                'NOM: String (80.0)',
                'GESTIONNAI: String (80.0)',
                'CODE: Integer (5.0)',
            ].join('\n'),
            stderr: '',
            error: undefined,
        }));
        const columns = getShapefileColumns('/data/raw/test/test.shp');
        assert.deepEqual(columns, ['NOM', 'GESTIONNAI', 'CODE']);
    });

    it('returns empty array when ogrinfo fails', () => {
        mock.method(child_process, 'spawnSync', () => ({
            status: 1,
            stdout: '',
            stderr: 'Unable to open file',
            error: undefined,
        }));
        assert.deepEqual(getShapefileColumns('/data/raw/missing.shp'), []);
    });

    it('returns empty array when ogrinfo is not found', () => {
        mock.method(child_process, 'spawnSync', () => ({
            status: null,
            stdout: '',
            stderr: '',
            error: new Error('ENOENT'),
        }));
        assert.deepEqual(getShapefileColumns('/data/raw/test.shp'), []);
    });
});

describe('autoMapColumns', () => {
    it('maps NOM and GESTIONNAI with exact match', () => {
        const result = autoMapColumns(['CODE', 'NOM', 'GESTIONNAI', 'SURFACE']);
        assert.equal(result.nomColumn, 'NOM');
        assert.equal(result.gestionnaireColumn, 'GESTIONNAI');
        assert.equal(result.typeProtectionColumn, undefined);
    });

    it('maps TYPE_PROT column', () => {
        const result = autoMapColumns(['NOM', 'TYPE_PROT', 'GESTIONNAI']);
        assert.equal(result.typeProtectionColumn, 'TYPE_PROT');
    });

    it('returns undefined for columns with no matching pattern', () => {
        const result = autoMapColumns(['OBJECTID', 'SHAPE_AREA', 'SHAPE_LEN']);
        assert.equal(result.nomColumn, undefined);
        assert.equal(result.gestionnaireColumn, undefined);
        assert.equal(result.typeProtectionColumn, undefined);
    });

    it('falls back to prefix matching when no exact match', () => {
        const result = autoMapColumns(['LIBERATION', 'GESTIONNAIRE_PRINCIPAL', 'CODE']);
        assert.equal(result.gestionnaireColumn, 'GESTIONNAIRE_PRINCIPAL');
    });

    it('preserves original column casing in returned value', () => {
        const result = autoMapColumns(['nom', 'gestionnai']);
        assert.equal(result.nomColumn, 'nom');
        assert.equal(result.gestionnaireColumn, 'gestionnai');
    });
});

describe('titleToTypeProtection', () => {
    it('maps "réserve nationale de chasse" to reserve_nationale_chasse_faune_sauvage', () => {
        assert.equal(
            titleToTypeProtection('Réserve nationale de chasse et de faune sauvage (R44)'),
            'reserve_nationale_chasse_faune_sauvage',
        );
    });

    it('maps "réserve de chasse" (without nationale) to reserve_chasse_faune_sauvage', () => {
        assert.equal(
            titleToTypeProtection('Réserve de chasse et de faune sauvage (Savoie)'),
            'reserve_chasse_faune_sauvage',
        );
    });

    it('maps "réserve naturelle nationale" to reserve_naturelle_nationale', () => {
        assert.equal(titleToTypeProtection('Réserve naturelle nationale des Bauges'), 'reserve_naturelle_nationale');
    });

    it('maps "réserve naturelle régionale" to reserve_naturelle_regionale', () => {
        assert.equal(titleToTypeProtection('Réserve naturelle régionale du Marais'), 'reserve_naturelle_regionale');
    });

    it('slugifies unknown titles', () => {
        assert.equal(titleToTypeProtection('Zone Humide Remarquable'), 'zone_humide_remarquable');
    });
});

describe('discoverSources', () => {
    afterEach(() => mock.restoreAll());

    it('discovers source with metadata from XML and columns from columnGetter', () => {
        mock.method(fs, 'readdirSync', ((dir: string, opts?: unknown) => {
            if (opts && (opts as {withFileTypes?: boolean}).withFileTypes) {
                return [makeDirent('savoie', true)];
            }
            return ['data.shp', 'meta.xml'];
        }) as typeof fs.readdirSync);
        mock.method(fs, 'readFileSync', () => SAMPLE_XML);

        const columnGetter = mock.fn(() => ['NOM', 'GESTIONNAI']);
        const sources = discoverSources('/data/raw', columnGetter);

        assert.equal(sources.length, 1);
        assert.equal(sources[0].sourceValue, 'N_RES_CHASSE_FAUNE_ZINF_S_073');
        assert.equal(sources[0].nomColumn, 'NOM');
        assert.equal(sources[0].gestionnaireColumn, 'GESTIONNAI');
        assert.equal(sources[0].typeProtectionValue, 'reserve_chasse_faune_sauvage');
        assert.equal(sources[0].gestionnaireValue, undefined);
        assert.equal(sources[0].sourceDir, '/data/raw/savoie');
    });

    it('uses gestionnaire from XML when no GESTIONNAI column detected', () => {
        mock.method(fs, 'readdirSync', ((dir: string, opts?: unknown) => {
            if (opts && (opts as {withFileTypes?: boolean}).withFileTypes) {
                return [makeDirent('rncfs', true)];
            }
            return ['data.shp', 'meta.xml'];
        }) as typeof fs.readdirSync);
        mock.method(fs, 'readFileSync', () => SAMPLE_XML);

        const columnGetter = mock.fn(() => ['NOM', 'CODE']);
        const sources = discoverSources('/data/raw', columnGetter);

        assert.equal(sources[0].gestionnaireValue, 'DDT 73 (Savoie)');
        assert.equal(sources[0].gestionnaireColumn, undefined);
    });

    it('skips subdirectories without a .shp file', () => {
        mock.method(fs, 'readdirSync', ((dir: string, opts?: unknown) => {
            if (opts && (opts as {withFileTypes?: boolean}).withFileTypes) {
                return [makeDirent('empty_dir', true)];
            }
            return ['readme.txt'];
        }) as typeof fs.readdirSync);

        const columnGetter = mock.fn(() => []);
        const sources = discoverSources('/data/raw', columnGetter);
        assert.equal(sources.length, 0);
    });

    it('uses folder name as sourceValue when XML has no alternateTitle', () => {
        mock.method(fs, 'readdirSync', ((dir: string, opts?: unknown) => {
            if (opts && (opts as {withFileTypes?: boolean}).withFileTypes) {
                return [makeDirent('rncfs', true)];
            }
            return ['data.shp', 'meta.xml'];
        }) as typeof fs.readdirSync);
        mock.method(fs, 'readFileSync', () => '<gmd:MD_Metadata></gmd:MD_Metadata>');

        const columnGetter = mock.fn(() => []);
        const sources = discoverSources('/data/raw', columnGetter);
        assert.equal(sources[0].sourceValue, 'rncfs');
    });

    it('ignores non-directory entries in rawDir', () => {
        mock.method(fs, 'readdirSync', ((dir: string, opts?: unknown) => {
            if (opts && (opts as {withFileTypes?: boolean}).withFileTypes) {
                return [makeDirent('file.txt', false), makeDirent('valid_source', true)];
            }
            return ['data.shp'];
        }) as typeof fs.readdirSync);

        const columnGetter = mock.fn(() => []);
        const sources = discoverSources('/data/raw', columnGetter);
        assert.equal(sources.length, 1);
        assert.equal(sources[0].sourceDir, '/data/raw/valid_source');
    });
});
