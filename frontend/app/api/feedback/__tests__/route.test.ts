/**
 * @jest-environment node
 */

import {POST} from '../route';
import {NextRequest} from 'next/server';

jest.mock('@/lib/db/client', () => ({
    db: {
        select: jest.fn(),
        insert: jest.fn(),
    },
}));

jest.mock('@/lib/db/schema', () => ({
    signalements: {},
}));

jest.mock('drizzle-orm', () => ({
    and: jest.fn((...args: unknown[]) => args),
    gt: jest.fn((col: unknown, val: unknown) => ({col, val})),
    sql: Object.assign(jest.fn((strings: TemplateStringsArray, ...values: unknown[]) => ({strings, values})), {
        raw: jest.fn(),
    }),
    count: jest.fn(() => 'count'),
}));

jest.mock('nodemailer', () => {
    const sendMail = jest.fn().mockResolvedValue({messageId: 'test-id'});
    return {
        createTransport: jest.fn(() => ({sendMail})),
        __sendMail: sendMail,
    };
});

const mockDb = jest.requireMock('@/lib/db/client').db;

function buildRequest(body: unknown, headers: Record<string, string> = {}): NextRequest {
    return new NextRequest('http://localhost/api/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': '1.2.3.4',
            ...headers,
        },
        body: JSON.stringify(body),
    });
}

function setupDbMocks(recentCount = 0) {
    const insertValues = jest.fn().mockResolvedValue([]);
    const selectFromWhere = {where: jest.fn().mockResolvedValue([{count: recentCount}])};
    const selectFrom = {from: jest.fn().mockReturnValue(selectFromWhere)};
    mockDb.select.mockReturnValue(selectFrom);
    mockDb.insert.mockReturnValue({values: insertValues});
    return {insertValues, selectFrom, selectFromWhere};
}

const validPayload = {
    type: 'erreur',
    localisation: 'Forêt de Fontainebleau',
    description: 'Cette zone semble incorrecte sur la carte, veuillez vérifier',
    email: '',
    website: '',
};

describe('POST /api/feedback', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.SMTP_HOST = '';
        process.env.SMTP_USER = '';
        process.env.SMTP_PASSWORD = '';
    });

    it('returns 422 for invalid payload (missing required fields)', async () => {
        setupDbMocks();
        const req = buildRequest({type: 'erreur'});
        const res = await POST(req);
        expect(res.status).toBe(422);
    });

    it('returns 400 for invalid JSON', async () => {
        const req = new NextRequest('http://localhost/api/feedback', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'x-forwarded-for': '1.2.3.4'},
            body: 'not-json',
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
    });

    it('returns 400 when honeypot field is filled (bot detected)', async () => {
        setupDbMocks();
        const req = buildRequest({...validPayload, website: 'http://spam.com'});
        const res = await POST(req);
        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.error).toBe('Spam detected');
    });

    it('returns 429 when rate limit exceeded (same IP, within 1 minute)', async () => {
        setupDbMocks(1);
        const req = buildRequest(validPayload);
        const res = await POST(req);
        expect(res.status).toBe(429);
    });

    it('returns 200 and inserts into DB for valid payload', async () => {
        const {insertValues} = setupDbMocks(0);
        const req = buildRequest(validPayload);
        const res = await POST(req);
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.success).toBe(true);
        expect(insertValues).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'erreur',
                localisation: 'Forêt de Fontainebleau',
                description: 'Cette zone semble incorrecte sur la carte, veuillez vérifier',
                email: null,
                ipHash: expect.any(String),
            }),
        );
    });

    it('hashes IP before storing (no raw IP stored)', async () => {
        const {insertValues} = setupDbMocks(0);
        const req = buildRequest(validPayload, {'x-forwarded-for': '192.168.1.1'});
        await POST(req);
        const callArg = insertValues.mock.calls[0][0];
        expect(callArg.ipHash).not.toBe('192.168.1.1');
        expect(callArg.ipHash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('accepts valid email and stores it', async () => {
        const {insertValues} = setupDbMocks(0);
        const req = buildRequest({...validPayload, email: 'user@example.com'});
        const res = await POST(req);
        expect(res.status).toBe(200);
        expect(insertValues).toHaveBeenCalledWith(
            expect.objectContaining({email: 'user@example.com'}),
        );
    });

    it('sends team notification email when SMTP is configured', async () => {
        const nodemailer = require('nodemailer');
        const sendMail = nodemailer.__sendMail;
        nodemailer.createTransport.mockClear();
        sendMail.mockClear();
        setupDbMocks(0);
        process.env.SMTP_HOST = 'smtp.example.com';
        process.env.SMTP_USER = 'user';
        process.env.SMTP_PASSWORD = 'pass';

        const req = buildRequest({...validPayload, email: 'user@example.com'});
        await POST(req);

        expect(sendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                to: 'contact@naturetranquille.fr',
                subject: expect.stringContaining('[NatureTranquille]'),
            }),
        );
    });

    it('sends user confirmation email when email provided and SMTP configured', async () => {
        const nodemailer = require('nodemailer');
        const sendMail = nodemailer.__sendMail;
        nodemailer.createTransport.mockClear();
        sendMail.mockClear();
        setupDbMocks(0);
        process.env.SMTP_HOST = 'smtp.example.com';
        process.env.SMTP_USER = 'user';
        process.env.SMTP_PASSWORD = 'pass';

        const req = buildRequest({...validPayload, email: 'user@example.com'});
        await POST(req);

        expect(sendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                to: 'user@example.com',
                subject: expect.stringContaining('Signalement reçu'),
            }),
        );
    });

    it('does not send email when SMTP is not configured', async () => {
        const nodemailer = require('nodemailer');
        nodemailer.createTransport.mockClear();
        setupDbMocks(0);
        const req = buildRequest({...validPayload, email: 'user@example.com'});
        await POST(req);
        expect(nodemailer.createTransport).not.toHaveBeenCalled();
    });

    it('returns 200 even when SMTP fails (best-effort emails)', async () => {
        const nodemailer = require('nodemailer');
        const sendMail = nodemailer.__sendMail;
        sendMail.mockRejectedValueOnce(new Error('SMTP error'));
        setupDbMocks(0);
        process.env.SMTP_HOST = 'smtp.example.com';
        process.env.SMTP_USER = 'user';
        process.env.SMTP_PASSWORD = 'pass';

        const req = buildRequest({...validPayload, email: 'user@example.com'});
        const res = await POST(req);
        expect(res.status).toBe(200);
    });

    it('validates all feedback types', async () => {
        const types = ['erreur', 'suggestion', 'nouvelle-donnee', 'autre'];
        for (const type of types) {
            setupDbMocks(0);
            const req = buildRequest({...validPayload, type});
            const res = await POST(req);
            expect(res.status).toBe(200);
        }
    });

    it('returns 422 for unknown feedback type', async () => {
        setupDbMocks(0);
        const req = buildRequest({...validPayload, type: 'spam'});
        const res = await POST(req);
        expect(res.status).toBe(422);
    });
});
