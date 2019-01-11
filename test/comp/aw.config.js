const { JSDOM } = require('jsdom');

const template = `
<html>
<head>
</head>
<body>
</body>
</html>
`;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop),
    }), {});
  Object.defineProperties(target, props);
}

const jsdom = new JSDOM(template);
const { window } = jsdom;
global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
global.window.cancelAnimationFrame = () => {};
global.window.requestAnimationFrame = () => {};
copyProps(window, global);


module.exports = {
  glob: 'test/comp/**/*.spec.jsx',
  coverage: true,
  src: ['src/components/**/*.jsx'],
  mocks: [
    ['**/*.{svg,css,scss,pcss}'],
  ],
  exit: true,
};
