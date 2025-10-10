// Application Constants

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Protégé Lecture+';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';
export const API_URL = import.meta.env.VITE_API_URL || '';

// Book Status
export const BOOK_STATUS = {
  AVAILABLE: 'disponible',
  RESERVED_FULL: 'reserve_complet',
  MAINTENANCE: 'maintenance'
};

// Book Status Options for dropdowns
export const BOOK_STATUS_OPTIONS = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'reserve_complet', label: 'Complet' },
  { value: 'maintenance', label: 'Maintenance' }
];

// Reservation Status
export const RESERVATION_STATUS = {
  PENDING: 'en_attente',
  VALIDATED: 'validee',
  REFUSED: 'refusee',
  COMPLETED: 'terminee',
  CANCELLED: 'annulee'
};

// Time Slots
export const TIME_SLOTS = {
  MORNING: 'matin',
  AFTERNOON: 'apres_midi'
};

// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin'
};

// Languages
export const LANGUAGES = {
  FR: 'FR',
  EN: 'EN',
  ES: 'ES',
  DE: 'DE',
  OTHER: 'AUTRE'
};

// Language Options for dropdowns
export const LANGUAGE_OPTIONS = [
  { value: 'FR', label: 'Français' },
  { value: 'EN', label: 'Anglais' },
  { value: 'ES', label: 'Espagnol' },
  { value: 'DE', label: 'Allemand' },
  { value: 'AUTRE', label: 'Autre' }
];

// Admin Status
export const ADMIN_STATUS = {
  ACTIVE: 'actif',
  INACTIVE: 'inactif'
};

// Group Status
export const GROUP_STATUS = {
  ACTIVE: 'actif',
  INACTIVE: 'inactif',
  ARCHIVED: 'archive'
};

// Event Types
export const EVENT_TYPES = {
  WORKSHOP: 'atelier',
  CONFERENCE: 'conference',
  READING_CLUB: 'club_lecture',
  EXHIBITION: 'exposition',
  TRAINING: 'formation',
  OTHER: 'autre'
};

// Content Status
export const CONTENT_STATUS = {
  DRAFT: 'brouillon',
  PUBLISHED: 'publie',
  ARCHIVED: 'archive'
};

// Message Status
export const MESSAGE_STATUS = {
  UNREAD: 'non_lu',
  READ: 'lu',
  REPLIED: 'repondu',
  ARCHIVED: 'archive'
};

// Newsletter Status
export const NEWSLETTER_STATUS = {
  ACTIVE: 'actif',
  UNSUBSCRIBED: 'desabonne',
  BOUNCED: 'bounce'
};

// Pagination
export const ITEMS_PER_PAGE = 20;

// Date Format
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';

// Image Upload
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

