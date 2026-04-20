import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DisclaimerModal from '../DisclaimerModal';

describe('DisclaimerModal', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('First visit', () => {
        it('shows the modal on first visit when localStorage is empty', () => {
            render(<DisclaimerModal />);

            expect(screen.getByRole('alertdialog')).toBeInTheDocument();
            expect(screen.getByText('Important : Données partielles')).toBeInTheDocument();
        });

        it('displays the partial data warning message', () => {
            render(<DisclaimerModal />);

            expect(
                screen.getByText(/Cette carte affiche uniquement les réserves de chasse/),
            ).toBeInTheDocument();
            expect(
                screen.getByText(/L'absence d'une zone verte ne signifie PAS que la chasse y est autorisée/),
            ).toBeInTheDocument();
            expect(
                screen.getByText(/La présence d'une zone verte indique une protection officielle confirmée/),
            ).toBeInTheDocument();
        });

        it('displays the disclaimer last sentence', () => {
            render(<DisclaimerModal />);

            expect(
                screen.getByText(/En cas de doute, vérifiez localement auprès des autorités ou des habitants/),
            ).toBeInTheDocument();
        });

        it('renders the "J\'ai compris" button', () => {
            render(<DisclaimerModal />);

            expect(screen.getByRole('button', {name: "J'ai compris"})).toBeInTheDocument();
        });

        it('renders the "Ne plus afficher ce message" checkbox', () => {
            render(<DisclaimerModal />);

            expect(screen.getByRole('checkbox', {name: 'Ne plus afficher ce message'})).toBeInTheDocument();
        });
    });

    describe('Closing without "ne plus afficher"', () => {
        it('closes the modal when "J\'ai compris" is clicked without checkbox', async () => {
            const user = userEvent.setup();
            render(<DisclaimerModal />);

            await user.click(screen.getByRole('button', {name: "J'ai compris"}));

            await waitFor(() => {
                expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
            });
        });

        it('does NOT persist to localStorage when checkbox is unchecked', async () => {
            const user = userEvent.setup();
            render(<DisclaimerModal />);

            await user.click(screen.getByRole('button', {name: "J'ai compris"}));

            expect(localStorage.getItem('disclaimer-accepted')).toBeNull();
        });
    });

    describe('Closing with "ne plus afficher"', () => {
        it('persists to localStorage when checkbox is checked then button clicked', async () => {
            const user = userEvent.setup();
            render(<DisclaimerModal />);

            await user.click(screen.getByRole('checkbox', {name: 'Ne plus afficher ce message'}));
            await user.click(screen.getByRole('button', {name: "J'ai compris"}));

            expect(localStorage.getItem('disclaimer-accepted')).toBe('true');
        });

        it('closes the modal after accepting with checkbox checked', async () => {
            const user = userEvent.setup();
            render(<DisclaimerModal />);

            await user.click(screen.getByRole('checkbox', {name: 'Ne plus afficher ce message'}));
            await user.click(screen.getByRole('button', {name: "J'ai compris"}));

            await waitFor(() => {
                expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
            });
        });
    });

    describe('Returning visit', () => {
        it('does not show modal when disclaimer-accepted is set in localStorage', () => {
            localStorage.setItem('disclaimer-accepted', 'true');
            render(<DisclaimerModal />);

            expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('has alertdialog role', () => {
            render(<DisclaimerModal />);

            expect(screen.getByRole('alertdialog')).toBeInTheDocument();
        });

        it('has an accessible title', () => {
            render(<DisclaimerModal />);

            expect(screen.getByText('Important : Données partielles')).toBeInTheDocument();
        });

        it('has a properly labeled checkbox', () => {
            render(<DisclaimerModal />);

            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toHaveAccessibleName('Ne plus afficher ce message');
        });
    });
});
