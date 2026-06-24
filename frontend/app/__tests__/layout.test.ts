/**
 * @jest-environment node
 */

import {metadata} from '../layout';
import {schemaOrgWebApp} from '../../lib/schema';

describe('layout metadata', () => {
    it('has correct title', () => {
        expect(metadata.title).toBe('NatureTranquille - Carte des zones sans chasse en France');
    });

    it('has description with key terms', () => {
        expect(metadata.description).toContain('zones sans chasse');
        expect(metadata.description).toContain('réserves naturelles');
    });

    it('has keywords', () => {
        expect(metadata.keywords).toContain('zones sans chasse');
        expect(metadata.keywords).toContain('RNCFS');
    });

    it('has openGraph with all required fields', () => {
        const og = metadata.openGraph as Record<string, unknown>;
        expect(og.title).toBeDefined();
        expect(og.description).toBeDefined();
        expect(og.url).toBe('https://naturetranquille.fr');
        expect(og.siteName).toBe('NatureTranquille');
        expect(og.locale).toBe('fr_FR');
        expect(og.type).toBe('website');
        const images = og.images as Array<{url: string; alt: string}>;
        expect(images[0].url).toContain('og-image.png');
        expect(images[0].alt).toBeDefined();
    });

    it('has twitter card metadata', () => {
        const twitter = metadata.twitter as Record<string, unknown>;
        expect(twitter.card).toBe('summary_large_image');
        expect(twitter.title).toBeDefined();
        expect(twitter.images).toBeDefined();
    });

    it('has robots allow indexing', () => {
        const robots = metadata.robots as Record<string, unknown>;
        expect(robots.index).toBe(true);
        expect(robots.follow).toBe(true);
    });
});

describe('schemaOrgWebApp', () => {
    it('has correct @type', () => {
        expect(schemaOrgWebApp['@type']).toBe('WebApplication');
    });

    it('has correct @context', () => {
        expect(schemaOrgWebApp['@context']).toBe('https://schema.org');
    });

    it('has correct name and url', () => {
        expect(schemaOrgWebApp.name).toBe('NatureTranquille');
        expect(schemaOrgWebApp.url).toBe('https://naturetranquille.fr');
    });

    it('has free offer', () => {
        expect(schemaOrgWebApp.offers['@type']).toBe('Offer');
        expect(schemaOrgWebApp.offers.price).toBe('0');
        expect(schemaOrgWebApp.offers.priceCurrency).toBe('EUR');
    });

    it('serializes to valid JSON', () => {
        expect(() => JSON.stringify(schemaOrgWebApp)).not.toThrow();
    });
});
