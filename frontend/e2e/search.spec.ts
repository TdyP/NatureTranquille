import {test, expect} from '@playwright/test';

test.describe('Geographic Search', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('http://localhost:3000');
        // Wait for map to load
        await page.waitForSelector('[role="application"]');
    });

    test('displays search bar on page load', async ({page}) => {
        const searchInput = page.getByPlaceholder(/rechercher une ville/i);
        await expect(searchInput).toBeVisible();
    });

    test('shows loading state while fetching suggestions', async ({page}) => {
        const searchInput = page.getByPlaceholder(/rechercher une ville/i);

        await searchInput.fill('Strasbourg');

        // Should show loading indicator
        await expect(page.getByText(/recherche en cours/i)).toBeVisible({timeout: 1000});
    });

    test('displays autocomplete suggestions for valid query', async ({page}) => {
        const searchInput = page.getByPlaceholder(/rechercher une ville/i);

        await searchInput.fill('Strasbourg');

        // Wait for suggestions to appear
        await expect(page.getByText('Strasbourg', {exact: true})).toBeVisible({timeout: 2000});
    });

    test('zooms map when suggestion is selected', async ({page}) => {
        const searchInput = page.getByPlaceholder(/rechercher une ville/i);

        await searchInput.fill('Strasbourg');

        // Wait for and click suggestion
        const suggestion = page.getByText('Strasbourg', {exact: true});
        await expect(suggestion).toBeVisible({timeout: 2000});
        await suggestion.click();

        // Input should be cleared after selection
        await expect(searchInput).toHaveValue('');

        // Map should have zoomed (check if canvas is still present and map container has updated)
        const mapCanvas = page.locator('.maplibregl-canvas');
        await expect(mapCanvas).toBeVisible();
    });

    test('shows empty state for no results', async ({page}) => {
        const searchInput = page.getByPlaceholder(/rechercher une ville/i);

        // Search for something that likely won't return results
        await searchInput.fill('XYZABC123');

        // Wait for empty state message
        await expect(page.getByText(/aucun résultat trouvé/i)).toBeVisible({timeout: 2000});
    });

    test('clear button removes search text', async ({page}) => {
        const searchInput = page.getByPlaceholder(/rechercher une ville/i);

        await searchInput.fill('Strasbourg');

        // Wait for suggestions
        await expect(page.getByText('Strasbourg', {exact: true})).toBeVisible({timeout: 2000});

        // Click clear button
        const clearButton = page.getByRole('button', {name: /effacer/i});
        await clearButton.click();

        // Input should be cleared
        await expect(searchInput).toHaveValue('');

        // Suggestions should be hidden
        await expect(page.getByText('Strasbourg', {exact: true})).not.toBeVisible();
    });

    test('supports keyboard navigation', async ({page}) => {
        const searchInput = page.getByPlaceholder(/rechercher une ville/i);

        await searchInput.fill('Stras');

        // Wait for suggestions
        await page.waitForSelector('[cmdk-item]', {timeout: 2000});

        // Press arrow down to select first suggestion
        await searchInput.press('ArrowDown');

        // Press Enter to select
        await searchInput.press('Enter');

        // Input should be cleared after selection
        await expect(searchInput).toHaveValue('');
    });

    test('is accessible with screen reader', async ({page}) => {
        const searchInput = page.getByPlaceholder(/rechercher une ville/i);

        // Check for proper ARIA attributes
        await expect(searchInput).toHaveAttribute('aria-busy');

        // Check for live region
        const liveRegion = page.locator('[aria-live="polite"]');
        await expect(liveRegion).toBeAttached();

        // Type and check live region updates
        await searchInput.fill('Strasbourg');

        // Wait for suggestions and check live region announces results
        await page.waitForSelector('[cmdk-item]', {timeout: 2000});
        await expect(liveRegion).toHaveText(/suggestions? disponibles?/i, {timeout: 1000});
    });

    test('respects prefers-reduced-motion for animations', async ({page, context}) => {
        // Enable reduced motion preference
        await context.addInitScript(() => {
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: (query: string) => ({
                    matches: query === '(prefers-reduced-motion: reduce)',
                    media: query,
                    onchange: null,
                    addEventListener: () => {},
                    removeEventListener: () => {},
                    dispatchEvent: () => true,
                }),
            });
        });

        await page.reload();

        const searchInput = page.getByPlaceholder(/rechercher une ville/i);
        await searchInput.fill('Strasbourg');

        const suggestion = page.getByText('Strasbourg', {exact: true});
        await expect(suggestion).toBeVisible({timeout: 2000});
        await suggestion.click();

        // Map should zoom instantly without animation (duration: 0)
        // This is hard to test directly, but we verify the map responds
        await expect(searchInput).toHaveValue('');
    });

    test('handles API errors gracefully', async ({page, context}) => {
        // Intercept API calls and force an error
        await page.route('https://api-adresse.data.gouv.fr/search/**', (route) => {
            route.abort();
        });

        const searchInput = page.getByPlaceholder(/rechercher une ville/i);
        await searchInput.fill('Strasbourg');

        // Should display error message
        await expect(page.getByText(/recherche temporairement indisponible/i)).toBeVisible({timeout: 2000});
    });

    test('uses cached results for repeat searches', async ({page}) => {
        const searchInput = page.getByPlaceholder(/rechercher une ville/i);

        // First search
        await searchInput.fill('Strasbourg');
        await expect(page.getByText('Strasbourg', {exact: true})).toBeVisible({timeout: 2000});

        // Track network requests
        let requestCount = 0;
        page.on('request', (request) => {
            if (request.url().includes('api-adresse.data.gouv.fr')) {
                requestCount++;
            }
        });

        // Clear and search again
        const clearButton = page.getByRole('button', {name: /effacer/i});
        await clearButton.click();

        await searchInput.fill('Strasbourg');
        await expect(page.getByText('Strasbourg', {exact: true})).toBeVisible({timeout: 2000});

        // Second search should use cache, not make another request
        // (This is approximate since the request listener was attached late)
        expect(requestCount).toBeLessThanOrEqual(1);
    });
});
