/**
 * Map Legend component displaying zone types
 */
export default function MapLegend() {
    return (
        <div
            className="absolute bottom-4 left-4 z-10 rounded-lg border bg-card p-4 shadow-lg"
            role="complementary"
            aria-label="Légende de la carte"
        >
            <h3 className="mb-2 text-sm font-semibold">Légende</h3>
            <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-sm border-2 border-zone-stroke bg-zone-fill opacity-60" />
                    <span>Réserve de chasse</span>
                </li>
                <li className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-sm border-2 border-border bg-background" />
                    <span className="text-muted-foreground">Pas de donnée (absence ≠ autorisation chasse)</span>
                </li>
            </ul>
        </div>
    );
}
