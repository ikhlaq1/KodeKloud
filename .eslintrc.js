module.exports = {
  root: true,

  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaVersion: 2021,

    sourceType: 'module',

    ecmaFeatures: {
      jsx: true,
    },
  },

  plugins: [
    '@typescript-eslint',

    'react',

    'react-hooks',

    'react-native',

    'prettier',
  ],

  extends: [
    'eslint:recommended',

    'plugin:@typescript-eslint/recommended',

    'plugin:react/recommended',

    'plugin:react-hooks/recommended',

    'plugin:react-native/all',

    'prettier',
  ],

  rules: {
    'prettier/prettier': 'error',

    'react/prop-types': 'off',

    'react-native/no-inline-styles': 'warn',

    '@typescript-eslint/explicit-module-boundary-types': 'off',

    '@typescript-eslint/no-explicit-any': 'warn',
  },

  settings: {
    react: {
      version: 'detect',
    },
  },
};
