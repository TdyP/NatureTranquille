'use client';

import {useState, useEffect} from 'react';
import Image from 'next/image';
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
                className="flex max-h-[85vh] max-w-2xl flex-col overflow-y-auto px-8 py-6 sm:px-10 sm:py-8"
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <AlertDialogHeader className="space-y-4">
                    <AlertDialogTitle className="flex items-center justify-center gap-3 text-center text-black">
                        <Image src="/logo.svg" alt="Logo NatureTranquille" width={28} height={28} />
                        Bienvenue sur NatureTranquille
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-5 py-2 text-center leading-relaxed text-black sm:py-3">
                            <p>
                                NatureTranquille recense les zones ou la chasse est interdite, comme certaines
                                reserves de chasse, reserves naturelles et autres espaces proteges.
                            </p>
                            <p className="font-semibold text-foreground">
                                La carte affiche uniquement les zones que nous avons pu identifier et valider a
                                partir de sources publiques.
                            </p>
                            <p className="text-sm">
                                Si une zone n&apos;apparait pas, cela ne signifie pas forcement que la chasse y est
                                autorisee. En cas de doute, verifiez l&apos;information localement.
                            </p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4 flex-col gap-3 pt-2">
                    <div className="flex items-center justify-center gap-2">
                        <Checkbox
                            id="no-show"
                            checked={noShowAgain}
                            onCheckedChange={(checked) => setNoShowAgain(checked === true)}
                        />
                        <label htmlFor="no-show" className="cursor-pointer text-sm text-black">
                            Ne plus afficher ce message
                        </label>
                    </div>
                    <AlertDialogAction onClick={handleAccept}>Decouvrir la carte</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
