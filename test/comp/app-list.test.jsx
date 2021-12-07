import React from 'react';
import renderer from 'react-test-renderer';
import useRest from '../../src/components/use/rest';
import useDocList from '../../src/components/use/doc-list';
import AppList from '../../src/components/app-list';

jest.mock('../../src/components/use/rest', () => jest.fn());
jest.mock('../../src/components/use/doc-list', () => jest.fn());

describe('<AppList />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render app list correctly', () => {
    useRest.mockImplementation(() => [
      {
        data: [
          { resourceId: '0ea199f3-7edc-4d17-87d2-1e68814b4c6d', name: 'FDA - Drug Cases', resourceAttributes: { description: 'This Dashboard is based on the 2015 Q4 data.' } },
          { resourceId: '909c5376-e4ed-40aa-811b-bd7fff0d49da', name: 'Consumer_Sales', resourceAttributes: { description: 'See through the eyes of a consumer goods company.  Analyze sales data by sales rep, by region, by product, etc.' } },
        ],
        links: { next: { href: '' } },
      },
      undefined,
      false,
      {},
      undefined,
    ]);
    const instance = renderer.create(<AppList
      webIntegrationId="_z1RQ2iES7rms1m9TgN5W2B1VFBpl8P5"
      global={null}
      engineURL=""
    />).toJSON();

    expect(instance).toMatchSnapshot();
  });

  it('should call openDoc if having a global', () => {
    useDocList.mockImplementation(() => [[{
      qDocId: '/data/New_QVNCycles_with_measures_dimensions_visualizations_.qvf', qMeta: { description: 'An app with some measures and dimensions and master visualizations.\nTexten finns också på skånska.' }, qTitle: 'New_QVNCycles_with_measures_dimensions_visualizations_',
    }], undefined]);
    const instance = renderer.create(<AppList
      webIntegrationId=""
      global={{ id: 'some-nice-global-object' }}
      engineURL=""
    />).toJSON();

    expect(instance).toMatchSnapshot();
  });

  it('should display message if no apps available', () => {
    useDocList.mockImplementation(() => [[], undefined]);
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
    expect(error).not.toBeUndefined();
    expect(error.message).toEqual('Empty doc list');
  });
});
