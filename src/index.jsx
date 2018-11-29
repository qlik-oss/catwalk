import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import CookieConsent from 'react-cookie-consent';

import ErrorBoundary from './components/error-boundary';
import App from './components/app';

import './index.pcss';

if (process.env.GA) {
  ReactGA.initialize(process.env.GA);
  ReactGA.pageview(window.location.pathname + window.location.search);

  window.addEventListener('error', (event) => {
    ReactGA.exception({
      description: `ERROR: ${JSON.stringify(event, Object.getOwnPropertyNames(event))}`,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    ReactGA.exception({
      description: `UNHANDLED REJECTION: ${JSON.stringify(event.reason, Object.getOwnPropertyNames(event.reason))}`,
    });
  });
}


const Index = () => (
  <ErrorBoundary>
    <App />
    <CookieConsent
      buttonText="Got it!"
      style={{ background: '#5F6062', color: '#D6D6D6', fontSize: '2rem' }}
      buttonStyle={{ color: '#fff', background: '#3D8706', fontSize: '2rem' }}
    >
      This website uses cookies to ensure you get the best experience on our website.
      {' '}
      <a href="https://www.qlik.com/us/legal/cookies-and-privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#D6D6D6' }}>Learn more</a>
    </CookieConsent>
  </ErrorBoundary>
);

ReactDOM.render(<Index />, document.getElementById('root'));

if (module.hot) {
  // used for hot module replacement during development:
  module.hot.accept();
}
