import {test, expect} from '@playwright/test';

test.describe('Map Page - Performance', () => {
    test('should load and display map', async ({page}) => {
        await page.goto('/');

        // Check header is visible
        await expect(page.getByText('NatureTranquille')).toBeVisible();

        // Check map loading state appears
        await expect(page.getByText('Chargement de la carte...')).toBeVisible();

        // Wait for map to load (loading state disappears)
        await expect(page.getByText('Chargement de la carte...')).toBeHidden({timeout: 10000});

        // Check map container is present
        const mapContainer = page.getByRole('application', {name: /Carte interactive/});
        await expect(mapContainer).toBeVisible();
    });

    test('should have skip link for accessibility', async ({page}) => {
        await page.goto('/');

        // Focus on skip link (Tab key)
        await page.keyboard.press('Tab');

        // Check skip link is visible when focused
        const skipLink = page.getByText('Aller au contenu principal');
        await expect(skipLink).toBeVisible();
    });

    test('should display navigation menu', async ({page}) => {
        await page.goto('/');

        // Check navigation items are present
        await expect(page.getByRole('link', {name: 'Accueil'})).toBeVisible();
        await expect(page.getByRole('link', {name: 'Sources'})).toBeVisible();
        await expect(page.getByRole('link', {name: 'À propos'})).toBeVisible();
        await expect(page.getByRole('link', {name: 'Feedback'})).toBeVisible();
    });

    test('should display map legend', async ({page}) => {
        await page.goto('/');

        // Wait for map to load
        await expect(page.getByText('Chargement de la carte...')).toBeHidden({timeout: 10000});

        // Check legend is visible
        await expect(page.getByText('Légende')).toBeVisible();
        await expect(page.getByText('Zone sans chasse identifiée')).toBeVisible();
    });
});

test.describe('Map Page - Mobile', () => {
    test.use({
        viewport: {width: 375, height: 667}, // iPhone SE size
    });

    test('should display mobile menu button', async ({page}) => {
        await page.goto('/');

        // Check hamburger menu is visible on mobile
        const menuButton = page.getByLabel('Ouvrir le menu');
        await expect(menuButton).toBeVisible();
    });

    test('should open mobile menu on click', async ({page}) => {
        await page.goto('/');

        // Click hamburger menu
        await page.getByLabel('Ouvrir le menu').click();

        // Check mobile menu is visible
        await expect(page.getByText('Menu')).toBeVisible();
        await expect(page.getByRole('navigation', {name: /Navigation mobile/})).toBeVisible();
    });

    test('mobile menu should close on link click', async ({page}) => {
        await page.goto('/');

        // Open menu
        await page.getByLabel('Ouvrir le menu').click();

        // Click a link
        const accueilLink = page.getByRole('link', {name: 'Accueil'}).last();
        await accueilLink.click();

        // Menu should close
        await expect(page.getByRole('navigation', {name: /Navigation mobile/})).toBeHidden();
    });
});
