const host = process.env.CI === 'true' ? 'localhost' : 'host.docker.internal';
const engine = process.env.CI === 'true' ? 'localhost' : 'qix-engine';
const app = process.env.DocID || 'drugcases.qvf';

const url = `http://${host}:1234/?engine_url=ws://${engine}:9076/${app}`;
const OPTS = {
  artifactsPath: 'test/e2e/__artifacts__/',
};

describe('catwalk', () => {
  it('should render the selections correctly', async () => {
    await page.goto(url, { timeout: 60000, waitUntil: 'networkidle0' });
    await page.waitFor(4000);
    await page.click('[fieldz=Key_Ind_Drug]');
    await page.click('[title="\'10003554-1\' (No numerical representation)"]');
    const img = await page.screenshot({ fullPage: true });
    return expect(img).to.matchImageOf('selection', OPTS);
  });
});
