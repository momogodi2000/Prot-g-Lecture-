import { describe, it, expect, beforeEach } from 'vitest';
import {
  sanitizeHTML,
  sanitizeInput,
  escapeHTML,
  sanitizeURL,
  isValidEmail,
  isValidPhone,
  checkRateLimit,
  generateSecureToken,
  validateFileUpload,
  sanitizeSearchQuery,
  isSecureConnection,
  maskSensitiveData,
} from '../utils/security';

describe('Security Utilities', () => {
  describe('sanitizeHTML', () => {
    it('should remove script tags', () => {
      const dirty = '<p>Hello</p><script>alert("XSS")</script>';
      const clean = sanitizeHTML(dirty);
      expect(clean).not.toContain('<script>');
      expect(clean).toContain('<p>Hello</p>');
    });

    it('should allow safe tags', () => {
      const dirty = '<p>Hello <strong>World</strong></p>';
      const clean = sanitizeHTML(dirty);
      expect(clean).toBe('<p>Hello <strong>World</strong></p>');
    });

    it('should remove dangerous attributes', () => {
      const dirty = '<a href="javascript:alert(1)">Click</a>';
      const clean = sanitizeHTML(dirty);
      expect(clean).not.toContain('javascript:');
    });
  });

  describe('sanitizeInput', () => {
    it('should strip all HTML tags', () => {
      const input = '<p>Hello <b>World</b></p>';
      const output = sanitizeInput(input);
      expect(output).toBe('Hello World');
    });

    it('should handle empty input', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
    });
  });

  describe('escapeHTML', () => {
    it('should escape HTML special characters', () => {
      const input = '<div>"Hello" & \'World\'</div>';
      const output = escapeHTML(input);
      expect(output).toBe('&lt;div&gt;&quot;Hello&quot; &amp; &#x27;World&#x27;&lt;&#x2F;div&gt;');
    });
  });

  describe('sanitizeURL', () => {
    it('should allow valid HTTPS URLs', () => {
      const url = 'https://example.com/page';
      const result = sanitizeURL(url);
      expect(result).toBe(url);
    });

    it('should allow valid HTTP URLs', () => {
      const url = 'http://example.com/page';
      const result = sanitizeURL(url);
      expect(result).toBe(url);
    });

    it('should reject javascript: URLs', () => {
      const url = 'javascript:alert(1)';
      const result = sanitizeURL(url);
      expect(result).toBeNull();
    });

    it('should reject data: URLs', () => {
      const url = 'data:text/html,<script>alert(1)</script>';
      const result = sanitizeURL(url);
      expect(result).toBeNull();
    });

    it('should reject invalid URLs', () => {
      const url = 'not a url';
      const result = sanitizeURL(url);
      expect(result).toBeNull();
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate international phone numbers', () => {
      expect(isValidPhone('+237612345678')).toBe(true);
      expect(isValidPhone('+33123456789')).toBe(true);
    });

    it('should handle formatted phone numbers', () => {
      expect(isValidPhone('+1 (555) 123-4567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('invalid')).toBe(false);
    });
  });

  describe('generateSecureToken', () => {
    it('should generate tokens of specified length', () => {
      const token32 = generateSecureToken(32);
      const token64 = generateSecureToken(64);
      expect(token32.length).toBe(64); // 32 bytes = 64 hex chars
      expect(token64.length).toBe(128); // 64 bytes = 128 hex chars
    });

    it('should generate unique tokens', () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe('validateFileUpload', () => {
    it('should accept valid image files', () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateFileUpload(file);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject files that are too large', () => {
      const largeContent = new Array(6 * 1024 * 1024).join('a'); // 6MB
      const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
      const result = validateFileUpload(file);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('File size exceeds 5MB');
    });

    it('should reject invalid file types', () => {
      const file = new File(['content'], 'test.exe', { type: 'application/x-msdownload' });
      const result = validateFileUpload(file);
      expect(result.valid).toBe(false);
    });

    it('should respect custom options', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const result = validateFileUpload(file, {
        allowedTypes: ['text/plain'],
        allowedExtensions: ['.txt'],
      });
      expect(result.valid).toBe(true);
    });
  });

  describe('sanitizeSearchQuery', () => {
    it('should remove SQL injection attempts', () => {
      const malicious = "'; DROP TABLE users; --";
      const safe = sanitizeSearchQuery(malicious);
      expect(safe).not.toContain("'");
      expect(safe).not.toContain(';');
      expect(safe).not.toContain('--');
    });

    it('should limit query length', () => {
      const longQuery = 'a'.repeat(300);
      const safe = sanitizeSearchQuery(longQuery);
      expect(safe.length).toBeLessThanOrEqual(200);
    });

    it('should preserve normal search terms', () => {
      const query = 'Harry Potter';
      const safe = sanitizeSearchQuery(query);
      expect(safe).toBe('Harry Potter');
    });
  });

  describe('maskSensitiveData', () => {
    it('should mask data correctly', () => {
      const data = '1234567890';
      const masked = maskSensitiveData(data, 4);
      expect(masked).toBe('******7890');
    });

    it('should not mask short data', () => {
      const data = '123';
      const masked = maskSensitiveData(data, 4);
      expect(masked).toBe('123');
    });

    it('should handle edge cases', () => {
      expect(maskSensitiveData('')).toBe('');
      expect(maskSensitiveData(null)).toBeNull();
    });
  });

  describe('checkRateLimit', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should allow requests within limit', () => {
      expect(checkRateLimit('test', 5, 60000)).toBe(true);
      expect(checkRateLimit('test', 5, 60000)).toBe(true);
      expect(checkRateLimit('test', 5, 60000)).toBe(true);
    });

    it('should block requests after exceeding limit', () => {
      for (let i = 0; i < 5; i++) {
        checkRateLimit('test', 5, 60000);
      }
      expect(checkRateLimit('test', 5, 60000)).toBe(false);
    });
  });
});
