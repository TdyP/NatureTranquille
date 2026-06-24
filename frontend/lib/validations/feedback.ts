import {z} from 'zod';

export const feedbackSchema = z.object({
    type: z.enum(['erreur', 'suggestion', 'nouvelle-donnee', 'autre'], {
        error: 'Veuillez sélectionner un type de signalement',
    }),
    localisation: z.string().min(3, 'Minimum 3 caractères').max(200, 'Maximum 200 caractères'),
    description: z.string().min(10, 'Minimum 10 caractères').max(500, 'Maximum 500 caractères'),
    email: z.string().email('Email invalide').optional().or(z.literal('')),
    website: z.string().optional(),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;
