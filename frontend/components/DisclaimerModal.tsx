'use client';

import {useState, useEffect} from 'react';
import {AlertTriangle} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {Checkbox} from '@/components/ui/checkbox';

const DISCLAIMER_STORAGE_KEY = 'disclaimer-accepted';

export default function DisclaimerModal() {
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [noShowAgain, setNoShowAgain] = useState(false);

    useEffect(() => {
        const disclaimerAccepted = localStorage.getItem(DISCLAIMER_STORAGE_KEY);
        if (!disclaimerAccepted) {
            setShowDisclaimer(true);
        }
    }, []);

    const handleAccept = () => {
        if (noShowAgain) {
            localStorage.setItem(DISCLAIMER_STORAGE_KEY, 'true');
        }
        setShowDisclaimer(false);
    };

    return (
        <AlertDialog open={showDisclaimer} onOpenChange={() => {}}>
            <AlertDialogContent
                className="max-w-md"
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                        Important : Données partielles
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-3">
                            <p>
                                Cette carte affiche uniquement les réserves de chasse que nous avons pu identifier et
                                valider.
                            </p>
                            <ul className="space-y-1">
                                <li>
                                    ❌ L&apos;absence d&apos;une zone verte ne signifie PAS que la chasse y est
                                    autorisée
                                </li>
                                <li>✅ La présence d&apos;une zone verte indique une protection officielle confirmée</li>
                            </ul>
                            <p className="text-sm">
                                En cas de doute, vérifiez localement auprès des autorités ou des habitants.
                            </p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="no-show"
                            checked={noShowAgain}
                            onCheckedChange={(checked) => setNoShowAgain(checked === true)}
                        />
                        <label htmlFor="no-show" className="text-sm cursor-pointer">
                            Ne plus afficher ce message
                        </label>
                    </div>
                    <AlertDialogAction onClick={handleAccept}>
                        J&apos;ai compris
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
