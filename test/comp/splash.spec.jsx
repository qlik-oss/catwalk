import React from 'react';
import renderer from 'react-test-renderer';
import Splash from '../../src/components/splash';
import AppList from '../../src/components/app-list';
import ErrorInfo from '../../src/components/error-info';

describe('Splash', () => {
  it('should render docList correctly', () => {
    // const docs = [{
    //   qDocId: '/data/Consumer_Sales.qvf', qMeta: { description: 'See through the eyes of a consumer goods company.  Analyze sales data by sales rep, by region, by product, etc.' }, qTitle: 'Consumer_Sales',
    // }, {
    //   qDocId: '/data/drugcases.qvf', qMeta: { description: 'This Dashboard is based on the 2015 Q4 data.' }, qTitle: 'FDA - Drug Cases',
    // }, {
    //   qDocId: '/data/New_QVNCycles_with_measures_dimensions_visualizations_.qvf', qMeta: { description: 'An app with some measures and dimensions and master visualizations.\nTexten finns också på skånska.' }, qTitle: 'New_QVNCycles_with_measures_dimensions_visualizations_',
    // }];
    const error = null;
    const engineURL = '';

    const tree = renderer.create(<Splash
      error={error}
      engineURL={engineURL}
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should show <AppList />', () => {
    const error = null;
    const engineURL = '';
    const fetchDockList = true;

    const instance = renderer.create(<Splash
      error={error}
      engineURL={engineURL}
      fetchDocList={fetchDockList}
    />).root;

    expect(instance.findByType(AppList)).to.exist;
    let didThrow;
    try {
      instance.findByType(ErrorInfo);
    } catch (error) {
      didThrow = true;
    }
    expect(didThrow).to.be.true;
  });

  it('should not show <AppList /> when having error', () => {
    const error = new Error('An error occurred');
    const engineURL = '';

    const instance = renderer.create(<Splash
      error={error}
      engineURL={engineURL}
    />).root;

    expect(instance.findByType(ErrorInfo)).to.exist;

    let didThrow;
    try {
      instance.findByType(AppList);
    } catch (error) {
      didThrow = true;
    }
    expect(didThrow).to.be.true;
  });

  it('should show AppList even though error is provided', () => {
    const error = new Error('An error occurred');
    const engineURL = '';
    const fetchDockList = true;

    const instance = renderer.create(<Splash
      error={error}
      engineURL={engineURL}
      fetchDocList={fetchDockList}
    />).root;

    expect(instance.findByType(AppList)).to.exist;
    let didThrow;
    try {
      instance.findByType(ErrorInfo);
    } catch (error) {
      didThrow = true;
    }
    expect(didThrow).to.be.true;
  });
  // it('should display message if empty docList array', () => {
  //   const docs = [];
  //   const error = null;
  //   const engineURL = '';

  //   const tree = renderer.create(<Splash
  //     docs={docs}
  //     error={error}
  //     engineURL={engineURL}
  //   />).toJSON();

  //   expect(tree).toMatchSnapshot();
  // });
});
