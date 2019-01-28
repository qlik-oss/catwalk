module.exports = {
  glob: ['test/e2e/*.spec.js'],
  launch: false,
  'chrome.browserWSEndpoint': 'ws://localhost:3000',
  'chrome.defaultViewport': {
    width: 1920,
    height: 1080,
  },
  'mocha.bail': false,
};
