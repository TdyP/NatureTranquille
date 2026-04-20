import {render, screen, within} from '@testing-library/react';
import SourcesPage from '../page';

describe('SourcesPage', () => {
    describe('Page structure', () => {
        it('renders the main heading', () => {
            render(<SourcesPage />);

            expect(screen.getByRole('heading', {level: 1, name: 'Sources de données'})).toBeInTheDocument();
        });

        it('renders the three main sections', () => {
            render(<SourcesPage />);

            expect(screen.getByRole('heading', {level: 2, name: 'Données intégrées'})).toBeInTheDocument();
            expect(
                screen.getByRole('heading', {level: 2, name: 'Méthodologie de validation'}),
            ).toBeInTheDocument();
            expect(screen.getByRole('heading', {level: 2, name: 'Roadmap couverture'})).toBeInTheDocument();
        });
    });

    describe('Data sources', () => {
        it('renders all sources from sources.json', () => {
            render(<SourcesPage />);

            expect(screen.getByText('RNCFS Grand Est')).toBeInTheDocument();
            expect(screen.getByText('Réserves Naturelles de Savoie')).toBeInTheDocument();
        });

        it('displays source type for each entry', () => {
            render(<SourcesPage />);

            expect(
                screen.getByText('Réserve Nationale de Chasse et Faune Sauvage'),
            ).toBeInTheDocument();
            expect(screen.getByText('Réserves Naturelles Régionales et Nationales')).toBeInTheDocument();
        });

        it('displays geographic coverage', () => {
            render(<SourcesPage />);

            expect(screen.getByText('Bas-Rhin, Haut-Rhin, Moselle')).toBeInTheDocument();
            expect(screen.getByText('Savoie (73)')).toBeInTheDocument();
        });

        it('displays licence information', () => {
            render(<SourcesPage />);

            expect(screen.getByText('Licence Ouverte / Etalab 2.0')).toBeInTheDocument();
            expect(screen.getByText('Données publiques')).toBeInTheDocument();
        });

        it('displays last update dates', () => {
            render(<SourcesPage />);

            expect(screen.getByText('2026-01-15')).toBeInTheDocument();
            expect(screen.getByText('2026-02-01')).toBeInTheDocument();
        });

        it('renders external links with correct href', () => {
            render(<SourcesPage />);

            const ofbLink = screen.getByRole('link', {name: /ofb\.gouv\.fr/});
            expect(ofbLink).toHaveAttribute('href', 'https://www.ofb.gouv.fr/le-reseau-des-reserves');
            expect(ofbLink).toHaveAttribute('target', '_blank');
            expect(ofbLink).toHaveAttribute('rel', 'noopener noreferrer');
        });

        it('all external links have rel="noopener noreferrer" for security', () => {
            render(<SourcesPage />);

            const externalLinks = screen.getAllByRole('link');
            externalLinks
                .filter((link) => link.getAttribute('target') === '_blank')
                .forEach((link) => {
                    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
                });
        });
    });

    describe('Methodology section', () => {
        it('displays the validation steps', () => {
            render(<SourcesPage />);

            expect(
                screen.getByText(/Vérification source officielle/),
            ).toBeInTheDocument();
            expect(screen.getByText(/Validation géométrie/)).toBeInTheDocument();
        });

        it('mentions exclusion of partial zones', () => {
            render(<SourcesPage />);

            expect(screen.getByText(/exclues/)).toBeInTheDocument();
        });
    });

    describe('Roadmap section', () => {
        it('lists currently covered departments', () => {
            render(<SourcesPage />);

            expect(
                screen.getByText(/Bas-Rhin \(67\), Haut-Rhin \(68\), Moselle \(57\), Savoie \(73\)/),
            ).toBeInTheDocument();
        });

        it('mentions upcoming departments', () => {
            render(<SourcesPage />);

            expect(screen.getByText(/Haute-Savoie \(74\), Isère \(38\)/)).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('has a main landmark', () => {
            render(<SourcesPage />);

            expect(screen.getByRole('main')).toBeInTheDocument();
        });

        it('uses definition lists for source metadata', () => {
            const {container} = render(<SourcesPage />);

            const dls = container.querySelectorAll('dl');
            expect(dls.length).toBeGreaterThan(0);
        });

        it('has properly nested heading hierarchy', () => {
            render(<SourcesPage />);

            const h1 = screen.getAllByRole('heading', {level: 1});
            const h2 = screen.getAllByRole('heading', {level: 2});

            expect(h1).toHaveLength(1);
            expect(h2.length).toBeGreaterThanOrEqual(3);
        });
    });
});
