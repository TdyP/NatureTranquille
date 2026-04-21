import {createHash} from 'crypto';
import {NextRequest, NextResponse} from 'next/server';
import nodemailer from 'nodemailer';
import {feedbackSchema} from '@/lib/validations/feedback';
import {db} from '@/lib/db/client';
import {signalements} from '@/lib/db/schema';
import {and, gt, count} from 'drizzle-orm';
import {sql} from 'drizzle-orm';

function hashIp(ip: string): string {
    return createHash('sha256').update(ip).digest('hex');
}

function getClientIp(request: NextRequest): string {
    return (
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'unknown'
    );
}

function createMailTransporter() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;

    if (!host || !user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        host,
        port: parseInt(process.env.SMTP_PORT ?? '587', 10),
        secure: false,
        auth: {user, pass},
    });
}

async function sendTeamEmail(
    transporter: nodemailer.Transporter,
    data: {type: string; localisation: string; description: string; email?: string},
): Promise<void> {
    const from = process.env.SMTP_FROM ?? 'no-reply@naturetranquille.fr';
    await transporter.sendMail({
        from,
        to: 'contact@naturetranquille.fr',
        subject: `[NatureTranquille] Nouveau signalement : ${data.type}`,
        text: `Type : ${data.type}\nLocalisation : ${data.localisation}\nDescription : ${data.description}\nEmail : ${data.email || 'Non renseigné'}`,
    });
}

async function sendUserConfirmationEmail(
    transporter: nodemailer.Transporter,
    to: string,
    localisation: string,
): Promise<void> {
    const from = process.env.SMTP_FROM ?? 'no-reply@naturetranquille.fr';
    await transporter.sendMail({
        from,
        to,
        subject: 'Signalement reçu – NatureTranquille',
        text: `Bonjour,\n\nNous avons bien reçu votre signalement concernant : ${localisation}\n\nNotre équipe l'analysera dans les prochains jours.\n\nMerci de contribuer à l'amélioration de NatureTranquille !\n\nL'équipe NatureTranquille`,
    });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({error: 'Invalid JSON'}, {status: 400});
    }

    const parsed = feedbackSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({error: 'Validation error', details: parsed.error.flatten()}, {status: 422});
    }

    const data = parsed.data;

    // Honeypot check — bots fill this hidden field
    if (data.website) {
        return NextResponse.json({error: 'Spam detected'}, {status: 400});
    }

    const ip = getClientIp(request);
    const ipHash = hashIp(ip);

    // Rate limiting: 1 request per minute per IP
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentCount = await db
        .select({count: count()})
        .from(signalements)
        .where(
            and(
                sql`${signalements.ipHash} = ${ipHash}`,
                gt(signalements.createdAt, oneMinuteAgo),
            ),
        );

    if ((recentCount[0]?.count ?? 0) > 0) {
        return NextResponse.json({error: 'Too many requests'}, {status: 429});
    }

    // Insert into DB
    await db.insert(signalements).values({
        type: data.type,
        localisation: data.localisation,
        description: data.description,
        email: data.email || null,
        ipHash,
    });

    // Send emails (best-effort — don't fail the request if SMTP is not configured)
    const transporter = createMailTransporter();
    if (transporter) {
        const emailPromises: Promise<void>[] = [sendTeamEmail(transporter, data)];
        if (data.email) {
            emailPromises.push(sendUserConfirmationEmail(transporter, data.email, data.localisation));
        }
        await Promise.allSettled(emailPromises);
    }

    return NextResponse.json({success: true});
}
