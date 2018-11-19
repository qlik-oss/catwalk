import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';

import ErrorBoundary from './components/error-boundary';
import App from './components/app';

import './index.pcss';

if (process.env.GA) {
  ReactGA.initialize(process.env.GA);
  ReactGA.pageview(window.location.pathname + window.location.search);
}


const Index = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

ReactDOM.render(<Index />, document.getElementById('root'));

if (module.hot) {
  // used for hot module replacement during development:
  module.hot.accept();
}
