'use client';

import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {Menu, X} from 'lucide-react';
import {Button} from './ui/button';
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from './ui/sheet';

const navigationItems = [
    {label: 'Accueil', href: '/'},
    {label: 'Sources', href: '/sources'},
    {label: 'À propos', href: '/a-propos'},
    {label: 'Feedback', href: '/feedback'},
];

/**
 * Main header with navigation
 * Responsive: hamburger menu on mobile, inline navigation on desktop
 */
export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 lg:px-6">
                {/* Logo and title */}
                <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
                    <Image src="/logo.svg" alt="Logo NatureTranquille" width={28} height={28} priority />
                    <span className="font-brand text-[1.1rem] font-bold leading-none tracking-[0.015em] sm:text-[1.15rem] lg:text-[1.2rem]">
                        NatureTranquille
                    </span>
                </Link>

                {/* Desktop navigation */}
                <nav className="hidden md:block" aria-label="Navigation principale">
                    <ul className="flex gap-6">
                        {navigationItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Mobile menu */}
                <div className="md:hidden">
                    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-11 w-11"
                                aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                                aria-expanded={isMenuOpen}
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                                <SheetDescription>Navigation du site</SheetDescription>
                            </SheetHeader>
                            <nav className="mt-6" aria-label="Navigation mobile">
                                <ul className="space-y-4">
                                    {navigationItems.map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="block rounded-md px-3 py-2 text-base font-medium text-foreground transition-colors hover:bg-accent"
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Skip link for accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:ring-2 focus:ring-ring"
            >
                Aller au contenu principal
            </a>
        </header>
    );
}
