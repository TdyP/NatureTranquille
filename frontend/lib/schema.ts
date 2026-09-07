export const schemaOrgWebApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'NatureTranquille',
    url: 'https://naturetranquille.fr',
    description: 'Carte interactive des zones sans chasse en France',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web browser',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
    },
};

export const schemaOrgWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NatureTranquille',
    url: 'https://naturetranquille.fr',
    description: 'Carte interactive gratuite des zones sans chasse en France',
    inLanguage: 'fr-FR',
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://naturetranquille.fr/departements?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
    },
};

export function schemaOrgBreadcrumb(items: {name: string; url: string}[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}
