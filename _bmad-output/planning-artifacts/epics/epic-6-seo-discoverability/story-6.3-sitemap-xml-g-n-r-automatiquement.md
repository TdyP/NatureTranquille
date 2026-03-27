### Story 6.3: Sitemap XML généré automatiquement

**User Story**
En tant que **Google Bot**, je veux découvrir automatiquement toutes les pages du site via un sitemap XML, afin d'indexer efficacement le contenu.

**Acceptance Criteria**

**GIVEN** : L'application Next.js est buildée
**WHEN** : Le sitemap est généré
**THEN** :

- Fichier `/sitemap.xml` accessible à la racine
- Contenu sitemap liste toutes routes statiques :
    - `/` (homepage)
    - `/sources`
    - `/a-propos`
    - `/feedback`
    - `/departements/bas-rhin-67`
    - `/departements/haut-rhin-68`
    - etc.

**AND** : Génération sitemap Next.js App Router :

```tsx
// app/sitemap.ts
import {MetadataRoute} from 'next';
import {db} from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://naturetranquille.fr';

    // Pages statiques
    const staticPages = ['', '/sources', '/a-propos', '/feedback'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // Pages départements (générées dynamiquement)
    const departements = await db.query(`
    SELECT DISTINCT
      LOWER(REGEXP_REPLACE(nom_departement, '[^a-zA-Z0-9]', '-', 'g')) AS slug,
      code_departement,
      MAX(date_maj) as last_updated
    FROM zones
    GROUP BY nom_departement, code_departement
  `);

    const deptPages = departements.rows.map((d) => ({
        url: `${baseUrl}/departements/${d.slug}-${d.code_departement}`,
        lastModified: new Date(d.last_updated),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    return [...staticPages, ...deptPages];
}
```

**AND** : Fichier `robots.txt` :

```txt
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://naturetranquille.fr/sitemap.xml
```

**AND** : Soumission Google Search Console :

- Phase 2 : création compte GSC
- Soumission sitemap manuellement
- Monitoring indexation (couverture, erreurs)

**Accessibility Integration**

- N/A (fichier XML technique)

**Performance & Technical Acceptance**

- Génération sitemap < 5s (même avec 100+ départements)
- Sitemap < 50KB (limite Google : 50MB, donc large marge)
- Format XML valide (validation W3C)
- Google Search Console : 0 erreurs sitemap

---
