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
});
