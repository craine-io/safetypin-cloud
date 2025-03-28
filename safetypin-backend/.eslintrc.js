module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    // project: './tsconfig.json',
    // tsconfigRootDir: __dirname, 
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    // Temporarily downgrade errors to warnings
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-inferrable-types': 'warn',
    '@typescript-eslint/no-var-requires': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    
    // Customize other rules as needed
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-console': 'warn',
  },
  ignorePatterns: [
    'dist',
    'node_modules',
    'jest.config.js',
    'coverage',
    '*.json'
  ],
  overrides: [
    {
      // Less strict rules for test files
      files: ['**/__tests__/**/*', '**/*.test.ts', '**/*.spec.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
      }
    }
  ]
};
