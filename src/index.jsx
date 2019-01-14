import React from 'react';
import ReactDOM from 'react-dom';


import ErrorBoundary from './components/error-boundary';
import App from './components/app';
import UseErrorReporting from './components/error-reporting';

import './index.pcss';

const Index = () => (
  <ErrorBoundary>
    <App />
    <UseErrorReporting GA={process.env.GA} />
  </ErrorBoundary>
);

ReactDOM.render(<Index />, document.getElementById('root'));

if (module.hot) {
  // used for hot module replacement during development:
  module.hot.accept();
}
