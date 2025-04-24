import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  {
    ignores: [
      'dist/',            // Build output
      'build/',           // Another potential build output
      'out/',             // Another potential build output
      '**/*.test.ts',     // Test files (TypeScript)
      '**/*.test.tsx',    // Test files (TypeScript + JSX)
      'node_modules/',    // Third-party dependencies
      '*.min.js',         // Minified JavaScript files (if any)
      '*.bundle.js',      // Bundled JavaScript files (if any)
    ],
  },
  {
    extends: [
      js.configs.recommended, 
      ...tseslint.configs.recommended,
      // Convert React plugin config to an object format
      {
        plugins: {
          react: react,
        },
        rules: react.configs.recommended.rules,
      },
      {
        plugins: {
          'jsx-a11y': jsxA11y,
        },
        rules: jsxA11y.configs.recommended.rules,
      },
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react-x': reactX,
      'react-dom': reactDom,
      'react': react,  // Use the installed react plugin
      'jsx-a11y': jsxA11y,  // Accessibility plugin
    },
    rules: {
      ...reactHooks.configs.recommended.rules, // React Hooks rules
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Enable React-specific TypeScript rules
     ...reactX.configs['recommended-typescript'].rules,
     ...reactDom.configs.recommended.rules,
     'react/prop-types': 'off', // Disable prop-types validation (use TypeScript for type checking)
     '@typescript-eslint/explicit-module-boundary-types': 'off', // Optionally disable return type checks for simplicity
     'react/react-in-jsx-scope': 'off', // Disable for React 17+
    },
    settings: {
      react: {
        version: 'detect',  // Automatically detect the React version
      },
    },
  },
)
