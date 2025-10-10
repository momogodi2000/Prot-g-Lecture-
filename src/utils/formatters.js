import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import 'dayjs/locale/en';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// Format date
export const formatDate = (date, format = 'DD/MM/YYYY', locale = 'fr') => {
  if (!date) return '';
  return dayjs(date).locale(locale).format(format);
};

// Format datetime
export const formatDateTime = (date, locale = 'fr') => {
  if (!date) return '';
  return dayjs(date).locale(locale).format('DD/MM/YYYY HH:mm');
};

// Format relative time
export const formatRelativeTime = (date, locale = 'fr') => {
  if (!date) return '';
  return dayjs(date).locale(locale).fromNow();
};

// Format currency (XAF - Central African CFA franc)
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(amount);
};

// Format number
export const formatNumber = (number, locale = 'fr') => {
  if (number === null || number === undefined) return '';
  return new Intl.NumberFormat(locale).format(number);
};

// Format phone number
export const formatPhone = (phone) => {
  if (!phone) return '';
  // Format Cameroon phone: +237 6XX XX XX XX
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `+237 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

// Truncate text
export const truncate = (text, maxLength = 100, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + suffix;
};

// Capitalize first letter
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Generate reservation number
export const generateReservationNumber = () => {
  const date = dayjs().format('YYYYMMDD');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `RES-${date}-${random}`;
};

// Format availability status
export const formatAvailabilityStatus = (status, t) => {
  const statusMap = {
    disponible: { text: 'Disponible', color: 'green' },
    reserve_complet: { text: 'Complet', color: 'red' },
    maintenance: { text: 'Maintenance', color: 'yellow' }
  };
  return statusMap[status] || { text: status, color: 'gray' };
};

// Format reservation status
export const formatReservationStatus = (status) => {
  const statusMap = {
    en_attente: { text: 'En attente', color: 'yellow' },
    validee: { text: 'Validée', color: 'green' },
    refusee: { text: 'Refusée', color: 'red' },
    terminee: { text: 'Terminée', color: 'blue' },
    annulee: { text: 'Annulée', color: 'gray' }
  };
  return statusMap[status] || { text: status, color: 'gray' };
};

// Parse tags
export const parseTags = (tagsString) => {
  if (!tagsString) return [];
  return tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
};

// Format tags
export const formatTags = (tagsArray) => {
  if (!Array.isArray(tagsArray)) return '';
  return tagsArray.join(', ');
};

