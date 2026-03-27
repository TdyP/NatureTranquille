### Story 5.1: Formulaire signalement erreurs avec validation Zod


**User Story**
En tant que **Mireille**, je veux signaler qu'une zone affichée comme sans chasse a en réalité une barrière verrouillée, afin que l'équipe puisse investiguer et corriger l'information si nécessaire.

**Acceptance Criteria**

**GIVEN** : L'utilisateur accède à la page `/feedback`
**WHEN** : L'utilisateur remplit le formulaire
**THEN** :

- Formulaire avec champs suivants :
    - **Type de signalement** (select) : Erreur zone, Suggestion amélioration, Nouvelle donnée, Autre
    - **Localisation** (text) : Nom zone ou adresse approximative
    - **Description** (textarea, max 500 chars) : Détails du signalement
    - **Email** (text, optionnel) : Pour réponse éventuelle

- Validation côté client avec Zod :

```typescript
import {z} from 'zod';

const feedbackSchema = z.object({
    type: z.enum(['erreur', 'suggestion', 'nouvelle-donnee', 'autre']),
    localisation: z.string().min(3, 'Minimum 3 caractères').max(200),
    description: z.string().min(10, 'Minimum 10 caractères').max(500),
    email: z.string().email('Email invalide').optional().or(z.literal('')),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;
```

- Si validation échoue → messages erreur sous champs concernés
- Si validation réussit → bouton "Envoyer" actif → soumission POST `/api/feedback`

**AND** : Page `/app/feedback/page.tsx` :

```tsx
'use client';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {feedbackSchema} from '@/lib/validations/feedback';

export default function FeedbackPage() {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(feedbackSchema),
    });

    const onSubmit = async (data: FeedbackForm) => {
        const res = await fetch('/api/feedback', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });

        if (res.ok) {
            toast.success('Signalement envoyé, merci !');
            reset();
        } else {
            toast.error("Erreur lors de l'envoi, réessayez");
        }
    };

    return (
        <main className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Signaler une erreur ou suggérer une amélioration</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="type" className="block text-sm font-medium mb-2">
                        Type de signalement
                    </label>
                    <select id="type" {...register('type')} className="w-full">
                        <option value="erreur">Erreur sur une zone</option>
                        <option value="suggestion">Suggestion d'amélioration</option>
                        <option value="nouvelle-donnee">Nouvelle donnée à ajouter</option>
                        <option value="autre">Autre</option>
                    </select>
                    {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
                </div>

                <div>
                    <label htmlFor="localisation" className="block text-sm font-medium mb-2">
                        Localisation
                    </label>
                    <input
                        id="localisation"
                        type="text"
                        {...register('localisation')}
                        placeholder="ex: Réserve de la Petite Camargue Alsacienne"
                        className="w-full"
                    />
                    {errors.localisation && (
                        <p className="text-sm text-destructive mt-1">{errors.localisation.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-2">
                        Description (max 500 caractères)
                    </label>
                    <textarea
                        id="description"
                        {...register('description')}
                        rows={5}
                        className="w-full"
                        placeholder="Décrivez le problème rencontré ou votre suggestion..."
                    ></textarea>
                    {errors.description && (
                        <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email (optionnel, pour réponse)
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="votre@email.fr"
                        className="w-full"
                    />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                </div>

                <button type="submit" className="btn btn-primary">
                    Envoyer le signalement
                </button>
            </form>
        </main>
    );
}
```

**Accessibility Integration**

- Tous champs avec `<label>` explicite associé via `htmlFor`
- Messages erreur avec `role="alert"` et annoncés par lecteurs écran
- Focus visible sur tous inputs (outline 2px, contraste ≥ 3:1)
- Ordre tabulation logique (type → localisation → description → email → bouton)
- Bouton submit désactivé pendant envoi (loading state) :
    ```tsx
    <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
    </button>
    ```

**Performance & Technical Acceptance**

- Validation Zod instantanée (< 10ms)
- Pas de requête backend tant que validation échoue
- Formulaire React Hook Form optimisé (pas de re-render inutiles)

---

