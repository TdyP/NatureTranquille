import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../Header';

describe('Header Component', () => {
    it('renders a home link with brand logo', () => {
        render(<Header />);

        const homeLink = screen.getByRole('link', {name: /naturetranquille/i});
        expect(homeLink).toHaveAttribute('href', '/');
        expect(within(homeLink).getByRole('img')).toBeInTheDocument();
    });

    it('renders desktop navigation with expected destinations', () => {
        render(<Header />);

        const desktopNav = screen.getByRole('navigation', {name: 'Navigation principale'});
        expect(desktopNav).toBeInTheDocument();

        const navLinks = within(desktopNav).getAllByRole('link');
        const navHrefs = navLinks.map((link) => link.getAttribute('href'));

        expect(navHrefs).toEqual(expect.arrayContaining(['/', '/a-propos', '/feedback']));
    });

    it('has skip link for accessibility', () => {
        render(<Header />);

        const skipLink = screen.getByRole('link', {name: /contenu principal/i});
        expect(skipLink).toBeInTheDocument();
        expect(skipLink).toHaveClass('sr-only');
        expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('renders hamburger menu button with collapsed state by default', () => {
        render(<Header />);

        const menuButton = screen.getByRole('button', {name: /menu/i});
        expect(menuButton).toBeInTheDocument();
        expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('mobile menu opens when hamburger is clicked', async () => {
        const user = userEvent.setup();
        render(<Header />);

        const menuButton = screen.getByRole('button', {name: /menu/i});
        await user.click(menuButton);

        const mobileNav = screen.getByRole('navigation', {name: 'Navigation mobile'});
        expect(mobileNav).toBeInTheDocument();
        expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('exposes main navigation links with stable hrefs', () => {
        render(<Header />);

        const desktopNav = screen.getByRole('navigation', {name: 'Navigation principale'});
        const links = within(desktopNav).getAllByRole('link');
        const hrefs = links.map((link) => link.getAttribute('href'));

        expect(hrefs).toEqual(expect.arrayContaining(['/', '/a-propos', '/feedback']));
    });
});
