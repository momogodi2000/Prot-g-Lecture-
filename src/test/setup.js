import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Mock DOMPurify BEFORE any imports that use it
vi.mock('dompurify', () => {
  const createDOMPurify = () => ({
    sanitize: (dirty, config = {}) => {
      if (typeof dirty !== 'string') return '';
      
      // Simple sanitization for testing
      let clean = dirty;
      
      // Remove script tags
      clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      
      // Remove dangerous protocols
      clean = clean.replace(/javascript:/gi, '');
      clean = clean.replace(/data:/gi, '');
      clean = clean.replace(/vbscript:/gi, '');
      
      // Remove event handlers
      clean = clean.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
      
      // If ALLOWED_TAGS is empty array, strip all HTML
      if (config.ALLOWED_TAGS && config.ALLOWED_TAGS.length === 0) {
        clean = clean.replace(/<[^>]*>/g, '');
      }
      
      return clean;
    },
  });
  
  return {
    default: createDOMPurify(),
  };
});

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock localStorage with actual storage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
global.localStorage = localStorageMock;

// Mock sessionStorage with actual storage
const sessionStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
global.sessionStorage = sessionStorageMock;

// Mock Firebase
vi.mock('../services/firebase', () => ({
  auth: {},
  analytics: null,
  performance: {},
  messaging: null,
  remoteConfig: {},
  googleProvider: {},
}));
