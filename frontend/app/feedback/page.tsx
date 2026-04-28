'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {toast} from 'sonner';
import {feedbackSchema, type FeedbackFormData} from '@/lib/validations/feedback';

export default function FeedbackPage() {
    const [honeypot, setHoneypot] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: {errors, isSubmitting},
    } = useForm<FeedbackFormData>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: {
            type: 'erreur',
            localisation: '',
            description: '',
            email: '',
        },
    });

    const descriptionValue = watch('description') ?? '';

    const onSubmit = async (data: FeedbackFormData) => {
        const payload = {...data, website: honeypot};
        const res = await fetch('/api/feedback', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            toast.success('Signalement envoyé, merci ! Vous recevrez une confirmation par email si vous en avez fourni un.');
            reset();
            setHoneypot('');
        } else if (res.status === 429) {
            toast.error('Trop de signalements récents, attendez 1 minute avant de réessayer.');
        } else {
            toast.error("Erreur lors de l'envoi, réessayez dans quelques instants.");
        }
    };

    return (
        <main className="container mx-auto h-full overflow-y-auto px-4 py-8 max-w-2xl" id="main-content">
            <h1 className="text-3xl font-bold mb-2">Signaler une erreur ou suggérer une amélioration</h1>
            <p className="text-muted-foreground mb-8">
                Aidez-nous à améliorer la qualité des données en signalant toute erreur ou en proposant vos idées.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                {/* Honeypot — hidden from humans, filled by bots */}
                <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="absolute -left-[9999px]"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                />

                <div>
                    <label htmlFor="type" className="block text-sm font-medium mb-2">
                        Type de signalement <span aria-hidden="true">*</span>
                    </label>
                    <select
                        id="type"
                        {...register('type')}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        aria-describedby={errors.type ? 'type-error' : undefined}
                        aria-invalid={!!errors.type}
                    >
                        <option value="erreur">Erreur sur une zone</option>
                        <option value="suggestion">Suggestion d&apos;amélioration</option>
                        <option value="nouvelle-donnee">Nouvelle donnée à ajouter</option>
                        <option value="autre">Autre</option>
                    </select>
                    {errors.type && (
                        <p id="type-error" className="text-sm text-destructive mt-1" role="alert">
                            {errors.type.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="localisation" className="block text-sm font-medium mb-2">
                        Localisation <span aria-hidden="true">*</span>
                    </label>
                    <input
                        id="localisation"
                        type="text"
                        {...register('localisation')}
                        placeholder="ex : Réserve de la Petite Camargue Alsacienne"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        aria-describedby={errors.localisation ? 'localisation-error' : undefined}
                        aria-invalid={!!errors.localisation}
                    />
                    {errors.localisation && (
                        <p id="localisation-error" className="text-sm text-destructive mt-1" role="alert">
                            {errors.localisation.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-2">
                        Description <span aria-hidden="true">*</span>
                        <span className="text-muted-foreground font-normal ml-2">
                            ({descriptionValue.length}/500 caractères)
                        </span>
                    </label>
                    <textarea
                        id="description"
                        {...register('description')}
                        rows={5}
                        maxLength={500}
                        placeholder="Décrivez le problème rencontré ou votre suggestion..."
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                        aria-describedby={errors.description ? 'description-error' : undefined}
                        aria-invalid={!!errors.description}
                    />
                    {errors.description && (
                        <p id="description-error" className="text-sm text-destructive mt-1" role="alert">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email{' '}
                        <span className="text-muted-foreground font-normal">(optionnel, pour recevoir une réponse)</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="votre@email.fr"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        aria-invalid={!!errors.email}
                        autoComplete="email"
                    />
                    {errors.email && (
                        <p id="email-error" className="text-sm text-destructive mt-1" role="alert">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer le signalement'}
                </button>
            </form>
        </main>
    );
}
