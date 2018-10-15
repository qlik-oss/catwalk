import React from 'react';
import ReactDOM from 'react-dom';

import ErrorBoundary from './components/error-boundary';
import App from './components/app';

import './index.css';

// expose React globally, we need this to avoid
// it being removed by the experimental treeshaking
// algorithm in parcel:
window.React = React;

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
