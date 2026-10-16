import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: {
    // Node environment: these suites cover the validation schema and the
    // integrity of the content layer, neither of which touches the DOM. Adding
    // jsdom and a component-testing stack would be weight this project does
    // not currently need.
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      // Mirrors the `@/*` path alias from tsconfig.json.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
