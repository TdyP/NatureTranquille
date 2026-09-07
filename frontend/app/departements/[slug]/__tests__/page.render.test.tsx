/**
 * @jest-environment jsdom
 */

import {render, screen} from '@testing-library/react';

jest.mock('@/lib/db/departements', () => ({
    getDepartementsWithZones: jest.fn(),
    getDepartementBySlug: jest.fn(),
    getDepartementBounds: jest.fn(),
    getZonesByDepartement: jest.fn(),
}));

jest.mock('next/dynamic', () => ({
    __esModule: true,
    default: () => {
        const React = require('react');
        return React.forwardRef(function MockMap() {
            return React.createElement('div', {'data-testid': 'mock-map'}, 'Map');
        });
    },
}));

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({children, href}: {children: React.ReactNode; href: string}) =>
        require('react').createElement('a', {href}, children),
}));

jest.mock('next/navigation', () => ({
    notFound: jest.fn(),
}));

const {getDepartementBySlug, getDepartementBounds, getZonesByDepartement} =
    jest.requireMock('@/lib/db/departements');

// Import after mocks are set up
const DepartementPage = require('../page').default;

describe('DepartementPage render', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders the department heading and zones list as SSR content', async () => {
        getDepartementBySlug.mockResolvedValueOnce({
            code: '68',
            nom: 'Haut-Rhin',
            zonesCount: 2,
        });
        getDepartementBounds.mockResolvedValueOnce(null);
        getZonesByDepartement.mockResolvedValueOnce([
            {id: 1, nom: 'Réserve du Donon', typeProtection: 'RNCFS'},
            {id: 2, nom: 'Réserve du Ballon', typeProtection: 'Réserve naturelle'},
        ]);

        const {container} = render(
            await DepartementPage({params: {slug: 'haut-rhin-68'}}),
        );

        expect(
            screen.getByRole('heading', {level: 1, name: 'Réserves de chasse — Haut-Rhin (68)'}),
        ).toBeInTheDocument();

        // SSR content mentions the zone count
        expect(container.textContent).toContain('2 zones sans chasse');
        expect(container.textContent).toContain('Réserve du Donon');
        expect(container.textContent).toContain('Réserve du Ballon');
    });

    it('renders zones without names using fallback label', async () => {
        getDepartementBySlug.mockResolvedValueOnce({
            code: '67',
            nom: 'Bas-Rhin',
            zonesCount: 1,
        });
        getDepartementBounds.mockResolvedValueOnce(null);
        getZonesByDepartement.mockResolvedValueOnce([
            {id: 42, nom: null, typeProtection: null},
        ]);

        const {container} = render(
            await DepartementPage({params: {slug: 'bas-rhin-67'}}),
        );

        expect(container.textContent).toContain('Zone 42');
    });

    it('injects BreadcrumbList JSON-LD', async () => {
        getDepartementBySlug.mockResolvedValueOnce({
            code: '68',
            nom: 'Haut-Rhin',
            zonesCount: 1,
        });
        getDepartementBounds.mockResolvedValueOnce(null);
        getZonesByDepartement.mockResolvedValueOnce([]);

        const {container} = render(
            await DepartementPage({params: {slug: 'haut-rhin-68'}}),
        );

        const script = container.querySelector('script[type="application/ld+json"]');
        expect(script).toBeInTheDocument();
        const json = JSON.parse(script!.textContent!);
        expect(json['@type']).toBe('BreadcrumbList');
        expect(json.itemListElement).toHaveLength(3);
        expect(json.itemListElement[2].name).toBe('Haut-Rhin');
    });
});
