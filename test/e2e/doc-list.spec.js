const host = process.env.CI === 'true' ? 'localhost' : 'host.docker.internal';
const engine = process.env.CI === 'true' ? 'localhost' : 'qix-engine';

const incorrectEngineUrl = `http://${host}:1234/?engine_url=ws://incorrect-url:9076`;
const correctEngineUrl = `http://${host}:1234/?engine_url=ws://${engine}:9076/`;
const OPTS = {
  artifactsPath: 'test/e2e/__artifacts__/',
};
let page;

const idArray = [];
let lastRequest;

const setIntervalWS = (callback, delay) => {
  const intervalID = setInterval(() => {
    callback();
  }, delay);
  return intervalID;
};

const waitUntilNoRequests = idleTime => new Promise((resolve) => {
  const intervalID = setIntervalWS(() => {
    const silence = new Date().getTime() - lastRequest;
    // console.log('Silence', silence, idArray.length === 0, silence > idleTime);
    if (idArray.length === 0 && silence > idleTime) {
      clearInterval(intervalID);
      resolve();
    }
  }, 100);
});

describe('doc-list', () => {
  beforeEach(async () => {
    page = await browser.newPage();
    const client = page._client;
    await client.send('Animation.setPlaybackRate', { playbackRate: 12 });

    client.on('Network.webSocketFrameSent', ({ requestId, timestamp, response }) => {
      // console.log('Network.webSocketFrameSent', requestId, timestamp, response.payloadData);
      const sentJSON = JSON.parse(response.payloadData);
      // console.log('Network.webSocketFrameSent', sentJSON);
      idArray.push(sentJSON.id);
      lastRequest = new Date().getTime();
      // console.log('Network.webSocketFrameSent', idArray, lastRequest);
    });

    client.on('Network.webSocketFrameReceived', ({ requestId, timestamp, response }) => {
      // console.log('Network.webSocketFrameReceived', requestId, timestamp, response.payloadData);
      const receivedJSON = JSON.parse(response.payloadData);
      // console.log('Network.webSocketFrameReceived', receivedJSON.id);

      const index = idArray.indexOf(receivedJSON.id);
      if (index > -1) {
        idArray.splice(index, 1);
      }

      // console.log('Network.webSocketFrameReceived', idArray);
    });
  });

  it('should show the no engine found with invalid engine url', async () => {
    await page.goto(incorrectEngineUrl, { timeout: 60000, waitUntil: 'networkidle0' });
    await page.waitForSelector('[value=Connect]');
    const img = await page.screenshot({ fullPage: true });
    await expect(img).to.matchImageOf('no-engine-doc-list', OPTS);
  });

  it('should show the doc list when a valid engine url is provided', async () => {
    // Check that the doc-list is rendered correctly.
    await page.goto(correctEngineUrl, { timeout: 60000, waitUntil: 'networkidle0' });
    await page.waitForSelector('.doc-list');
    let img = await page.screenshot({ fullPage: true });
    await expect(img).to.matchImageOf('valid-engine-doc-list', OPTS);

    // Verify that clicking on an app opens it.
    // await page.click('.doc-list > li');
    await Promise.all([
      page.click('.doc-list > li'),
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    ]);

    await waitUntilNoRequests(500);

    // This seems to be the last elements to render, the text inside the columns.
    await page.waitForSelector('.name-and-text > .bartext', { visible: true });

    img = await page.screenshot({ fullPage: true });
    await expect(img).to.matchImageOf('loaded-app', OPTS);
  });
});
