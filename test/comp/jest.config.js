module.exports = {
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/../../mocks/SvgMock.jsx',
    '^.+\\.(pcss)$': '<rootDir>/../../mocks/cssTransform.js',
  },
  collectCoverageFrom: ['src/**/*.(js|jsx)'],
  testPathIgnorePatterns: ['node_modules', '.cache'],
  testRegex: './comp/.+\\.(test)\\.(js|jsx)$',
  testEnvironment: 'jsdom',
};
