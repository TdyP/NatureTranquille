### Story 3.2: Affichage responsive sidebar desktop vs bottom sheet mobile


**User Story**
En tant que **développeur**, je veux implémenter un affichage adaptatif des détails zone avec sidebar sur desktop et bottom sheet sur mobile, afin d'optimiser l'UX selon le device.

**Acceptance Criteria**

**GIVEN** : L'utilisateur clique sur une zone (Story 3.1)
**WHEN** : Le détail s'affiche selon la taille écran
**THEN** :

**Desktop (≥ 1024px)** :

```tsx
<Sheet open={isOpen} onOpenChange={setIsOpen}>
    <SheetContent side="left" className="w-[400px]">
        <SheetHeader>
            <SheetTitle>{zone.nom}</SheetTitle>
            <SheetClose asChild>
                <Button variant="ghost" size="icon" aria-label="Fermer">
                    <X className="h-4 w-4" />
                </Button>
            </SheetClose>
        </SheetHeader>
        <div className="mt-4">{/* Détails zone */}</div>
    </SheetContent>
</Sheet>
```

- Sidebar push carte vers droite (carte resize, pas overlay complet)
- Animation slide-in depuis gauche 300ms
- Scroll interne sidebar si contenu long

**Mobile (< 1024px)** :

```tsx
<Sheet open={isOpen} onOpenChange={setIsOpen}>
    <SheetContent side="bottom" className="h-[40vh] data-[state=open]:h-[80vh]">
        <div className="mx-auto w-12 h-1.5 bg-muted rounded-full mb-4" /> {/* Handle swipe */}
        <SheetHeader>
            <SheetTitle>{zone.nom}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 overflow-y-auto">{/* Détails zone */}</div>
    </SheetContent>
</Sheet>
```

- Bottom sheet slide-up depuis bas
- Hauteur initiale 40vh, drag handle pour expand 80vh
- Swipe down pour fermer
- Overlay semi-transparent sur carte

**AND** : Détection device avec Tailwind breakpoints :

```tsx
const isMobile = useMediaQuery('(max-width: 1023px)');
<Sheet open={isOpen}>
    <SheetContent side={isMobile ? 'bottom' : 'left'}>...</SheetContent>
</Sheet>;
```

**Accessibility Integration**

- Même focus trap et keyboard nav pour les deux layouts
- Drag handle mobile avec `aria-label="Glisser pour ajuster la hauteur"`
- Swipe gestures ne désactivent pas alternatives clavier/bouton
- `prefers-reduced-motion` désactive animations slide

**Performance & Technical Acceptance**

- Animation 60 FPS desktop, 30 FPS mobile minimum
- Resize carte desktop instantané (< 100ms)
- Pas de reflow complet page (layout contained)

---

