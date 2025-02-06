// @ts-check

import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import stylisticJsx from '@stylistic/eslint-plugin-jsx';
import react from 'eslint-plugin-react';
import globals from 'globals';

import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
// @ts-expect-error ignore type errors
import importPlugin from 'eslint-plugin-import';
import flowtypePlugin from 'eslint-plugin-flowtype';
import pluginPromise from 'eslint-plugin-promise'

import tseslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';
import { fixupPluginRules } from '@eslint/compat';

const compat = new FlatCompat();

export default tseslint.config(
  {
    ignores: [
      'dist',
      'isolation-dist',
      '*.d.ts',
      '*.{js,jsx}',
      'src/tsconfig.json',
      '*.css',
      'node_modules/**/*',
      'out',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  pluginPromise.configs['flat/recommended'],
  {
    files: ['src/**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    ...importPlugin.flatConfigs.recommended,
    ...importPlugin.flatConfigs.typescript,
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        window: true,
      },
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/internal-regex': '^~/',
      'import/resolver': {
        node: true,
        typescript: true,
      },
    },
    plugins: {
      '@stylistic': stylistic,
      '@stylistic/ts': stylisticTs,
      '@stylistic/jsx': stylisticJsx,
      react,
      'react-hooks': fixupPluginRules(reactHooksPlugin),
      'jsx-a11y': jsxA11yPlugin,
      'flow-type': flowtypePlugin,
    },
    extends: [
      ...compat.config(jsxA11yPlugin.configs.recommended),

      ...tseslint.configs.strict,
      ...tseslint.configs.stylistic,
    ],
    rules: {
      '@stylistic/semi': 'error',
      '@stylistic/ts/indent': ['error', 2],
      '@stylistic/jsx/jsx-indent': ['error', 2],
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'off',
      'react/require-render-return': 'off',
      'react/display-name': 'off',
      'react/no-direct-mutation-state': 'off',
      'react/no-string-refs': 'off',
      'react/jsx-no-undef': 'off',
      'import/namespace': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      ...reactHooksPlugin.configs.recommended.rules,
      'react-hooks/exhaustive-deps': 'warn',
      'comma-dangle': ['error', 'always-multiline'],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
    },
  },
);
