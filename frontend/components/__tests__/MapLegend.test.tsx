import {render, screen} from '@testing-library/react';
import MapLegend from '../MapLegend';

describe('MapLegend Component', () => {
    it('renders legend with accessibility attributes', () => {
        render(<MapLegend />);

        const legend = screen.getByRole('complementary');
        expect(legend).toBeInTheDocument();
        expect(legend).toHaveAttribute('aria-label', 'Légende de la carte');
    });

    it('displays legend title', () => {
        render(<MapLegend />);

        expect(screen.getByText('Légende')).toBeInTheDocument();
    });

    it('displays zone sans chasse entry', () => {
        render(<MapLegend />);

        expect(screen.getByText('Zone sans chasse identifiée')).toBeInTheDocument();
    });

    it('displays no data entry with explanation', () => {
        render(<MapLegend />);

        expect(screen.getByText(/Pas de donnée/)).toBeInTheDocument();
        expect(screen.getByText(/absence ≠ autorisation chasse/)).toBeInTheDocument();
    });

    it('has proper visual indicators', () => {
        const {container} = render(<MapLegend />);

        // Check for colored squares (legend items)
        const legendItems = container.querySelectorAll('ul li');
        expect(legendItems).toHaveLength(2);
    });
});
