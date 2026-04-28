/**
 * @jest-environment node
 */

import {
    getDepartementsWithZones,
    getDepartementBySlug,
    getDepartementBounds,
    getZonesByDepartement,
} from '../departements';

const mockQuery = jest.fn();

jest.mock('../client', () => ({
    pool: jest.fn(() => ({query: mockQuery})),
}));

describe('getDepartementsWithZones', () => {
    beforeEach(() => jest.clearAllMocks());

    it('returns departments with slug, code and nom', async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [
                {slug: 'haut-rhin-68', code: '68', nom: 'Haut-Rhin'},
                {slug: 'haute-savoie-74', code: '74', nom: 'Haute-Savoie'},
            ],
        });

        const result = await getDepartementsWithZones();
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({slug: 'haut-rhin-68', code: '68', nom: 'Haut-Rhin'});
    });

    it('returns empty array when no departments have data', async () => {
        mockQuery.mockResolvedValueOnce({rows: []});
        const result = await getDepartementsWithZones();
        expect(result).toEqual([]);
    });
});

describe('getDepartementBySlug', () => {
    beforeEach(() => jest.clearAllMocks());

    it('extracts code from slug and returns department detail', async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [{code: '68', nom: 'Haut-Rhin', zonesCount: 12}],
        });

        const result = await getDepartementBySlug('haut-rhin-68');
        expect(result).toEqual({code: '68', nom: 'Haut-Rhin', zonesCount: 12});
        expect(mockQuery).toHaveBeenCalledWith(expect.any(String), ['68']);
    });

    it('returns null when department not found', async () => {
        mockQuery.mockResolvedValueOnce({rows: []});
        const result = await getDepartementBySlug('inexistant-99');
        expect(result).toBeNull();
    });

    it('handles multi-part slug correctly', async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [{code: '04', nom: 'Alpes-de-Haute-Provence', zonesCount: 3}],
        });

        await getDepartementBySlug('alpes-de-haute-provence-04');
        expect(mockQuery).toHaveBeenCalledWith(expect.any(String), ['04']);
    });
});

describe('getDepartementBounds', () => {
    beforeEach(() => jest.clearAllMocks());

    it('returns bounds as nested arrays', async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [{minLng: 6.8, minLat: 47.4, maxLng: 7.9, maxLat: 48.9}],
        });

        const result = await getDepartementBounds('68');
        expect(result).toEqual([[6.8, 47.4], [7.9, 48.9]]);
    });

    it('returns null when no zones found for the department', async () => {
        mockQuery.mockResolvedValueOnce({rows: [{minLng: null, minLat: null, maxLng: null, maxLat: null}]});
        const result = await getDepartementBounds('99');
        expect(result).toBeNull();
    });

    it('returns null when query returns empty rows', async () => {
        mockQuery.mockResolvedValueOnce({rows: []});
        const result = await getDepartementBounds('99');
        expect(result).toBeNull();
    });
});

describe('getZonesByDepartement', () => {
    beforeEach(() => jest.clearAllMocks());

    it('returns zones with id, nom and typeProtection', async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [
                {id: 1, nom: 'Réserve A', typeProtection: 'reserve_naturelle_nationale'},
                {id: 2, nom: null, typeProtection: 'reserve_chasse_faune_sauvage'},
            ],
        });

        const result = await getZonesByDepartement('68');
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({id: 1, nom: 'Réserve A', typeProtection: 'reserve_naturelle_nationale'});
        expect(result[1]).toEqual({id: 2, nom: null, typeProtection: 'reserve_chasse_faune_sauvage'});
    });

    it('queries by department code', async () => {
        mockQuery.mockResolvedValueOnce({rows: []});
        await getZonesByDepartement('74');
        expect(mockQuery).toHaveBeenCalledWith(expect.any(String), ['74']);
    });
});
