/**
 * @jest-environment node
 */

import sitemap from '../sitemap';

jest.mock('@/lib/db/departements', () => ({
    getDepartementsWithZones: jest.fn(),
}));

const {getDepartementsWithZones} = jest.requireMock('@/lib/db/departements');

describe('sitemap()', () => {
    beforeEach(() => jest.clearAllMocks());

    it('includes all static pages', async () => {
        getDepartementsWithZones.mockResolvedValueOnce([]);

        const result = await sitemap();
        const urls = result.map((e) => e.url);

        expect(urls).toContain('https://naturetranquille.fr');
        expect(urls).toContain('https://naturetranquille.fr/a-propos');
        expect(urls).toContain('https://naturetranquille.fr/feedback');
    });

    it('homepage has priority 1.0', async () => {
        getDepartementsWithZones.mockResolvedValueOnce([]);

        const result = await sitemap();
        const home = result.find((e) => e.url === 'https://naturetranquille.fr');

        expect(home?.priority).toBe(1.0);
    });

    it('includes department pages from DB', async () => {
        getDepartementsWithZones.mockResolvedValueOnce([
            {slug: 'haut-rhin-68', code: '68', nom: 'Haut-Rhin'},
            {slug: 'haute-savoie-74', code: '74', nom: 'Haute-Savoie'},
        ]);

        const result = await sitemap();
        const urls = result.map((e) => e.url);

        expect(urls).toContain('https://naturetranquille.fr/departements/haut-rhin-68');
        expect(urls).toContain('https://naturetranquille.fr/departements/haute-savoie-74');
    });

    it('department pages have priority 0.9 and weekly frequency', async () => {
        getDepartementsWithZones.mockResolvedValueOnce([{slug: 'haut-rhin-68', code: '68', nom: 'Haut-Rhin'}]);

        const result = await sitemap();
        const dept = result.find((e) => e.url.includes('/departements/'));

        expect(dept?.priority).toBe(0.9);
        expect(dept?.changeFrequency).toBe('weekly');
    });

    it('returns at least 3 entries (static pages) even with no departments', async () => {
        getDepartementsWithZones.mockResolvedValueOnce([]);

        const result = await sitemap();

        expect(result.length).toBeGreaterThanOrEqual(3);
    });

    it('all entries have a lastModified date', async () => {
        getDepartementsWithZones.mockResolvedValueOnce([{slug: 'bas-rhin-67', code: '67', nom: 'Bas-Rhin'}]);

        const result = await sitemap();

        for (const entry of result) {
            expect(entry.lastModified).toBeInstanceOf(Date);
        }
    });
});
