module.exports = {
  collectCoverageFrom: ['src/**/*.(js|jsx)'],
  testPathIgnorePatterns: ['node_modules', '.cache'],
  testRegex: './unit/.+\\.(test)\\.(js|jsx)$',
  testEnvironment: 'jsdom',
};
