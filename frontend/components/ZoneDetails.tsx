'use client';

import {Sheet, SheetContent, SheetHeader, SheetTitle} from '@/components/ui/sheet';

/**
 * Zone properties from MVT tiles
 */
export interface ZoneProperties {
    id: number;
    nom: string;
    typeProtection: string;
    gestionnaire: string | null;
    source: string;
    dateMaj: string;
}

export interface ZoneDetailsProps {
    /**
     * Zone data to display
     */
    zone: ZoneProperties | null;
    /**
     * Callback when sheet is closed
     */
    onClose: () => void;
}

/**
 * Format date string to French locale
 */
function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString);
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return dateString;
        }
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return dateString;
    }
}

/**
 * Display zone details in a responsive Sheet (sidebar on desktop, bottom sheet on mobile)
 */
export default function ZoneDetails({zone, onClose}: ZoneDetailsProps) {
    return (
        <Sheet open={zone !== null} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="left" className="w-full lg:w-[400px]">
                <SheetHeader>
                    <SheetTitle>{zone?.nom ?? ''}</SheetTitle>
                </SheetHeader>

                {zone && (
                    <div className="mt-6 space-y-4">
                        <dl className="space-y-3">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Type de protection</dt>
                                <dd className="mt-1 text-base">{zone.typeProtection}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Gestionnaire</dt>
                                <dd className="mt-1 text-base">{zone.gestionnaire || 'Non renseigné'}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Date de mise à jour</dt>
                                <dd className="mt-1 text-base">{formatDate(zone.dateMaj)}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Source</dt>
                                <dd className="mt-1 text-base">{zone.source}</dd>
                            </div>
                        </dl>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
