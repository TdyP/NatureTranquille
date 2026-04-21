/**
 * @jest-environment node
 */

import {hashIp, getClientIp, isHoneypotFilled} from '../spam-protection';

describe('spam-protection utilities', () => {
    describe('hashIp', () => {
        it('returns a 64-char hex SHA-256 hash', () => {
            const hash = hashIp('1.2.3.4');
            expect(hash).toMatch(/^[a-f0-9]{64}$/);
        });

        it('returns different hashes for different IPs', () => {
            expect(hashIp('1.2.3.4')).not.toBe(hashIp('5.6.7.8'));
        });

        it('returns the same hash for the same IP (deterministic)', () => {
            expect(hashIp('1.2.3.4')).toBe(hashIp('1.2.3.4'));
        });

        it('does not return the raw IP', () => {
            const ip = '192.168.1.100';
            expect(hashIp(ip)).not.toBe(ip);
            expect(hashIp(ip)).not.toContain(ip);
        });

        it('handles "unknown" fallback IP', () => {
            const hash = hashIp('unknown');
            expect(hash).toMatch(/^[a-f0-9]{64}$/);
        });
    });

    describe('getClientIp', () => {
        it('extracts first IP from x-forwarded-for header', () => {
            const req = new Request('http://localhost', {
                headers: {'x-forwarded-for': '1.2.3.4, 5.6.7.8'},
            });
            expect(getClientIp(req)).toBe('1.2.3.4');
        });

        it('uses single IP from x-forwarded-for', () => {
            const req = new Request('http://localhost', {
                headers: {'x-forwarded-for': '1.2.3.4'},
            });
            expect(getClientIp(req)).toBe('1.2.3.4');
        });

        it('falls back to x-real-ip when no x-forwarded-for', () => {
            const req = new Request('http://localhost', {
                headers: {'x-real-ip': '9.8.7.6'},
            });
            expect(getClientIp(req)).toBe('9.8.7.6');
        });

        it('returns "unknown" when no IP header is present', () => {
            const req = new Request('http://localhost');
            expect(getClientIp(req)).toBe('unknown');
        });
    });

    describe('isHoneypotFilled', () => {
        it('returns false for empty string (human user)', () => {
            expect(isHoneypotFilled('')).toBe(false);
        });

        it('returns false for undefined (field not sent)', () => {
            expect(isHoneypotFilled(undefined)).toBe(false);
        });

        it('returns true when honeypot has any value (bot detected)', () => {
            expect(isHoneypotFilled('http://spam.com')).toBe(true);
        });

        it('returns true for any non-empty string', () => {
            expect(isHoneypotFilled('a')).toBe(true);
            expect(isHoneypotFilled(' ')).toBe(true);
        });
    });
});
