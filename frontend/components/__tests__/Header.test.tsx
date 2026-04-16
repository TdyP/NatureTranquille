import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../Header';

describe('Header Component', () => {
    it('renders logo and title', () => {
        render(<Header />);

        expect(screen.getByText('🌲')).toBeInTheDocument();
        // On desktop, full title is visible
        expect(screen.getByText('NatureTranquille')).toBeInTheDocument();
    });

    it('renders desktop navigation with all items', () => {
        render(<Header />);

        const desktopNav = screen.getByRole('navigation', {name: 'Navigation principale'});
        expect(desktopNav).toBeInTheDocument();

        // Check all navigation links
        expect(screen.getByRole('link', {name: 'Accueil'})).toBeInTheDocument();
        expect(screen.getByRole('link', {name: 'Sources'})).toBeInTheDocument();
        expect(screen.getByRole('link', {name: 'À propos'})).toBeInTheDocument();
        expect(screen.getByRole('link', {name: 'Feedback'})).toBeInTheDocument();
    });

    it('has skip link for accessibility', () => {
        render(<Header />);

        const skipLink = screen.getByText('Aller au contenu principal');
        expect(skipLink).toBeInTheDocument();
        expect(skipLink).toHaveClass('sr-only');
        expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('renders hamburger menu button on mobile', () => {
        render(<Header />);

        const menuButton = screen.getByLabelText('Ouvrir le menu');
        expect(menuButton).toBeInTheDocument();
        expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('hamburger button has correct size (44x44px minimum)', () => {
        render(<Header />);

        const menuButton = screen.getByLabelText('Ouvrir le menu');
        // h-11 w-11 = 44px x 44px (WCAG touch target)
        expect(menuButton).toHaveClass('h-11', 'w-11');
    });

    it('mobile menu opens when hamburger is clicked', async () => {
        const user = userEvent.setup();
        render(<Header />);

        const menuButton = screen.getByLabelText('Ouvrir le menu');
        await user.click(menuButton);

        // Check mobile navigation appears
        const mobileNav = screen.getByRole('navigation', {name: 'Navigation mobile'});
        expect(mobileNav).toBeInTheDocument();
    });

    it('navigation links have correct hrefs', () => {
        render(<Header />);

        const accueilLink = screen.getAllByRole('link', {name: 'Accueil'})[0];
        const sourcesLink = screen.getAllByRole('link', {name: 'Sources'})[0];
        const aboutLink = screen.getAllByRole('link', {name: 'À propos'})[0];
        const feedbackLink = screen.getAllByRole('link', {name: 'Feedback'})[0];

        expect(accueilLink).toHaveAttribute('href', '/');
        expect(sourcesLink).toHaveAttribute('href', '/sources');
        expect(aboutLink).toHaveAttribute('href', '/about');
        expect(feedbackLink).toHaveAttribute('href', '/feedback');
    });
});
