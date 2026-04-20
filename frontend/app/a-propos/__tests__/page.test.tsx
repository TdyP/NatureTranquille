import {render, screen} from '@testing-library/react';
import AProposPage from '../page';

describe('AProposPage', () => {
    describe('Page structure', () => {
        it('renders the main heading', () => {
            render(<AProposPage />);

            expect(screen.getByRole('heading', {level: 1, name: 'À propos de NatureTranquille'})).toBeInTheDocument();
        });

        it('renders all sections with correct headings', () => {
            render(<AProposPage />);

            expect(screen.getByRole('heading', {level: 2, name: 'Notre mission'})).toBeInTheDocument();
            expect(screen.getByRole('heading', {level: 2, name: 'Contexte du projet'})).toBeInTheDocument();
            expect(screen.getByRole('heading', {level: 2, name: 'Porteur du projet'})).toBeInTheDocument();
            expect(screen.getByRole('heading', {level: 2, name: 'Contact'})).toBeInTheDocument();
            expect(screen.getByRole('heading', {level: 2, name: 'Mentions légales'})).toBeInTheDocument();
        });

        it('has a main landmark', () => {
            render(<AProposPage />);

            expect(screen.getByRole('main')).toBeInTheDocument();
        });
    });

    describe('Mission section', () => {
        it('mentions réserves de chasse', () => {
            render(<AProposPage />);

            const main = screen.getByRole('main');
            expect(main.textContent).toMatch(/réserves de chasse/);
        });

        it('mentions the open source nature of the project', () => {
            render(<AProposPage />);

            const main = screen.getByRole('main');
            expect(main.textContent).toMatch(/open source/);
        });
    });

    describe('Contact section', () => {
        it('renders email mailto link', () => {
            render(<AProposPage />);

            const emailLink = screen.getByRole('link', {name: 'contact@naturetranquille.fr'});
            expect(emailLink).toHaveAttribute('href', 'mailto:contact@naturetranquille.fr');
        });

        it('renders feedback page link', () => {
            render(<AProposPage />);

            const feedbackLink = screen.getByRole('link', {name: 'Page Feedback'});
            expect(feedbackLink).toHaveAttribute('href', '/feedback');
        });

        it('renders GitHub issues link with security attributes', () => {
            render(<AProposPage />);

            const githubLink = screen.getByRole('link', {name: 'Ouvrir un ticket'});
            expect(githubLink).toHaveAttribute('target', '_blank');
            expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
        });
    });

    describe('GitHub link', () => {
        it('renders GitHub repository link with security attributes', () => {
            render(<AProposPage />);

            const githubLink = screen.getByRole('link', {name: 'GitHub NatureTranquille'});
            expect(githubLink).toHaveAttribute('href', 'https://github.com/TdyP/naturetranquille');
            expect(githubLink).toHaveAttribute('target', '_blank');
            expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
        });
    });

    describe('Legal notices', () => {
        it('mentions no personal data collection without consent', () => {
            render(<AProposPage />);

            expect(screen.getByText(/ne collecte aucune donnée personnelle sans consentement/)).toBeInTheDocument();
        });

        it('mentions only technical cookies', () => {
            render(<AProposPage />);

            expect(screen.getByText(/cookies techniques/)).toBeInTheDocument();
            expect(screen.getByText(/Pas de cookies publicitaires/)).toBeInTheDocument();
        });

        it('links to sources page', () => {
            render(<AProposPage />);

            const sourcesLink = screen.getByRole('link', {name: 'page Sources'});
            expect(sourcesLink).toHaveAttribute('href', '/sources');
        });

        it('mentions MIT licence', () => {
            render(<AProposPage />);

            const main = screen.getByRole('main');
            expect(main.textContent).toMatch(/MIT/);
        });
    });

    describe('Accessibility', () => {
        it('all external links have rel="noopener noreferrer"', () => {
            render(<AProposPage />);

            const externalLinks = screen.getAllByRole('link');
            externalLinks
                .filter((link) => link.getAttribute('target') === '_blank')
                .forEach((link) => {
                    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
                });
        });

        it('has properly nested heading hierarchy', () => {
            render(<AProposPage />);

            const h1 = screen.getAllByRole('heading', {level: 1});
            const h2 = screen.getAllByRole('heading', {level: 2});

            expect(h1).toHaveLength(1);
            expect(h2.length).toBeGreaterThanOrEqual(5);
        });

        it('link text is descriptive (no "cliquez ici")', () => {
            render(<AProposPage />);

            const links = screen.getAllByRole('link');
            links.forEach((link) => {
                expect(link.textContent?.toLowerCase()).not.toBe('cliquez ici');
                expect(link.textContent?.toLowerCase()).not.toBe('ici');
            });
        });
    });
});
