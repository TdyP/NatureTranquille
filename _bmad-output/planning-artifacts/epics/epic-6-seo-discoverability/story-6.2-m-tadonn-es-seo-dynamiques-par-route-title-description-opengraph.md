### Story 6.2: Métadonnées SEO dynamiques par route (title, description, OpenGraph)


**User Story**
En tant que **développeur**, je veux générer des métadonnées SEO optimales pour chaque page, afin de maximiser la découvrabilité via Google et le partage sur réseaux sociaux.

**Acceptance Criteria**

**GIVEN** : Les routes statiques sont générées (Story 6.1)
**WHEN** : Une page est servie
**THEN** :

- Métadonnées `<head>` complètes :

**Page Accueil `/`** :

```tsx
export const metadata = {
    title: 'NatureTranquille - Carte des zones sans chasse en France',
    description:
        'Carte interactive gratuite des zones sans chasse en France : réserves naturelles, RNCFS. Trouvez les zones protégées près de chez vous pour profiter de la nature en toute sérénité.',
    keywords:
        'zones sans chasse, réserves naturelles, RNCFS, carte chasse France, nature tranquille, randonnée sécurisée',
    openGraph: {
        title: 'NatureTranquille - Zones sans chasse en France',
        description: 'Carte interactive des zones sans chasse',
        url: 'https://naturetranquille.fr',
        siteName: 'NatureTranquille',
        images: [
            {
                url: 'https://naturetranquille.fr/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Carte France avec zones sans chasse',
            },
        ],
        locale: 'fr_FR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'NatureTranquille - Zones sans chasse France',
        description: 'Carte interactive gratuite des zones sans chasse',
        images: ['https://naturetranquille.fr/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
        },
    },
};
```

**Page Département `/departements/[slug]`** :

```tsx
export async function generateMetadata({params}) {
    const dept = await getDepartementBySlug(params.slug);

    return {
        title: `Zones sans chasse ${dept.nom} (${dept.code}) - NatureTranquille`,
        description: `Découvrez les ${dept.zones_count} zones sans chasse identifiées dans le ${dept.nom}. Carte interactive, données officielles, accès gratuit.`,
        openGraph: {
            title: `${dept.nom} - Zones sans chasse`,
            url: `https://naturetranquille.fr/departements/${params.slug}`,
            images: [{url: `/og-images/${dept.code}.png`}], // Image générée dynamiquement Phase 2
        },
    };
}
```

**AND** : Balises structurées Schema.org :

```tsx
// app/layout.tsx
<script type="application/ld+json">
    {JSON.stringify({
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
    })}
</script>
```

**Accessibility Integration**

- Balise `<html lang="fr">` (langue déclarée)
- `<title>` unique et descriptif par page
- Métadonnées `description` claires et informatives
- Images OpenGraph avec `alt` descriptif

**Performance & Technical Acceptance**

- Métadonnées générées build-time (SSG)
- Validation Schema.org avec Google Rich Results Test
- OpenGraph validator Facebook : aucune erreur
- Twitter Card validator : image preview correct

---

