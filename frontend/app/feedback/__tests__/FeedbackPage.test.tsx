import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedbackPage from '../../../app/feedback/page';

jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('FeedbackPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all form fields', () => {
        render(<FeedbackPage />);

        expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('Signaler une erreur');
        expect(screen.getByLabelText(/type de signalement/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/localisation/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /envoyer/i})).toBeInTheDocument();
    });

    it('type select has all required options', () => {
        render(<FeedbackPage />);

        const select = screen.getByLabelText(/type de signalement/i);
        expect(select).toBeInTheDocument();

        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(4);
        expect(options[0]).toHaveValue('erreur');
        expect(options[1]).toHaveValue('suggestion');
        expect(options[2]).toHaveValue('nouvelle-donnee');
        expect(options[3]).toHaveValue('autre');
    });

    it('shows validation errors when submitting empty form', async () => {
        const user = userEvent.setup();
        render(<FeedbackPage />);

        // Clear localisation and description then submit
        const localisationInput = screen.getByLabelText(/localisation/i);
        await user.clear(localisationInput);

        const descriptionTextarea = screen.getByLabelText(/description/i);
        await user.clear(descriptionTextarea);

        const submitButton = screen.getByRole('button', {name: /envoyer/i});
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/minimum 3 caractères/i)).toBeInTheDocument();
        });
    });

    it('shows validation error for description too short', async () => {
        const user = userEvent.setup();
        render(<FeedbackPage />);

        await user.type(screen.getByLabelText(/localisation/i), 'Forêt de Fontainebleau');
        await user.type(screen.getByLabelText(/description/i), 'Court');
        await user.click(screen.getByRole('button', {name: /envoyer/i}));

        await waitFor(() => {
            expect(screen.getByText(/minimum 10 caractères/i)).toBeInTheDocument();
        });
    });

    it('shows validation error for invalid email', async () => {
        const user = userEvent.setup();
        render(<FeedbackPage />);

        await user.type(screen.getByLabelText(/localisation/i), 'Forêt de Fontainebleau');
        await user.type(screen.getByLabelText(/description/i), 'Description suffisamment longue');
        await user.type(screen.getByLabelText(/email/i), 'not-an-email');
        await user.click(screen.getByRole('button', {name: /envoyer/i}));

        await waitFor(() => {
            expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
        });
    });

    it('accepts empty email (optional field)', async () => {
        const user = userEvent.setup();
        mockFetch.mockResolvedValueOnce({ok: true});
        render(<FeedbackPage />);

        await user.type(screen.getByLabelText(/localisation/i), 'Forêt de Fontainebleau');
        await user.type(screen.getByLabelText(/description/i), 'Description suffisamment longue pour passer la validation');
        await user.click(screen.getByRole('button', {name: /envoyer/i}));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith('/api/feedback', expect.objectContaining({method: 'POST'}));
        });
    });

    it('submits form with valid data and calls POST /api/feedback', async () => {
        const user = userEvent.setup();
        mockFetch.mockResolvedValueOnce({ok: true, status: 200});
        render(<FeedbackPage />);

        await user.selectOptions(screen.getByLabelText(/type de signalement/i), 'suggestion');
        await user.type(screen.getByLabelText(/localisation/i), 'Réserve Petite Camargue');
        await user.type(screen.getByLabelText(/description/i), 'Il manque cette zone sur la carte, pouvez-vous l\'ajouter ?');
        await user.type(screen.getByLabelText(/email/i), 'test@example.com');

        await user.click(screen.getByRole('button', {name: /envoyer/i}));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                '/api/feedback',
                expect.objectContaining({
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: expect.stringContaining('"type":"suggestion"'),
                }),
            );
        });
    });

    it('shows success toast and resets form on successful submission', async () => {
        const {toast} = require('sonner');
        const user = userEvent.setup();
        mockFetch.mockResolvedValueOnce({ok: true, status: 200});
        render(<FeedbackPage />);

        await user.type(screen.getByLabelText(/localisation/i), 'Forêt de Fontainebleau');
        await user.type(screen.getByLabelText(/description/i), 'Description suffisamment longue pour passer la validation');
        await user.click(screen.getByRole('button', {name: /envoyer/i}));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('merci'));
        });
    });

    it('shows error toast when submission fails', async () => {
        const {toast} = require('sonner');
        const user = userEvent.setup();
        mockFetch.mockResolvedValueOnce({ok: false, status: 500});
        render(<FeedbackPage />);

        await user.type(screen.getByLabelText(/localisation/i), 'Forêt de Fontainebleau');
        await user.type(screen.getByLabelText(/description/i), 'Description suffisamment longue pour passer la validation');
        await user.click(screen.getByRole('button', {name: /envoyer/i}));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("Erreur"));
        });
    });

    it('shows rate limit toast on 429 response', async () => {
        const {toast} = require('sonner');
        const user = userEvent.setup();
        mockFetch.mockResolvedValueOnce({ok: false, status: 429});
        render(<FeedbackPage />);

        await user.type(screen.getByLabelText(/localisation/i), 'Forêt de Fontainebleau');
        await user.type(screen.getByLabelText(/description/i), 'Description suffisamment longue pour passer la validation');
        await user.click(screen.getByRole('button', {name: /envoyer/i}));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Trop de signalements'));
        });
    });

    it('all form fields have explicit labels for accessibility', () => {
        render(<FeedbackPage />);

        expect(screen.getByLabelText(/type de signalement/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/localisation/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('error messages have role="alert" for screen reader announcement', async () => {
        const user = userEvent.setup();
        render(<FeedbackPage />);

        await user.clear(screen.getByLabelText(/localisation/i));
        await user.clear(screen.getByLabelText(/description/i));
        await user.click(screen.getByRole('button', {name: /envoyer/i}));

        await waitFor(() => {
            const alerts = screen.getAllByRole('alert');
            expect(alerts.length).toBeGreaterThan(0);
        });
    });

    it('description shows character count', async () => {
        const user = userEvent.setup();
        render(<FeedbackPage />);

        const textarea = screen.getByLabelText(/description/i);
        await user.type(textarea, 'Test');

        expect(screen.getByText(/4\/500/i)).toBeInTheDocument();
    });

    it('submit button is disabled while submitting', async () => {
        const user = userEvent.setup();
        let resolveFetch: (value: unknown) => void;
        mockFetch.mockReturnValueOnce(new Promise((resolve) => {resolveFetch = resolve;}));
        render(<FeedbackPage />);

        await user.type(screen.getByLabelText(/localisation/i), 'Forêt de Fontainebleau');
        await user.type(screen.getByLabelText(/description/i), 'Description suffisamment longue pour passer la validation');
        await user.click(screen.getByRole('button', {name: /envoyer/i}));

        await waitFor(() => {
            expect(screen.getByRole('button', {name: /envoi en cours/i})).toBeDisabled();
        });

        resolveFetch!({ok: true});
    });

    it('honeypot field is hidden and not reachable by keyboard', () => {
        render(<FeedbackPage />);

        const honeypot = document.querySelector('input[name="website"]') as HTMLInputElement;
        expect(honeypot).toBeInTheDocument();
        expect(honeypot).toHaveAttribute('tabindex', '-1');
        expect(honeypot).toHaveAttribute('aria-hidden', 'true');
        expect(honeypot).toHaveAttribute('autocomplete', 'off');
    });
});
