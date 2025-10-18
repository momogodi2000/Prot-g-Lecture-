import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'src/**/*.test.{js,jsx,ts,tsx}',
      'server/**/*.test.{js,jsx,ts,tsx}'
    ],
    exclude: [
      'node_modules',
      'dist',
      'build'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        'server/test/',
        '**/*.test.{js,jsx,ts,tsx}',
        '**/*.config.{js,ts}',
        'dist/',
        'build/'
      ]
    },
    setupFiles: ['./src/test/setup.js']
  },
});
