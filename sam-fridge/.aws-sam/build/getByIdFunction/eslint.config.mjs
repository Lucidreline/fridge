import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node, // This adds Node globals like process, __dirname, etc.
      },
    },
    rules: {
      'no-undef': 'error',
      'prettier/prettier': ['error'],
      // Add any additional server-side rules as needed.
    },
  },
]);
