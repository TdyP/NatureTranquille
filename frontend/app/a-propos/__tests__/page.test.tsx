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
            expect(screen.getByRole('heading', {level: 2, name: 'Qui sommes-nous ?'})).toBeInTheDocument();
            expect(screen.getByRole('heading', {level: 2, name: 'Contribuer au projet'})).toBeInTheDocument();
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

            const emailLink = screen.getByRole('link', {name: 'hello@teddypaul.fr'});
            expect(emailLink).toHaveAttribute('href', 'mailto:hello+nt@teddypaul.fr');
        });

        it('renders LinkedIn link with security attributes', () => {
            render(<AProposPage />);

            const linkedinLink = screen.getByRole('link', {name: 'Teddy Paul'});
            expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/teddypaul');
            expect(linkedinLink).toHaveAttribute('target', '_blank');
            expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
        });
    });

    describe('GitHub link', () => {
        it('renders GitHub repository link with security attributes', () => {
            render(<AProposPage />);

            const githubLink = screen.getByRole('link', {name: 'GitHub NatureTranquille'});
            expect(githubLink).toHaveAttribute('href', 'https://github.com/TdyP/NatureTranquille');
            expect(githubLink).toHaveAttribute('target', '_blank');
            expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
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
            expect(h2.length).toBeGreaterThanOrEqual(4);
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
