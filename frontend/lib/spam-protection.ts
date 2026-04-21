import {createHash} from 'crypto';

export function hashIp(ip: string): string {
    return createHash('sha256').update(ip).digest('hex');
}

export function getClientIp(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0]?.trim() ?? 'unknown';
    }
    return request.headers.get('x-real-ip') ?? 'unknown';
}

export function isHoneypotFilled(website: string | undefined): boolean {
    return typeof website === 'string' && website.length > 0;
}
