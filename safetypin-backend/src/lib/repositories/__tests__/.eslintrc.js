module.exports = {
  rules: {
    // Relaxed rules for tests
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off'
    // Jest rules are commented out until the plugin is installed
    // 'jest/expect-expect': 'error',
    // 'jest/no-disabled-tests': 'warn',
    // 'jest/no-focused-tests': 'error',
    // 'jest/no-identical-title': 'error',
    // 'jest/prefer-to-have-length': 'warn',
    // 'jest/valid-expect': 'error'
  },
  // plugins: [
  //   'jest'
  // ],
  env: {
    jest: true
  }
};
