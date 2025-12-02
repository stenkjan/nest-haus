/**
 * Form Validation Unit Tests
 * Tests validation logic with permissive regex patterns and edge cases
 */

import { describe, it, expect } from 'vitest';
import {
    validateEmail,
    validatePhone,
    validateAddress,
    validateName,
    validateMessage,
    sanitizeInput,
    containsSQLInjection,
    validateContactForm,
    emailRegex,
    phoneRegex,
    addressRegex,
    nameRegex,
} from '@/lib/validation';
import {
    TEST_EMAILS,
    TEST_PHONES,
    TEST_ADDRESSES,
    TEST_NAMES,
} from '../utils/test-helpers';

describe('Form Validation Tests', () => {
    describe('Email Validation', () => {
        it('should accept valid email formats', () => {
            TEST_EMAILS.VALID.forEach(email => {
                expect(validateEmail(email)).toBe(true);
                expect(emailRegex.test(email)).toBe(true);
            });
        });

        it('should reject invalid email formats', () => {
            TEST_EMAILS.INVALID.forEach(email => {
                expect(validateEmail(email)).toBe(false);
                expect(emailRegex.test(email)).toBe(false);
            });
        });

        it('should accept email with plus sign (for aliases)', () => {
            expect(validateEmail('user+tag@domain.com')).toBe(true);
        });

        it('should accept email with multiple subdomains', () => {
            expect(validateEmail('user@mail.sub.domain.com')).toBe(true);
        });

        it('should reject email with spaces', () => {
            expect(validateEmail('user @domain.com')).toBe(false);
            expect(validateEmail('user@domain .com')).toBe(false);
        });

        it('should handle empty or null input gracefully', () => {
            expect(validateEmail('')).toBe(false);
            expect(validateEmail(null as unknown as string)).toBe(false);
            expect(validateEmail(undefined as unknown as string)).toBe(false);
        });
    });

    describe('Phone Validation', () => {
        it('should accept Austrian phone formats', () => {
            TEST_PHONES.AUSTRIAN.forEach(phone => {
                expect(validatePhone(phone)).toBe(true);
                expect(phoneRegex.test(phone)).toBe(true);
            });
        });

        it('should accept international phone formats', () => {
            TEST_PHONES.INTERNATIONAL.forEach(phone => {
                expect(validatePhone(phone)).toBe(true);
                expect(phoneRegex.test(phone)).toBe(true);
            });
        });

        it('should reject invalid phone formats', () => {
            TEST_PHONES.INVALID.forEach(phone => {
                expect(validatePhone(phone)).toBe(false);
            });
        });

        it('should accept phone with country code', () => {
            expect(validatePhone('+43 664 1234567')).toBe(true);
            expect(validatePhone('+1 555 123 4567')).toBe(true);
        });

        it('should accept phone with parentheses', () => {
            expect(validatePhone('(123) 456-7890')).toBe(true);
        });

        it('should reject too short phone numbers', () => {
            expect(validatePhone('12345')).toBe(false);
        });

        it('should handle empty input gracefully', () => {
            expect(validatePhone('')).toBe(false);
            expect(validatePhone(null as unknown as string)).toBe(false);
        });
    });

    describe('Address Validation', () => {
        it('should accept valid address formats', () => {
            TEST_ADDRESSES.VALID.forEach(address => {
                expect(validateAddress(address)).toBe(true);
                expect(addressRegex.test(address)).toBe(true);
            });
        });

        it('should reject invalid addresses', () => {
            TEST_ADDRESSES.INVALID.forEach(address => {
                expect(validateAddress(address)).toBe(false);
            });
        });

        it('should accept address with German umlauts', () => {
            expect(validateAddress('Bahnhofstraße 45')).toBe(true);
            expect(validateAddress('Müller Straße 12')).toBe(true);
        });

        it('should accept address with commas and periods', () => {
            expect(validateAddress('123 Main St., Suite 100')).toBe(true);
            expect(validateAddress('Zösenberg 51, 8044 Weinitzen')).toBe(true);
        });

        it('should reject too short addresses', () => {
            expect(validateAddress('ab')).toBe(false);
        });

        it('should handle empty input gracefully', () => {
            expect(validateAddress('')).toBe(false);
            expect(validateAddress(null as unknown as string)).toBe(false);
        });
    });

    describe('Name Validation', () => {
        it('should accept valid name formats', () => {
            TEST_NAMES.VALID.forEach(name => {
                expect(validateName(name)).toBe(true);
                expect(nameRegex.test(name)).toBe(true);
            });
        });

        it('should reject invalid names', () => {
            TEST_NAMES.INVALID.forEach(name => {
                expect(validateName(name)).toBe(false);
            });
        });

        it('should accept names with umlauts', () => {
            expect(validateName('Hans Müller')).toBe(true);
            expect(validateName('Jörg Österreicher')).toBe(true);
        });

        it('should accept names with hyphens', () => {
            expect(validateName('Jean-Claude')).toBe(true);
            expect(validateName('Mary-Ann')).toBe(true);
        });

        it('should accept names with apostrophes', () => {
            expect(validateName("O'Brien")).toBe(true);
            expect(validateName("D'Angelo")).toBe(true);
        });

        it('should accept names with accents', () => {
            expect(validateName('María José')).toBe(true);
            expect(validateName('François')).toBe(true);
        });

        it('should reject names that are too short', () => {
            expect(validateName('X')).toBe(false);
        });

        it('should reject names with numbers', () => {
            expect(validateName('John123')).toBe(false);
        });

        it('should handle empty input gracefully', () => {
            expect(validateName('')).toBe(false);
            expect(validateName(null as unknown as string)).toBe(false);
        });
    });

    describe('Message Validation', () => {
        it('should accept valid messages', () => {
            expect(validateMessage('This is a test message')).toBe(true);
            expect(validateMessage('Short')).toBe(true);
        });

        it('should reject messages exceeding max length', () => {
            const longMessage = 'a'.repeat(5001);
            expect(validateMessage(longMessage)).toBe(false);
        });

        it('should accept messages at max length', () => {
            const maxMessage = 'a'.repeat(5000);
            expect(validateMessage(maxMessage)).toBe(true);
        });

        it('should reject empty messages', () => {
            expect(validateMessage('')).toBe(false);
            expect(validateMessage('   ')).toBe(false);
        });

        it('should handle null input gracefully', () => {
            expect(validateMessage(null as unknown as string)).toBe(false);
        });
    });

    describe('XSS Prevention', () => {
        it('should sanitize HTML tags', () => {
            const input = '<script>alert("xss")</script>';
            const sanitized = sanitizeInput(input);
            expect(sanitized).not.toContain('<script>');
            expect(sanitized).not.toContain('</script>');
            expect(sanitized).toContain('&lt;script&gt;');
        });

        it('should sanitize HTML attributes', () => {
            const input = '<img src=x onerror="alert(1)">';
            const sanitized = sanitizeInput(input);
            expect(sanitized).not.toContain('<img');
            expect(sanitized).toContain('&lt;img');
        });

        it('should escape quotes', () => {
            const input = 'Test "quoted" text';
            const sanitized = sanitizeInput(input);
            expect(sanitized).toContain('&quot;');
        });

        it('should escape single quotes', () => {
            const input = "Test 'quoted' text";
            const sanitized = sanitizeInput(input);
            expect(sanitized).toContain('&#x27;');
        });

        it('should handle empty input', () => {
            expect(sanitizeInput('')).toBe('');
            expect(sanitizeInput(null as unknown as string)).toBe('');
        });

        it('should preserve safe text', () => {
            const input = 'This is safe text with numbers 123';
            const sanitized = sanitizeInput(input);
            expect(sanitized).toBe('This is safe text with numbers 123');
        });
    });

    describe('SQL Injection Detection', () => {
        it('should detect obvious SQL injection attempts', () => {
            expect(containsSQLInjection("' OR '1'='1")).toBe(true);
            expect(containsSQLInjection("1' OR 1=1--")).toBe(true);
            expect(containsSQLInjection('UNION SELECT * FROM users')).toBe(true);
            expect(containsSQLInjection('DROP TABLE users')).toBe(true);
            expect(containsSQLInjection('DELETE FROM users WHERE 1=1')).toBe(true);
            expect(containsSQLInjection('INSERT INTO users VALUES')).toBe(true);
        });

        it('should detect SQL comments', () => {
            expect(containsSQLInjection("'; --")).toBe(true);
            expect(containsSQLInjection('/* comment */')).toBe(true);
        });

        it('should not flag normal text', () => {
            expect(containsSQLInjection('This is a normal message')).toBe(false);
            expect(containsSQLInjection('My email is user@domain.com')).toBe(false);
            expect(containsSQLInjection('Contact me at +43 664 1234567')).toBe(false);
        });

        it('should handle empty input', () => {
            expect(containsSQLInjection('')).toBe(false);
            expect(containsSQLInjection(null as unknown as string)).toBe(false);
        });
    });

    describe('Complete Form Validation', () => {
        it('should validate complete form with valid data', () => {
            const formData = {
                email: 'test@example.com',
                name: 'Hans Müller',
                phone: '+43 664 1234567',
                message: 'I am interested in a NEST-Haus',
                address: 'Zösenberg 51',
            };

            const result = validateContactForm(formData);
            expect(result.isValid).toBe(true);
            expect(Object.keys(result.errors)).toHaveLength(0);
        });

        it('should reject form with missing required fields', () => {
            const formData = {
                email: '',
                name: '',
            };

            const result = validateContactForm(formData);
            expect(result.isValid).toBe(false);
            expect(result.errors.email).toBeDefined();
            expect(result.errors.name).toBeDefined();
        });

        it('should reject form with invalid email', () => {
            const formData = {
                email: 'invalid-email',
                name: 'John Doe',
            };

            const result = validateContactForm(formData);
            expect(result.isValid).toBe(false);
            expect(result.errors.email).toBeDefined();
        });

        it('should reject form with SQL injection attempt', () => {
            const formData = {
                email: "test@example.com'; DROP TABLE users--",
                name: 'John Doe',
            };

            const result = validateContactForm(formData);
            expect(result.isValid).toBe(false);
            expect(result.errors.email).toBeDefined();
        });

        it('should accept form without optional fields', () => {
            const formData = {
                email: 'test@example.com',
                name: 'John Doe',
            };

            const result = validateContactForm(formData);
            expect(result.isValid).toBe(true);
        });

        it('should validate optional phone field when provided', () => {
            const formData = {
                email: 'test@example.com',
                name: 'John Doe',
                phone: 'invalid',
            };

            const result = validateContactForm(formData);
            expect(result.isValid).toBe(false);
            expect(result.errors.phone).toBeDefined();
        });

        it('should accept international characters in name', () => {
            const formData = {
                email: 'test@example.com',
                name: 'José María Pérez',
            };

            const result = validateContactForm(formData);
            expect(result.isValid).toBe(true);
        });
    });

    describe('Edge Cases', () => {
        it('should handle whitespace trimming in email', () => {
            expect(validateEmail('  test@example.com  ')).toBe(true);
        });

        it('should handle whitespace trimming in name', () => {
            expect(validateName('  John Doe  ')).toBe(true);
        });

        it('should handle very long valid email', () => {
            const longEmail = 'a'.repeat(50) + '@' + 'b'.repeat(50) + '.com';
            expect(validateEmail(longEmail)).toBe(true);
        });

        it('should handle minimum length names', () => {
            expect(validateName('Li')).toBe(true); // Minimum 2 chars
            expect(validateName('L')).toBe(false);
        });

        it('should handle compound surnames', () => {
            expect(validateName('Maria del Carmen')).toBe(true);
            expect(validateName('van der Berg')).toBe(true);
        });

        it('should reject email without TLD', () => {
            expect(validateEmail('user@localhost')).toBe(false);
        });

        it('should accept numeric house numbers in address', () => {
            expect(validateAddress('123 Main Street')).toBe(true);
            expect(validateAddress('Apartment 5B')).toBe(true);
        });
    });
});

