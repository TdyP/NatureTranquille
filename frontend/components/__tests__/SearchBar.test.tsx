import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar, {AddressSearchResult} from '../SearchBar';

// Mock fetch
global.fetch = jest.fn();

const mockSearchResponse = {
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [7.7521, 48.5734],
            },
            properties: {
                label: 'Strasbourg, Bas-Rhin (67000)',
                name: 'Strasbourg',
                postcode: '67000',
                context: '67, Bas-Rhin, Grand Est',
                id: 'strasbourg-1',
            },
            bbox: [7.6821, 48.5234, 7.8221, 48.6234],
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [7.3572, 48.0847],
            },
            properties: {
                label: 'Colmar, Haut-Rhin (68000)',
                name: 'Colmar',
                postcode: '68000',
                context: '68, Haut-Rhin, Grand Est',
                id: 'colmar-1',
            },
            bbox: [7.2872, 48.0347, 7.4272, 48.1347],
        },
    ],
} as {features: AddressSearchResult[]};

describe('SearchBar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();
    });

    it('renders search input with placeholder', () => {
        render(<SearchBar />);

        const input = screen.getByPlaceholderText(/rechercher une ville/i);
        expect(input).toBeInTheDocument();
    });

    it('displays search icon', () => {
        render(<SearchBar />);

        // Search icon should be visible
        const searchIcon = document.querySelector('svg');
        expect(searchIcon).toBeInTheDocument();
    });

    it('does not fetch suggestions for queries shorter than 3 characters', async () => {
        const user = userEvent.setup();
        render(<SearchBar />);

        const input = screen.getByRole('combobox');

        await user.type(input, 'St');

        // Wait to ensure debounce has passed
        await waitFor(() => {
            expect(fetch).not.toHaveBeenCalled();
        });
    });

    it('fetches and displays suggestions after debounce', async () => {
        const user = userEvent.setup();
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockSearchResponse,
        });

        render(<SearchBar />);

        const input = screen.getByRole('combobox');

        await user.type(input, 'Stras');

        // Wait for debounce (300ms) + fetch
        await waitFor(
            () => {
                expect(fetch).toHaveBeenCalledWith(
                    expect.stringContaining('https://api-adresse.data.gouv.fr/search/?q=Stras'),
                    expect.any(Object)
                );
            },
            {timeout: 1000}
        );

        // Check suggestions are displayed
        await waitFor(() => {
            expect(screen.getByText('Strasbourg')).toBeInTheDocument();
            expect(screen.getByText('Colmar')).toBeInTheDocument();
        });
    });

    it('displays loading state while fetching', async () => {
        const user = userEvent.setup();
        let resolvePromise: (value: any) => void;
        const fetchPromise = new Promise((resolve) => {
            resolvePromise = resolve;
        });

        (fetch as jest.Mock).mockReturnValueOnce(fetchPromise);

        render(<SearchBar />);

        const input = screen.getByRole('combobox');

        await user.type(input, 'Strasbourg');

        // Wait for debounce
        await waitFor(() => {
            expect(screen.getByText(/recherche en cours/i)).toBeInTheDocument();
        });

        // Resolve fetch
        resolvePromise!({
            ok: true,
            json: async () => mockSearchResponse,
        });
    });

    it('displays error message when API fails', async () => {
        const user = userEvent.setup();
        (fetch as jest.Mock).mockRejectedValueOnce(new Error('API error'));

        render(<SearchBar />);

        const input = screen.getByRole('combobox');

        await user.type(input, 'Strasbourg');

        await waitFor(() => {
            expect(screen.getByText(/recherche temporairement indisponible/i)).toBeInTheDocument();
        });
    });

    it('displays empty state when no results found', async () => {
        const user = userEvent.setup();
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({features: []}),
        });

        render(<SearchBar />);

        const input = screen.getByRole('combobox');

        await user.type(input, 'XYZ123');

        await waitFor(() => {
            expect(screen.getByText(/aucun résultat trouvé pour "XYZ123"/i)).toBeInTheDocument();
        });
    });

    it('calls onSelectLocation when suggestion is clicked', async () => {
        const user = userEvent.setup();
        const handleSelect = jest.fn();
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockSearchResponse,
        });

        render(<SearchBar onSelectLocation={handleSelect} />);

        const input = screen.getByRole('combobox');

        await user.type(input, 'Stras');

        await waitFor(() => {
            expect(screen.getByText('Strasbourg')).toBeInTheDocument();
        });

        const suggestion = screen.getByText('Strasbourg');
        await user.click(suggestion);

        expect(handleSelect).toHaveBeenCalledWith(mockSearchResponse.features[0]);
    });

    it('clears search when clear button is clicked', async () => {
        const user = userEvent.setup();
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockSearchResponse,
        });

        render(<SearchBar />);

        const input = screen.getByRole('combobox');

        await user.type(input, 'Strasbourg');

        await waitFor(() => {
            expect(screen.getByText('Strasbourg')).toBeInTheDocument();
        });

        const clearButton = screen.getByRole('button', {name: /effacer/i});
        await user.click(clearButton);

        expect(input).toHaveValue('');
    });

    it('caches search results in sessionStorage', async () => {
        const user = userEvent.setup();
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockSearchResponse,
        });

        render(<SearchBar />);

        const input = screen.getByRole('combobox');

        await user.type(input, 'Stras');

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        // Clear input and search again
        const clearButton = screen.getByRole('button', {name: /effacer/i});
        await user.click(clearButton);

        await user.type(input, 'Stras');

        // Should use cache, not fetch again
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1); // Still only once
            expect(screen.getByText('Strasbourg')).toBeInTheDocument();
        });
    });

    it('announces results to screen readers', async () => {
        const user = userEvent.setup();
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockSearchResponse,
        });

        render(<SearchBar />);

        const input = screen.getByRole('combobox');

        await user.type(input, 'Stras');

        await waitFor(() => {
            const liveRegion = document.querySelector('[aria-live="polite"]');
            expect(liveRegion).toHaveTextContent(/2 suggestions disponibles/i);
        });
    });

    it('has accessible markup', () => {
        render(<SearchBar />);

        const input = screen.getByRole('combobox');
        expect(input).toHaveAttribute('aria-busy', 'false');

        // Live region for announcements
        const liveRegion = document.querySelector('[aria-live="polite"]');
        expect(liveRegion).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
        const user = userEvent.setup();
        const handleSelect = jest.fn();
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockSearchResponse,
        });

        render(<SearchBar onSelectLocation={handleSelect} />);

        const input = screen.getByRole('combobox');

        await user.type(input, 'Stras');

        await waitFor(() => {
            expect(screen.getByText('Strasbourg')).toBeInTheDocument();
        });

        // Arrow down to first suggestion
        await user.keyboard('{ArrowDown}');
        // Enter to select
        await user.keyboard('{Enter}');

        expect(handleSelect).toHaveBeenCalled();
    });
});
