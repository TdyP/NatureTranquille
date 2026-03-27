### Story 5.3: Protection spam avec honeypot ou hCaptcha accessible


**User Story**
En tant que **développeur**, je veux protéger le formulaire feedback contre les robots spammeurs avec une solution accessible, afin de garantir que les signalements reçus sont légitimes sans frustrer les utilisateurs réels.

**Acceptance Criteria**

**GIVEN** : Le formulaire feedback existe (Story 5.1)
**WHEN** : Un bot ou un humain soumet le formulaire
**THEN** :

**Option 1: Honeypot (recommandé pour accessibilité)** :

- Champ caché CSS ajouté au formulaire :
    ```tsx
    <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute -left-9999px"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
    />
    ```
- Backend vérifie : si champ `website` rempli → requête rejetée (bot détecté)
    ```typescript
    if (body.website) {
        return NextResponse.json({error: 'Spam detected'}, {status: 400});
    }
    ```
- Humains ne voient jamais ce champ (caché visuellement et pour lecteurs écran)
- Bots le remplissent automatiquement → détection

**Option 2: hCaptcha (si honeypot insuffisant)** :

- hCaptcha accessible (alternative accessible à reCAPTCHA)
- Intégration composant :

    ```tsx
    import HCaptcha from '@hcaptcha/react-hcaptcha';

    <HCaptcha sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY} onVerify={(token) => setCaptchaToken(token)} />;
    ```

- Backend vérifie token avec API hCaptcha avant insertion BDD
- Mode accessibility automatique (détection lecteur écran)

**AND** : Rate limiting IP côté serveur (complément honeypot) :

```typescript
const ipHash = createHash('sha256').update(request.ip).digest('hex');
const recentSubmissions = await db.query(
    "SELECT COUNT(*) FROM signalements WHERE ip_hash = $1 AND created_at > NOW() - INTERVAL '1 minute'",
    [ipHash],
);

if (recentSubmissions.rows[0].count > 0) {
    return NextResponse.json({error: 'Too many requests'}, {status: 429});
}
```

**Accessibility Integration**

- Honeypot : 100% transparent utilisateurs, lecteurs écran ignorent (`aria-hidden`, `tabindex="-1"`)
- hCaptcha : mode accessible automatique, compatible lecteurs écran, pas de puzzle visuel si détection assistive tech
- Rate limiting : message erreur clair "Trop de signalements récents, attendez 1 minute"

**Performance & Technical Acceptance**

- Honeypot : 0ms overhead (pur CSS/HTML)
- hCaptcha : < 200ms validation token backend
- Rate limiting : requête SQL < 10ms (index sur `ip_hash` + `created_at`)

**Technical Notes**

- Honeypot Phase 1 (simple, efficace contre 95% bots)
- hCaptcha Phase 2 si spam persiste
- JAMAIS Google reCAPTCHA (accessibilité problématique)

---

