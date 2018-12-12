// const { JSDOM } = require('jsdom');

// global.document = new JSDOM().window;

global.document = { location: { search: '' } };
global.document.createElement = () => '';

module.exports = {
  glob: 'test/comp/**/*.spec.jsx',
  coverage: true,
  src: ['src/components/**/*.jsx'],
  mocks: [
    ['**/*.{svg,css,scss,pcss}'],
  ],
};
