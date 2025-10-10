import { describe, it, expect } from 'vitest';
import {
  emailSchema,
  phoneSchema,
  passwordSchema,
  loginSchema,
  reservationSchema,
  bookSchema,
  contactSchema,
  newsletterSchema,
  isValidEmail,
  isValidPhone,
  sanitizeFileName,
  safeNumber,
} from '../utils/validators';

describe('Validators', () => {
  describe('emailSchema', () => {
    it('should accept valid emails', () => {
      const valid = ['test@example.com', 'user@domain.co.uk', 'name+tag@example.com'];
      valid.forEach((email) => {
        expect(() => emailSchema.parse(email)).not.toThrow();
      });
    });

    it('should reject invalid emails', () => {
      const invalid = ['invalid', '@example.com', 'user@', ''];
      invalid.forEach((email) => {
        expect(() => emailSchema.parse(email)).toThrow();
      });
    });

    it('should transform email to lowercase and trim', () => {
      const result = emailSchema.parse('  Test@EXAMPLE.com  ');
      expect(result).toBe('test@example.com');
    });
  });

  describe('phoneSchema', () => {
    it('should accept valid Cameroon phone numbers', () => {
      const valid = ['+237612345678', '+237698765432', '612345678'];
      valid.forEach((phone) => {
        expect(() => phoneSchema.parse(phone)).not.toThrow();
      });
    });

    it('should remove formatting', () => {
      const formatted = '+237 6 12 34 56 78';
      const result = phoneSchema.parse(formatted);
      expect(result).toBe('+237612345678');
    });

    it('should reject invalid phone numbers', () => {
      const invalid = ['123', 'abcdefghij', '+123456'];
      invalid.forEach((phone) => {
        expect(() => phoneSchema.parse(phone)).toThrow();
      });
    });
  });

  describe('passwordSchema', () => {
    it('should accept strong passwords', () => {
      const strong = ['Password123!', 'Secur3P@ssw0rd', 'MyP@ssw0rd!'];
      strong.forEach((password) => {
        expect(() => passwordSchema.parse(password)).not.toThrow();
      });
    });

    it('should reject weak passwords', () => {
      const weak = [
        'short',            // Too short
        'nouppercase1!',    // No uppercase
        'NOLOWERCASE1!',    // No lowercase
        'NoNumbers!',       // No numbers
        'NoSpecialChar1',   // No special character
        'Password111',      // Repetitive characters
      ];
      weak.forEach((password) => {
        expect(() => passwordSchema.parse(password)).toThrow();
      });
    });
  });

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validLogin = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      expect(() => loginSchema.parse(validLogin)).not.toThrow();
    });

    it('should reject invalid login data', () => {
      const invalidLogins = [
        { email: 'invalid', password: 'Password123!' },
        { email: 'test@example.com', password: '' },
        { email: '', password: 'Password123!' },
      ];
      invalidLogins.forEach((login) => {
        expect(() => loginSchema.parse(login)).toThrow();
      });
    });
  });

  describe('reservationSchema', () => {
    it('should validate correct reservation data', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const validReservation = {
        nom_visiteur: 'Jean Dupont',
        email_visiteur: 'jean@example.com',
        telephone_visiteur: '+237612345678',
        date_souhaitee: tomorrow.toISOString().split('T')[0],
        creneau: 'matin',
        commentaire: 'Je souhaite consulter des livres d\'histoire',
      };
      
      const result = reservationSchema.parse(validReservation);
      expect(result.nom_visiteur).toBe('Jean Dupont');
      expect(result.creneau).toBe('matin');
    });

    it('should reject past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const invalidReservation = {
        nom_visiteur: 'Jean Dupont',
        email_visiteur: 'jean@example.com',
        telephone_visiteur: '+237612345678',
        date_souhaitee: yesterday.toISOString().split('T')[0],
        creneau: 'matin',
      };
      
      expect(() => reservationSchema.parse(invalidReservation)).toThrow();
    });

    it('should require valid slot', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const invalidReservation = {
        nom_visiteur: 'Jean Dupont',
        email_visiteur: 'jean@example.com',
        telephone_visiteur: '+237612345678',
        date_souhaitee: tomorrow.toISOString().split('T')[0],
        creneau: 'invalid_slot',
      };
      
      expect(() => reservationSchema.parse(invalidReservation)).toThrow();
    });
  });

  describe('bookSchema', () => {
    it('should validate correct book data', () => {
      const validBook = {
        titre: 'Les Misérables',
        auteur_id: 1,
        categorie_id: 2,
        resume: 'Un chef-d\'œuvre de Victor Hugo racontant l\'histoire de Jean Valjean.',
        annee_publication: 1862,
        langue: 'FR',
        nombre_exemplaires: 3,
        isbn: '978-2-07-036864-6',
        editeur: 'Gallimard',
        nombre_pages: 1500,
        tags: 'classique, français, littérature',
        cote: 'FR-LIT-001',
      };
      
      expect(() => bookSchema.parse(validBook)).not.toThrow();
    });

    it('should reject invalid book data', () => {
      const invalidBooks = [
        { titre: '', auteur_id: 1, categorie_id: 1 }, // Empty title
        { titre: 'Book', auteur_id: 0, categorie_id: 1 }, // Invalid author_id
        { titre: 'Book', auteur_id: 1, categorie_id: 0 }, // Invalid categorie_id
      ];
      
      invalidBooks.forEach((book) => {
        expect(() => bookSchema.parse(book)).toThrow();
      });
    });
  });

  describe('contactSchema', () => {
    it('should validate correct contact data', () => {
      const validContact = {
        nom_complet: 'Jean Dupont',
        email: 'jean@example.com',
        telephone: '+237612345678',
        sujet: 'Question sur les horaires',
        message: 'Bonjour, je voudrais savoir quels sont vos horaires d\'ouverture?',
      };
      
      expect(() => contactSchema.parse(validContact)).not.toThrow();
    });

    it('should reject short messages', () => {
      const invalidContact = {
        nom_complet: 'Jean Dupont',
        email: 'jean@example.com',
        sujet: 'Question',
        message: 'Too short',
      };
      
      expect(() => contactSchema.parse(invalidContact)).toThrow();
    });
  });

  describe('newsletterSchema', () => {
    it('should validate correct newsletter subscription', () => {
      const valid = {
        email: 'user@example.com',
        nom_complet: 'Jean Dupont',
      };
      
      expect(() => newsletterSchema.parse(valid)).not.toThrow();
    });

    it('should allow email only', () => {
      const emailOnly = {
        email: 'user@example.com',
      };
      
      expect(() => newsletterSchema.parse(emailOnly)).not.toThrow();
    });
  });

  describe('isValidEmail helper', () => {
    it('should return boolean for email validation', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('invalid')).toBe(false);
    });
  });

  describe('isValidPhone helper', () => {
    it('should return boolean for phone validation', () => {
      expect(isValidPhone('+237612345678')).toBe(true);
      expect(isValidPhone('invalid')).toBe(false);
    });
  });

  describe('sanitizeFileName', () => {
    it('should sanitize dangerous file names', () => {
      expect(sanitizeFileName('../../../etc/passwd')).toBe('_etc_passwd');
      expect(sanitizeFileName('file<script>.txt')).toBe('file_script_.txt');
    });

    it('should preserve safe file names', () => {
      expect(sanitizeFileName('my-file.pdf')).toBe('my-file.pdf');
      expect(sanitizeFileName('document_2024.docx')).toBe('document_2024.docx');
    });

    it('should limit length', () => {
      const longName = 'a'.repeat(300) + '.txt';
      const result = sanitizeFileName(longName);
      expect(result.length).toBeLessThanOrEqual(255);
    });
  });

  describe('safeNumber', () => {
    it('should parse valid numbers', () => {
      expect(safeNumber('42')).toBe(42);
      expect(safeNumber(42)).toBe(42);
      expect(safeNumber('3.14')).toBe(3.14);
    });

    it('should return default for invalid numbers', () => {
      expect(safeNumber('invalid', 0)).toBe(0);
      expect(safeNumber(NaN, 10)).toBe(10);
      expect(safeNumber(Infinity, 100)).toBe(100);
    });

    it('should respect min/max bounds', () => {
      expect(safeNumber(150, 0, 0, 100)).toBe(100);
      expect(safeNumber(-10, 0, 0, 100)).toBe(0);
      expect(safeNumber(50, 0, 0, 100)).toBe(50);
    });
  });
});
