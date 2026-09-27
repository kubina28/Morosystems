import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importX from 'eslint-plugin-import-x';
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['node_modules/', 'reports/', '.todo-be/'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'field',
            'constructor',
            ['get', 'set'],
            'public-method',
            'protected-method',
            'private-method',
          ],
        },
      ],
    },
  },
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    plugins: { 'import-x': importX },
    rules: {
      'import-x/no-extraneous-dependencies': 'error',
      'no-restricted-imports': ['error', { patterns: ['@automation/*/*'] }],
    },
  },
  {
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-skipped-test': ['warn', { allowConditional: true }],
    },
  },
  {
    files: ['eslint.config.mjs'],
    ...tseslint.configs.disableTypeChecked,
  },
  prettier,
);
