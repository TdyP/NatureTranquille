### Story 5.2: Toast confirmation envoi et email SMTP backend


**User Story**
En tant que **Mireille**, après avoir envoyé mon signalement, je veux recevoir une confirmation visuelle immédiate, et éventuellement un email de confirmation, afin de savoir que ma contribution a bien été prise en compte.

**Acceptance Criteria**

**GIVEN** : L'utilisateur soumet le formulaire (Story 5.1)
**WHEN** : Le backend reçoit la requête POST `/api/feedback`
**THEN** :

- **Backend** (Next.js API Route `/app/api/feedback/route.ts`) :
    - Validation Zod côté serveur (defense in depth)
    - Insertion signalement dans PostgreSQL :
        ```sql
        CREATE TABLE signalements (
          id SERIAL PRIMARY KEY,
          type VARCHAR(50) NOT NULL,
          localisation VARCHAR(200) NOT NULL,
          description TEXT NOT NULL,
          email VARCHAR(255),
          ip_hash VARCHAR(64), -- hash IP pour rate limiting
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        ```
    - Hash IP utilisateur (SHA-256) pour rate limiting (pas de stockage IP brute RGPD)
    - Envoi email SMTP à l'équipe :

        ```typescript
        import nodemailer from 'nodemailer';

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 587,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: 'no-reply@naturetranquille.fr',
            to: 'contact@naturetranquille.fr',
            subject: `[NatureTranquille] Nouveau signalement: ${data.type}`,
            text: `
            Type: ${data.type}
            Localisation: ${data.localisation}
            Description: ${data.description}
            Email: ${data.email || 'Non renseigné'}
          `,
        });
        ```

    - Si email utilisateur fourni → envoi confirmation utilisateur :

        ```typescript
        await transporter.sendMail({
            from: 'no-reply@naturetranquille.fr',
            to: data.email,
            subject: 'Signalement reçu - NatureTranquille',
            text: `
            Bonjour,
        
            Nous avons bien reçu votre signalement concernant : ${data.localisation}
        
            Notre équipe l'analysera dans les prochains jours.
        
            Merci de contribuer à l'amélioration de NatureTranquille !
        
            L'équipe NatureTranquille
          `,
        });
        ```

- **Frontend** : Toast notification après réponse backend :

    ```tsx
    import {toast} from 'sonner'; // ou autre lib toast

    if (res.ok) {
        toast.success(
            'Signalement envoyé, merci ! Vous recevrez une confirmation par email si vous en avez fourni un.',
        );
        reset(); // React Hook Form reset
    } else {
        toast.error("Erreur lors de l'envoi, réessayez dans quelques instants.");
    }
    ```

**AND** : Configuration SMTP :

- Scalingo : Add-on SendGrid gratuit (100 emails/jour)
- OU Brevo (ex-Sendinblue) : 300 emails/jour gratuit
- Variables `.env` :
    ```
    SMTP_HOST=smtp-relay.sendinblue.com
    SMTP_USER=your-email@naturetranquille.fr
    SMTP_PASS=your-smtp-key
    ```

**Accessibility Integration**

- Toast avec `role="status"` et `aria-live="polite"` (annoncé par lecteurs écran)
- Toast auto-dismiss après 5s (pas de blocage navigation)
- Toast visible visuellement (contraste ≥ 4.5:1)
- Bouton fermeture toast optionnel (clic ou `Esc`)

**Performance & Technical Acceptance**

- Envoi email SMTP < 500ms (Scalingo/Brevo rapides)
- Rate limiting IP : 1 signalement / minute / IP (évite spam)
- Hash IP avec bcrypt ou SHA-256 (pas de stockage IP claire)

---

