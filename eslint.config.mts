// @ts-check

import eslint from '@eslint/js';
import { globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import jsdoc from 'eslint-plugin-jsdoc';

export default tseslint.config(
  globalIgnores(['dist/*','.tsup/*', 'src/b64/polyfill-core.ts', 'test/*']),
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: './',
      },
    },
  },
  jsdoc.configs['flat/recommended'],
  {
    files: ['**/*.js'],
    plugins: {
      jsdoc,
    },
    rules: {
      'jsdoc/require-description': 'warn',
    }
  }
);
