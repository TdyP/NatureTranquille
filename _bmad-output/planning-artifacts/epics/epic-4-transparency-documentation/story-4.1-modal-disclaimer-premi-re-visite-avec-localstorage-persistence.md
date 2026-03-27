### Story 4.1: Modal disclaimer première visite avec localStorage persistence


**User Story**
En tant que **Tom (première visite)**, je veux voir immédiatement un message clair m'expliquant que la carte montre seulement les zones connues et que l'absence de zone ne signifie pas autorisation de chasse, afin de ne pas avoir de faux sentiment de sécurité.

**Acceptance Criteria**

**GIVEN** : L'utilisateur visite le site pour la première fois
**WHEN** : La page `http://localhost:3000` charge
**THEN** :

- Un modal/dialog s'affiche automatiquement avec le message suivant :

```
⚠️ Important : Données partielles

Cette carte affiche uniquement les zones sans chasse que nous avons pu identifier et valider.

❌ L'absence d'une zone VERTE ne signifie PAS que la chasse y est autorisée.
✅ La présence d'une zone VERTE indique une protection officielle confirmée.

Les données couvrent actuellement : [liste départements]

Avant toute activité, vérifiez toujours localement auprès des gestionnaires.

[Bouton "J'ai compris" primary]
[Checkbox "Ne plus afficher ce message"]
```

- Si checkbox cochée + bouton cliqué → `localStorage.setItem('disclaimer-accepted', 'true')`
- Si checkbox non cochée + bouton cliqué → modal ferme, mais réaffiche prochaine visite
- Modal non closable sans clic bouton (pas de `X` ni `Esc` ni clic overlay)

**AND** : Visites suivantes :

```javascript
useEffect(() => {
    const disclaimerAccepted = localStorage.getItem('disclaimer-accepted');
    if (!disclaimerAccepted) {
        setShowDisclaimer(true);
    }
}, []);
```

**AND** : Composant `/app/components/DisclaimerModal.tsx` :

```tsx
<AlertDialog open={showDisclaimer} onOpenChange={() => {}}>
    <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Important : Données partielles
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
                <p>Cette carte affiche uniquement les zones sans chasse que nous avons pu identifier et valider.</p>
                <ul className="space-y-1">
                    <li>❌ L'absence d'une zone verte ne signifie PAS que la chasse y est autorisée</li>
                    <li>✅ La présence d'une zone verte indique une protection officielle confirmée</li>
                </ul>
                <p className="text-sm">Avant toute activité, vérifiez toujours localement.</p>
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-3">
            <div className="flex items-center gap-2">
                <Checkbox id="no-show" checked={noShowAgain} onCheckedChange={setNoShowAgain} />
                <label htmlFor="no-show" className="text-sm">
                    Ne plus afficher ce message
                </label>
            </div>
            <AlertDialogAction onClick={handleAccept}>J'ai compris</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>
```

**Accessibility Integration**

- Modal avec `role="alertdialog"` (Radix AlertDialog)
- Focus automatique sur le bouton "J'ai compris" à l'ouverture
- Texte clair, langage simple, pas de jargon
- Checkbox avec `<label>` associé via `htmlFor`
- Lecteur écran annonce titre + description complète
- Pas de fermeture accidentelle (modal bloquant intentionnel)

**Performance & Technical Acceptance**

- Modal apparaît en < 500ms après chargement page
- localStorage check synchrone (pas de flash)
- Pas d'appel API (logique 100% client)

---

