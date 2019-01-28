/* global before, after */

const fs = require('fs-extra');
const NYC = require('nyc');
const wsHelper = require('./test-helper');

before(async () => {
  await fs.emptyDir('.nyc_output');
});

beforeEach(async () => {
  const host = process.env.CI === 'true' ? 'localhost' : 'host.docker.internal';
  const engine = process.env.CI === 'true' ? 'localhost' : 'qix-engine';
  const engineUrl = `http://${host}:1234/?engine_url=ws://${engine}:9076/`;

  const OPTS = {
    artifactsPath: 'test/e2e/__artifacts__/',
  };

  page = await browser.newPage();
  const client = page._client;
  await client.send('Animation.setPlaybackRate', { playbackRate: 1000 });

  wsHelper.init(client);

  global.host = host;
  global.engine = engine;
  global.engineUrl = engineUrl;
  global.OPTS = OPTS;
  global.wsHelper = wsHelper;
});

/* eslint-disable-next-line */
afterEach(async function () {
  const coverage = await page.evaluate(() => window.__coverage__);
  return fs.writeJson(`.nyc_output/${new Date().getTime()}.json`, coverage);
});

after(async () => {
  const nyc = new NYC();
  await nyc.report();
  await browser.close();
});
