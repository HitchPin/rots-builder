import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.spec.ts'],
    exclude: [],
    coverage: {
      exclude: ['bin', 'dist', 'eslint.config.mts', 'vitest.config.ts', 'src/b64/*'],
      provider: 'istanbul',
      reporter: ['text', 'json-summary'],
    },
  },
});
