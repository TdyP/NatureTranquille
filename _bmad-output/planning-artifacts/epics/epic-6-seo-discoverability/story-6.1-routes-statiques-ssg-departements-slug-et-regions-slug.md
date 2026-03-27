### Story 6.1: Routes statiques SSG `/departements/[slug]` et `/regions/[slug]`

**User Story**
En tant que **Tom recherchant "zones sans chasse Bas-Rhin" sur Google**, je veux trouver une page dédiée au département avec la carte automatiquement centrée sur cette zone, afin d'accéder directement à l'information pertinente.

**Acceptance Criteria**

**GIVEN** : L'application Next.js est buildée avec SSG
**WHEN** : Next.js génère les pages statiques
**THEN** :

- Routes dynamiques créées :
    - `/departements/[slug]` : ex `/departements/bas-rhin-67`
    - `/regions/[slug]` : ex `/regions/grand-est`

**AND** : Génération pages via `generateStaticParams` :

```tsx
// app/departements/[slug]/page.tsx
import {db} from '@/lib/db';

export async function generateStaticParams() {
    const departements = await db.query(`
    SELECT DISTINCT
            LOWER(REGEXP_REPLACE(nom_departement, '[^a-zA-Z0-9]', '-', 'g')) AS slug,
            nom_departement,
            code_departement
        FROM zones
    ORDER BY code_departement
  `);

    return departements.rows.map((d) => ({
        slug: `${d.slug}-${d.code_departement}`,
    }));
}

export async function generateMetadata({params}: {params: {slug: string}}) {
    const dept = await getDepartementBySlug(params.slug);

    return {
        title: `Zones sans chasse ${dept.nom} (${dept.code}) - NatureTranquille`,
        description: `Carte interactive des zones sans chasse dans le département ${dept.nom} (${dept.code}). Données officielles RNCFS et réserves naturelles.`,
        openGraph: {
            title: `Zones sans chasse ${dept.nom} - NatureTranquille`,
            description: `Découvrez les zones sans chasse dans le ${dept.nom}`,
            images: [{url: '/og-image-departement.png'}],
        },
    };
}

export default async function DepartementPage({params}: {params: {slug: string}}) {
    const dept = await getDepartementBySlug(params.slug);
    const zones = await getZonesByDepartement(dept.code);

    return (
        <main>
            <h1 className="text-3xl font-bold mb-4">
                Zones sans chasse dans le {dept.nom} ({dept.code})
            </h1>

            <p className="mb-6">
                {zones.length} zone(s) sans chasse identifiée(s) dans le département {dept.nom}.
            </p>

            <Map initialCenter={dept.center} initialZoom={9} highlightDepartement={dept.code} />

            <section className="mt-8">
                <h2 className="text-2xl font-semibold mb-3">Zones identifiées</h2>
                <ul className="space-y-2">
                    {zones.map((zone) => (
                        <li key={zone.id}>
                            <strong>{zone.nom}</strong> - {zone.type_protection}
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
```

**AND** : Carte initialisée avec bounds département :

```typescript
// Calcul bbox département depuis PostGIS
const bboxQuery = await db.query(
    `
  SELECT
    ST_XMin(ST_Extent(geometry)) as minLng,
    ST_YMin(ST_Extent(geometry)) as minLat,
        ST_XMax(ST_Extent(geometry)) as maxLng,
        ST_YMax(ST_Extent(geometry)) as maxLat
    FROM zones
  WHERE code_departement = $1
`,
    [dept.code],
);

map.fitBounds(
    [
        [bboxQuery.rows[0].minLng, bboxQuery.rows[0].minLat],
        [bboxQuery.rows[0].maxLng, bboxQuery.rows[0].maxLat],
    ],
    {padding: 50},
);
```

**Accessibility Integration**

- Structure HTML sémantique (`<h1>` unique par page)
- Liste zones avec `<ul>` sémantique
- Carte avec `aria-label="Carte des zones sans chasse dans le {dept.nom}"`
- Breadcrumb navigation :
    ```tsx
    <nav aria-label="Breadcrumb">
        <ol>
            <li>
                <a href="/">Accueil</a>
            </li>
            <li>
                <a href="/departements">Départements</a>
            </li>
            <li aria-current="page">{dept.nom}</li>
        </ol>
    </nav>
    ```

**Performance & Technical Acceptance**

- Pages statiques générées build-time (0 requête runtime)
- Lighthouse SEO score = 100
- Time to First Byte < 200ms (pages statiques)
- Génération tous départements couverts < 30s build time

---
