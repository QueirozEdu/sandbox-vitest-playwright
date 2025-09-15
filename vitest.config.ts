/// <reference types="vitest" />
// Makes sure Typescript knows Vitest types

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

// Loads env variables before everything
// import dotenv from 'dotenv';
// dotenv.config({ path: '.env.test' });

export default defineConfig({
  test: {
    // Defines test environment like jsdom
    // (simulates DOM in Node.js, ideal for React components testing)
    environment: 'jsdom',

    // Allows to use functions like `describe`, `it`, `expect`
    // whitout importing manually
    globals: true,

    // Run tests side by side (Default Vitest behavior)
    fileParallelism: false,

    //File executed before each **test file**
    setupFiles: ['vitest.setup.ts'],

    // Executed once (setup) and after (tearDown) of the whole test suite
    globalSetup: ['vitest.global.setup.ts'],

    // Defines which files will be considered to test (unit & integration)
    // Integration: .test.ts(x) | Unit: .spec.ts(x)
    include: ['src/**/*.{spec,test}.{ts,tsx}'],

    // Max time for each test (milliseconds)
    // before considering it blocked or failed
    testTimeout: 10000,

    // Configuring test coverage
    coverage: {
      // Folder where reports will be generated
      reportsDirectory: './coverage',

      // Uses the native Node.js coverage mechanism
      provider: 'v8',

      // Which files will be analyzed for code coverage
      include: ['src/**/*.{ts,tsx}'],

      // Files and folders that will be ignored in the coverage report
      exclude: [
        // Ignores test files
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',

        // Ignores files with only types or interfaces
        '**/types/**',
        '**/*.d.ts',
        '**/*.type.{ts,tsx}',
        '**/*.types.{ts,tsx}',
        '**/*.contract.{ts,tsx}',
        '**/*.protocol.{ts,tsx}',
        '**/*.interface.{ts,tsx}',

        // Ignores layout.tsx (remove if is necessary to test layout)
        'src/app/**/layout.{ts,tsx}',

        // Ignores mock files and folders utils
        '**/*.mock.{ts,tsx}',
        '**/*.mocks.{ts,tsx}',
        '**/mocks/**',
        '**/__mocks__/**',
        '**/__tests__/**',
        '**/__test-utils__/**',
        '**/*.test-util.ts',

        // Ignores Storybook files and folders
        '**/*.story.{ts,tsx}',
        '**/*.stories.{ts,tsx}',
        '**/stories/**',
        '**/__stories__/**',
      ],
    },
  },
  // Activates React plugin (JSX transform, HMR, etc)
  plugins: [react()],
  resolve: {
    alias: {
      // Alllows the use of @/ as shortcut to the src folder
      // Example: import Button from '@/components/Button'
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
