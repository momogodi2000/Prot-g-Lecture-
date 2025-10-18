import { beforeAll, afterAll, beforeEach } from 'vitest';

// Mock browser globals for Node.js testing environment
global.fetch = vi.fn();
global.Headers = vi.fn();
global.Request = vi.fn();
global.Response = vi.fn();

// Mock localStorage for tests
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock window object
global.window = {
  location: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
  },
  history: {
    pushState: vi.fn(),
    replaceState: vi.fn(),
  },
};

beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});