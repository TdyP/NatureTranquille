/**
 * @jest-environment node
 */

import {generateMetadata} from '../page';

jest.mock('@/lib/db/departements', () => ({
    getDepartementsWithZones: jest.fn(),
    getDepartementBySlug: jest.fn(),
    getDepartementBounds: jest.fn(),
    getZonesByDepartement: jest.fn(),
}));

const {getDepartementBySlug} = jest.requireMock('@/lib/db/departements');

describe('generateMetadata - /departements/[slug]', () => {
    beforeEach(() => jest.clearAllMocks());

    it('returns full metadata when department exists', async () => {
        getDepartementBySlug.mockResolvedValueOnce({
            code: '68',
            nom: 'Haut-Rhin',
            zonesCount: 5,
        });

        const result = await generateMetadata({params: {slug: 'haut-rhin-68'}});

        expect(result.title).toBe('Zones sans chasse Haut-Rhin (68) - NatureTranquille');
        expect(result.description).toContain('5');
        expect(result.description).toContain('Haut-Rhin');
    });

    it('includes openGraph url with slug', async () => {
        getDepartementBySlug.mockResolvedValueOnce({
            code: '68',
            nom: 'Haut-Rhin',
            zonesCount: 5,
        });

        const result = await generateMetadata({params: {slug: 'haut-rhin-68'}});
        const og = result.openGraph as Record<string, unknown>;

        expect(og.url).toContain('haut-rhin-68');
    });

    it('returns empty object when department not found', async () => {
        getDepartementBySlug.mockResolvedValueOnce(null);

        const result = await generateMetadata({params: {slug: 'inexistant-99'}});

        expect(result).toEqual({});
    });

    it('calls getDepartementBySlug with correct slug', async () => {
        getDepartementBySlug.mockResolvedValueOnce(null);

        await generateMetadata({params: {slug: 'bas-rhin-67'}});

        expect(getDepartementBySlug).toHaveBeenCalledWith('bas-rhin-67');
    });
});
