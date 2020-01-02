/* global before, after */
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

const fs = require('fs-extra');
// const NYC = require('nyc');
const wsHelper = require('./test-helper');

let coverageFlag = false;

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
  if (coverage) {
    coverageFlag = true;
    await fs.writeJson(`.nyc_output/${new Date().getTime()}.json`, coverage);
  }

  const ignoreAsserts = (message) => {
    const errors2skip = ['No baseline found!', 'equality to be less than'];
    let found = false;

    for (let index = 0; index < errors2skip.length; index++) {
      if (message.includes(errors2skip[index])) {
        found = true;
        break;
      }
    }

    return found;
  };

  if (this.currentTest.state === 'failed' && !ignoreAsserts(this.currentTest.err.message)) {
    const fullname = await this.currentTest.fullTitle();
    await page.screenshot({ fullPage: true, path: `${OPTS.artifactsPath}${fullname}.png` });
  }
});

after(async () => {
  // const nyc = new NYC();
  // await nyc.report();
  if (!coverageFlag) {
    console.log('\u001b[31m The code hasn´t been instrumented! Please start the server with `npm run start:cov`\u001b[0m'); // eslint-disable-line no-console
  }

  await browser.close();
});
