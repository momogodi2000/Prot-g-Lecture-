import { z } from 'zod';
import { sanitizeInput } from './security';

// Email validator with sanitization
export const emailSchema = z.string()
  .email('Adresse email invalide')
  .transform(val => sanitizeInput(val.trim()).toLowerCase())
  .refine(val => val.length <= 254, 'Email trop long');

// Phone validator (Cameroon format) with sanitization
export const phoneSchema = z.string()
  .transform(val => val.replace(/[\s-()]/g, ''))
  .refine(val => /^(\+237)?[26]\d{8}$/.test(val),
    'Numéro de téléphone invalide (format: +237XXXXXXXXX ou 6XXXXXXXX)'
  );

// Password validator with stronger security requirements
export const passwordSchema = z.string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .max(128, 'Le mot de passe est trop long')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
  .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial')
  .refine(val => !/(.)\1{2,}/.test(val), 'Le mot de passe ne doit pas contenir de caractères répétitifs');

// Login schema with rate limiting consideration
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Le mot de passe est requis').max(128, 'Mot de passe invalide')
});

// Reservation schema with enhanced validation
export const reservationSchema = z.object({
  nom_visiteur: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom est trop long')
    .transform(val => sanitizeInput(val).trim())
    .refine(val => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(val), 'Le nom contient des caractères invalides'),
  email_visiteur: emailSchema,
  telephone_visiteur: phoneSchema,
  date_souhaitee: z.string()
    .min(1, 'La date est requise')
    .refine(val => !isNaN(Date.parse(val)), 'Date invalide')
    .refine(val => new Date(val) >= new Date(new Date().setHours(0, 0, 0, 0)), 'La date ne peut pas être dans le passé'),
  creneau: z.enum(['matin', 'apres_midi'], {
    errorMap: () => ({ message: 'Veuillez sélectionner un créneau' })
  }),
  commentaire: z.string()
    .max(500, 'Le commentaire est trop long')
    .transform(val => sanitizeInput(val || '').trim())
    .optional()
});

// Book schema with enhanced security
export const bookSchema = z.object({
  titre: z.string()
    .min(1, 'Le titre est requis')
    .max(255, 'Le titre est trop long')
    .transform(val => sanitizeInput(val).trim()),
  auteur_id: z.number().int().min(1, 'L\'auteur est requis'),
  categorie_id: z.number().int().min(1, 'La catégorie est requise'),
  resume: z.string()
    .min(10, 'Le résumé doit contenir au moins 10 caractères')
    .max(2000, 'Le résumé est trop long')
    .transform(val => sanitizeInput(val).trim()),
  annee_publication: z.number()
    .int()
    .min(1000, 'Année invalide')
    .max(new Date().getFullYear() + 1, 'L\'année ne peut pas être trop loin dans le futur'),
  langue: z.enum(['FR', 'EN', 'ES', 'DE', 'AUTRE']),
  nombre_exemplaires: z.number().int().min(1, 'Au moins un exemplaire est requis').max(1000, 'Nombre trop élevé'),
  isbn: z.string()
    .max(17, 'ISBN invalide')
    .transform(val => sanitizeInput(val || '').trim())
    .optional(),
  editeur: z.string()
    .max(255, 'Nom d\'éditeur trop long')
    .transform(val => sanitizeInput(val || '').trim())
    .optional(),
  nombre_pages: z.number().int().min(1).max(10000).optional(),
  tags: z.string()
    .max(500, 'Tags trop longs')
    .transform(val => sanitizeInput(val || '').trim())
    .optional(),
  cote: z.string()
    .max(50, 'Cote trop longue')
    .transform(val => sanitizeInput(val || '').trim())
    .optional()
});

// Contact form schema with XSS prevention
export const contactSchema = z.object({
  nom_complet: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom est trop long')
    .transform(val => sanitizeInput(val).trim())
    .refine(val => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(val), 'Le nom contient des caractères invalides'),
  email: emailSchema,
  telephone: phoneSchema.optional(),
  sujet: z.string()
    .min(1, 'Le sujet est requis')
    .max(200, 'Le sujet est trop long')
    .transform(val => sanitizeInput(val).trim()),
  message: z.string()
    .min(20, 'Le message doit contenir au moins 20 caractères')
    .max(2000, 'Le message est trop long')
    .transform(val => sanitizeInput(val).trim())
});

// Newsletter subscription schema with validation
export const newsletterSchema = z.object({
  email: emailSchema,
  nom_complet: z.string()
    .max(100, 'Le nom est trop long')
    .transform(val => sanitizeInput(val || '').trim())
    .optional()
});

// Validate email helper
export const isValidEmail = (email) => {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
};

// Validate phone helper
export const isValidPhone = (phone) => {
  try {
    phoneSchema.parse(phone);
    return true;
  } catch {
    return false;
  }
};

// Safe URL validator
export const urlSchema = z.string()
  .url('URL invalide')
  .refine(val => {
    try {
      const url = new URL(val);
      return ['http:', 'https:'].includes(url.protocol);
    } catch {
      return false;
    }
  }, 'Seuls les protocoles HTTP et HTTPS sont autorisés');

// File name sanitizer
export const sanitizeFileName = (fileName) => {
  return sanitizeInput(fileName)
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255);
};

// Number validation helper
export const safeNumber = (value, defaultValue = 0, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) => {
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) return defaultValue;
  return Math.max(min, Math.min(max, num));
};

