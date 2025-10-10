import DOMPurify from 'dompurify';

/**
 * Security Utility Functions
 * Provides XSS protection, input sanitization, and security helpers
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} dirty - Unsanitized HTML string
 * @param {object} config - DOMPurify configuration
 * @returns {string} - Sanitized HTML string
 */
export const sanitizeHTML = (dirty, config = {}) => {
  const defaultConfig = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    RETURN_TRUSTED_TYPE: false,
  };

  return DOMPurify.sanitize(dirty, { ...defaultConfig, ...config });
};

/**
 * Sanitize user input for plain text (strip all HTML)
 * @param {string} input - User input
 * @returns {string} - Sanitized plain text
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
export const escapeHTML = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
};

/**
 * Validate and sanitize URL
 * @param {string} url - URL to validate
 * @returns {string|null} - Valid URL or null
 */
export const sanitizeURL = (url) => {
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return null;
    }
    return urlObj.toString();
  } catch {
    return null;
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (international format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
};

/**
 * Rate limiting helper (client-side)
 * @param {string} key - Unique identifier for the action
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - True if action is allowed
 */
export const checkRateLimit = (key, maxAttempts = 5, windowMs = 60000) => {
  const now = Date.now();
  const storageKey = `rateLimit_${key}`;
  
  try {
    const data = JSON.parse(localStorage.getItem(storageKey) || '{"attempts":[],"blocked":0}');
    
    // Check if currently blocked
    if (data.blocked && data.blocked > now) {
      return false;
    }
    
    // Filter attempts within the time window
    data.attempts = data.attempts.filter(timestamp => timestamp > now - windowMs);
    
    // Check if exceeded max attempts
    if (data.attempts.length >= maxAttempts) {
      data.blocked = now + windowMs;
      localStorage.setItem(storageKey, JSON.stringify(data));
      return false;
    }
    
    // Add current attempt
    data.attempts.push(now);
    localStorage.setItem(storageKey, JSON.stringify(data));
    return true;
  } catch {
    return true; // Allow if localStorage fails
  }
};

/**
 * Generate a secure random token
 * @param {number} length - Token length
 * @returns {string} - Random token
 */
export const generateSecureToken = (length = 32) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {object} options - Validation options
 * @returns {object} - Validation result
 */
export const validateFileUpload = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
  } = options;

  const errors = [];

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size exceeds ${maxSize / (1024 * 1024)}MB`);
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }

  // Check file extension
  const extension = `.${file.name.split('.').pop().toLowerCase()}`;
  if (!allowedExtensions.includes(extension)) {
    errors.push(`File extension ${extension} is not allowed`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Prevent SQL injection in search queries
 * @param {string} query - Search query
 * @returns {string} - Sanitized query
 */
export const sanitizeSearchQuery = (query) => {
  if (typeof query !== 'string') return '';
  
  // Remove SQL keywords and special characters
  return query
    .replace(/['";\\]/g, '') // Remove quotes and backslashes
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove multi-line comments start
    .replace(/\*\//g, '') // Remove multi-line comments end
    .trim()
    .substring(0, 200); // Limit length
};

/**
 * Content Security Policy violation reporter
 * @param {Event} event - CSP violation event
 */
export const reportCSPViolation = (event) => {
  if (event.blockedURI && event.violatedDirective) {
    console.warn('CSP Violation:', {
      blockedURI: event.blockedURI,
      violatedDirective: event.violatedDirective,
      originalPolicy: event.originalPolicy,
      sourceFile: event.sourceFile,
    });

    // You can send this to your analytics or logging service
    // analytics.logEvent('csp_violation', { ... });
  }
};

/**
 * Check if the current connection is secure
 * @returns {boolean}
 */
export const isSecureConnection = () => {
  return window.location.protocol === 'https:' || 
         window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1';
};

/**
 * Mask sensitive data for display
 * @param {string} data - Sensitive data
 * @param {number} visibleChars - Number of visible characters at the end
 * @returns {string} - Masked data
 */
export const maskSensitiveData = (data, visibleChars = 4) => {
  if (!data || data.length <= visibleChars) return data;
  const masked = '*'.repeat(data.length - visibleChars);
  return masked + data.slice(-visibleChars);
};

/**
 * Validate CSRF token (if implemented)
 * @param {string} token - CSRF token from form
 * @returns {boolean}
 */
export const validateCSRFToken = (token) => {
  const storedToken = sessionStorage.getItem('csrf_token');
  return token === storedToken;
};

/**
 * Generate CSRF token
 * @returns {string}
 */
export const generateCSRFToken = () => {
  const token = generateSecureToken();
  sessionStorage.setItem('csrf_token', token);
  return token;
};

export default {
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
  reportCSPViolation,
  isSecureConnection,
  maskSensitiveData,
  validateCSRFToken,
  generateCSRFToken,
};
