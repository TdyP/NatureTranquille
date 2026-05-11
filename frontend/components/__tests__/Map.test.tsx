import {render, screen, waitFor} from '@testing-library/react';
import Map from '../Map';

// Mock MapLibre GL
jest.mock('maplibre-gl', () => ({
    Map: jest.fn(() => ({
        on: jest.fn((event: string, callback: () => void) => {
            if (event === 'load') {
                setTimeout(callback, 0);
            }
        }),
        addControl: jest.fn(),
        addSource: jest.fn(),
        addLayer: jest.fn(),
        remove: jest.fn(),
    })),
    NavigationControl: jest.fn(),
    GeolocateControl: jest.fn(),
}));

describe('Map Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders map container with accessibility attributes', () => {
        render(<Map />);

        const mapContainer = screen.getByRole('application');
        expect(mapContainer).toBeInTheDocument();
        expect(mapContainer).toHaveAttribute('aria-label', 'Carte interactive des zones sans chasse en France');
        expect(mapContainer).toHaveAttribute('tabIndex', '0');
    });

    it('shows loading state initially', () => {
        render(<Map />);

        const loadingStatus = screen.getByRole('status');
        expect(loadingStatus).toBeInTheDocument();
        expect(loadingStatus).toHaveAttribute('aria-live', 'polite');
        expect(screen.getByText('Chargement de la carte...')).toBeInTheDocument();
    });

    it('initializes map with correct default center and zoom', async () => {
        const maplibregl = require('maplibre-gl');

        render(<Map />);

        await waitFor(() => {
            expect(maplibregl.Map).toHaveBeenCalledWith(
                expect.objectContaining({
                    center: [2.2137, 46.2276],
                    zoom: 6,
                }),
            );
        });
    });

    it('accepts custom center and zoom props', async () => {
        const maplibregl = require('maplibre-gl');
        const customCenter: [number, number] = [5.7245, 45.1885]; // Grenoble
        const customZoom = 10;

        render(<Map center={customCenter} zoom={customZoom} />);

        await waitFor(() => {
            expect(maplibregl.Map).toHaveBeenCalledWith(
                expect.objectContaining({
                    center: customCenter,
                    zoom: customZoom,
                }),
            );
        });
    });

    it('uses environment variable for style URL', async () => {
        const maplibregl = require('maplibre-gl');
        const customStyle = 'https://custom-style.json';

        render(<Map styleUrl={customStyle} />);

        await waitFor(() => {
            expect(maplibregl.Map).toHaveBeenCalledWith(
                expect.objectContaining({
                    style: customStyle,
                }),
            );
        });
    });

    it('adds navigation and geolocate controls', async () => {
        const maplibregl = require('maplibre-gl');

        render(<Map />);

        await waitFor(() => {
            expect(maplibregl.NavigationControl).toHaveBeenCalled();
            expect(maplibregl.GeolocateControl).toHaveBeenCalled();
        });
    });

    it('hides loading state after map loads', async () => {
        render(<Map />);

        // Initially loading
        expect(screen.getByRole('status')).toBeInTheDocument();

        // After load event
        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });
    });

    it('cleans up map on unmount', () => {
        const maplibregl = require('maplibre-gl');
        const mockRemove = jest.fn();
        maplibregl.Map.mockImplementation(() => ({
            on: jest.fn((event: string, callback: () => void) => {
                if (event === 'load') setTimeout(callback, 0);
            }),
            addControl: jest.fn(),
            addSource: jest.fn(),
            addLayer: jest.fn(),
            remove: mockRemove,
        }));

        const {unmount} = render(<Map />);
        unmount();

        expect(mockRemove).toHaveBeenCalled();
    });

    it('calls fitBounds with initialBounds when provided', async () => {
        const mockFitBounds = jest.fn();
        const maplibregl = require('maplibre-gl');
        maplibregl.Map.mockImplementation(() => ({
            on: jest.fn((event: string, callback: () => void) => {
                if (event === 'load') setTimeout(callback, 0);
            }),
            addControl: jest.fn(),
            addSource: jest.fn(),
            addLayer: jest.fn(),
            setFilter: jest.fn(),
            fitBounds: mockFitBounds,
            remove: jest.fn(),
        }));

        const bounds: [[number, number], [number, number]] = [[6.8, 47.4], [7.9, 48.9]];
        render(<Map initialBounds={bounds} />);

        await waitFor(() => {
            expect(mockFitBounds).toHaveBeenCalledWith(bounds, expect.objectContaining({padding: 50, duration: 0}));
        });
    });

    it('calls setFilter with highlightDepartement when provided', async () => {
        const mockSetFilter = jest.fn();
        const maplibregl = require('maplibre-gl');
        maplibregl.Map.mockImplementation(() => ({
            on: jest.fn((event: string, callback: () => void) => {
                if (event === 'load') setTimeout(callback, 0);
            }),
            addControl: jest.fn(),
            addSource: jest.fn(),
            addLayer: jest.fn(),
            setFilter: mockSetFilter,
            remove: jest.fn(),
        }));

        render(<Map highlightDepartement="68" />);

        await waitFor(() => {
            expect(mockSetFilter).toHaveBeenCalledWith(
                'zones-fill',
                ['==', ['get', 'codeDepartement'], '68'],
            );
            expect(mockSetFilter).toHaveBeenCalledWith(
                'zones-stroke',
                ['==', ['get', 'codeDepartement'], '68'],
            );
        });
    });

    it('does not call fitBounds when initialBounds is not provided', async () => {
        const mockFitBounds = jest.fn();
        const maplibregl = require('maplibre-gl');
        maplibregl.Map.mockImplementation(() => ({
            on: jest.fn((event: string, callback: () => void) => {
                if (event === 'load') setTimeout(callback, 0);
            }),
            addControl: jest.fn(),
            addSource: jest.fn(),
            addLayer: jest.fn(),
            setFilter: jest.fn(),
            fitBounds: mockFitBounds,
            remove: jest.fn(),
        }));

        render(<Map />);

        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });

        expect(mockFitBounds).not.toHaveBeenCalled();
    });

    it('tracks click_zone event when a zone is clicked', async () => {
        const mockTrack = jest.fn();
        Object.defineProperty(window, 'umami', {value: {track: mockTrack}, writable: true});

        const layerHandlers: Record<string, (e: any) => void> = {};
        const maplibregl = require('maplibre-gl');
        maplibregl.Map.mockImplementation(() => ({
            on: jest.fn((event: string, layerOrCallback: string | (() => void), callback?: (e: any) => void) => {
                if (event === 'load' && typeof layerOrCallback === 'function') {
                    setTimeout(layerOrCallback, 0);
                } else if (typeof callback === 'function') {
                    layerHandlers[`${event}:${layerOrCallback}`] = callback;
                }
            }),
            addControl: jest.fn(),
            addSource: jest.fn(),
            addLayer: jest.fn(),
            setFeatureState: jest.fn(),
            getCanvas: jest.fn(() => ({style: {}})),
            remove: jest.fn(),
        }));

        render(<Map />);

        await waitFor(() => {
            expect(layerHandlers['click:zones-fill']).toBeDefined();
        });

        layerHandlers['click:zones-fill']({
            features: [
                {
                    id: 42,
                    properties: {
                        nom: 'Forêt domaniale de test',
                        typeProtection: 'Réserve naturelle régionale',
                        gestionnaire: null,
                        source: 'ONF',
                        dateMaj: '2024-01-01',
                    },
                },
            ],
        });

        expect(mockTrack).toHaveBeenCalledWith('click_zone', {
            zone_name: 'Forêt domaniale de test',
            zone_type: 'Réserve naturelle régionale',
        });
    });

    it('does not throw when window.umami is undefined and zone is clicked', async () => {
        Object.defineProperty(window, 'umami', {value: undefined, writable: true});

        const layerHandlers: Record<string, (e: any) => void> = {};
        const maplibregl = require('maplibre-gl');
        maplibregl.Map.mockImplementation(() => ({
            on: jest.fn((event: string, layerOrCallback: string | (() => void), callback?: (e: any) => void) => {
                if (event === 'load' && typeof layerOrCallback === 'function') {
                    setTimeout(layerOrCallback, 0);
                } else if (typeof callback === 'function') {
                    layerHandlers[`${event}:${layerOrCallback}`] = callback;
                }
            }),
            addControl: jest.fn(),
            addSource: jest.fn(),
            addLayer: jest.fn(),
            setFeatureState: jest.fn(),
            getCanvas: jest.fn(() => ({style: {}})),
            remove: jest.fn(),
        }));

        render(<Map />);

        await waitFor(() => {
            expect(layerHandlers['click:zones-fill']).toBeDefined();
        });

        expect(() =>
            layerHandlers['click:zones-fill']({
                features: [
                    {
                        id: 1,
                        properties: {
                            nom: 'Zone test',
                            typeProtection: 'Réserve',
                            gestionnaire: null,
                            source: 'test',
                            dateMaj: '2024-01-01',
                        },
                    },
                ],
            }),
        ).not.toThrow();
    });
});
