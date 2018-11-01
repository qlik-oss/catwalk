module.exports = {
  glob: 'test/comp/**/*.spec.jsx',
  // coverage: true,
  src: ['src/components/**/*.jsx'],
  mocks: [
    ['**/*.{svg,css,scss,pcss}'],
    // ['**/src/enigma/config.js', () => {}],
  ],
};
