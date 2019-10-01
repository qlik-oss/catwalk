import React from 'react';
import renderer from 'react-test-renderer';
import AppList from '../../src/components/app-list';

describe.only('AppList', () => {
  it('should render app list correctly', () => {
    const [useBackend] = aw.mock(
      [['**/use/use-backend.jsx', () => {[{data: []}, {}, false, {}, () => console.log('loadmore')]}]],
      // ['../../src/components/use/use-backend'],
      [],
    );
    const instance = renderer.create(<AppList
      webIntegrationId = {'nice-guid'}
      global = {null}
      engineURL={''}
    />).toJSON();
    expect(instance).toMatchSnapshot();
        
  });
});
