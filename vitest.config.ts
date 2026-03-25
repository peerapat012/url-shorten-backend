import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,                // Allows using 'describe', 'it', 'expect' without importing them
        environment: 'node',         // We are testing a Node.js backend
        include: ['src/**/*.test.ts'], // Look for test files ending in .test.ts
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
    },
});