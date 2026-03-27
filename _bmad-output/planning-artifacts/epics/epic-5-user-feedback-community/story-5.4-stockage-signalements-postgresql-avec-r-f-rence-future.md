### Story 5.4: Stockage signalements PostgreSQL avec référence future


**User Story**
En tant que **développeur**, je veux stocker tous les signalements utilisateurs dans PostgreSQL avec structure permettant traitement futur, afin de construire une roadmap data-driven des corrections à apporter.

**Acceptance Criteria**

**GIVEN** : Le backend reçoit un signalement validé (Stories 5.1-5.3)
**WHEN** : L'insertion BDD est exécutée
**THEN** :

- Table `signalements` structure complète :

    ```sql
    CREATE TABLE signalements (
      id SERIAL PRIMARY KEY,
      type VARCHAR(50) NOT NULL CHECK (type IN ('erreur', 'suggestion', 'nouvelle-donnee', 'autre')),
      localisation VARCHAR(200) NOT NULL,
      description TEXT NOT NULL,
      email VARCHAR(255),
      ip_hash VARCHAR(64) NOT NULL,
      status VARCHAR(20) DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'en-cours', 'resolu', 'rejete')),
      notes_internes TEXT,
      zone_id INT REFERENCES zones_sans_chasse(id), -- si signalement lié à une zone existante
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX idx_signalements_status ON signalements(status);
    CREATE INDEX idx_signalements_created_at ON signalements(created_at DESC);
    CREATE INDEX idx_signalements_ip_hash ON signalements(ip_hash, created_at);
    ```

**AND** : API Route insertion :

```typescript
// app/api/feedback/route.ts
import {db} from '@/lib/db';

export async function POST(request: Request) {
    const body = await request.json();

    // Validation Zod...
    // Honeypot check...
    // Rate limiting...

    const ipHash = createHash('sha256')
        .update(request.headers.get('x-forwarded-for') || 'unknown')
        .digest('hex');

    await db.query(
        `INSERT INTO signalements (type, localisation, description, email, ip_hash)
     VALUES ($1, $2, $3, $4, $5)`,
        [body.type, body.localisation, body.description, body.email || null, ipHash],
    );

    // Email SMTP...

    return NextResponse.json({success: true});
}
```

**AND** : Interface admin basique Phase 2 :

- Route `/admin/signalements` (protégée authentification)
- Liste signalements avec filtres (status, type, date)
- Possibilité changer status, ajouter notes internes
- Lien vers zone carte si `zone_id` renseigné

**Accessibility Integration**

- N/A (structure BDD backend)

**Performance & Technical Acceptance**

- Insertion < 50ms
- Index sur `status` permet filtrage rapide signalements nouveaux
- Index composite `(ip_hash, created_at)` optimise rate limiting query
- Espace disque : ~500 bytes / signalement → 10 000 signalements = ~5MB

**Technical Notes**

- Migration Drizzle ORM :

    ```typescript
    import {pgTable, serial, varchar, text, timestamp} from 'drizzle-orm/pg-core';

    export const signalements = pgTable('signalements', {
        id: serial('id').primaryKey(),
        type: varchar('type', {length: 50}).notNull(),
        localisation: varchar('localisation', {length: 200}).notNull(),
        description: text('description').notNull(),
        email: varchar('email', {length: 255}),
        ipHash: varchar('ip_hash', {length: 64}).notNull(),
        status: varchar('status', {length: 20}).default('nouveau'),
        createdAt: timestamp('created_at').defaultNow(),
    });
    ```

---

---

