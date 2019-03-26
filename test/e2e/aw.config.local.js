module.exports = {
  glob: ['test/e2e/*.spec.js'],
  launch: true,
  'chrome.headless': false,
  'chrome.defaultViewport': {
    width: 1920,
    height: 1080,
  },
  'mocha.bail': false,
  'mocha.timeout': 0,
};
