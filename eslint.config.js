import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'deliverables-demo/**',
      'tmp/**',
      'ui/**/bin/**',
      'ui/**/obj/**',
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.es2022,
        ...globals.node,
      },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Keep CI stable; we can tighten later.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
];
