import React from 'react';
import renderer from 'react-test-renderer';

describe('<AppList />', () => {
  it('should render app list correctly', () => {
    const [{ default: AppList }] = aw.mock(
      [
        ['**/use/use-backend.jsx', () => () => [{
          data: [
            { resourceId: '0ea199f3-7edc-4d17-87d2-1e68814b4c6d', name: 'FDA - Drug Cases', resourceAttributes: { description: 'This Dashboard is based on the 2015 Q4 data.' } },
            { resourceId: '909c5376-e4ed-40aa-811b-bd7fff0d49da', name: 'Consumer_Sales', resourceAttributes: { description: 'See through the eyes of a consumer goods company.  Analyze sales data by sales rep, by region, by product, etc.' } },
          ],
          links: { next: { href: '' } },
        }, undefined, false, {}, undefined]],
      ],
      ['../../src/components/app-list'],
    );

    const instance = renderer.create(<AppList
      webIntegrationId="_z1RQ2iES7rms1m9TgN5W2B1VFBpl8P5"
      global={null}
      engineURL=""
    />).toJSON();

    expect(instance).toMatchSnapshot();
  });

  it('should call openDoc if having a global', () => {
    const [{ default: AppList }] = aw.mock(
      [
        ['**/use/doc-list.jsx', () => () => [[{
          qDocId: '/data/New_QVNCycles_with_measures_dimensions_visualizations_.qvf', qMeta: { description: 'An app with some measures and dimensions and master visualizations.\nTexten finns också på skånska.' }, qTitle: 'New_QVNCycles_with_measures_dimensions_visualizations_',
        }], undefined]],
      ],
      ['../../src/components/app-list'],
    );
    const instance = renderer.create(<AppList
      webIntegrationId=""
      global={{ id: 'some-nice-global-object' }}
      engineURL=""
    />).toJSON();

    expect(instance).toMatchSnapshot();
  });

  it('should display message if no apps available', () => {
    const [{ default: AppList }] = aw.mock(
      [
        ['**/use/doc-list.jsx', () => () => [[], undefined]],
      ],
      ['../../src/components/app-list'],
    );

    let error;
    try {
      renderer.create(<AppList
        webIntegrationId=""
        global={{ id: 'some-nice-global-object' }}
        engineURL=""
      />);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.equal('Empty doc list');
  });
});
