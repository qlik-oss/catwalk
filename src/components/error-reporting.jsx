import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import CookieConsent from 'react-cookie-consent';

const sendException = (event) => {
  let message;

  if (event.type === 'unhandledrejection') {
    message = `UNHANDLED REJECTION: ${JSON.stringify(event.reason, Object.getOwnPropertyNames(event.reason))}`;
  } else {
    message = `ERROR: ${JSON.stringify(event, Object.getOwnPropertyNames(event))}`;
  }

  ReactGA.exception({
    description: message,
  });
};

export default function useErrorReporting({ GA }) {
  useEffect(() => {
    if (GA) {
      ReactGA.initialize(GA);
      ReactGA.pageview(window.location.pathname + window.location.search);
    }

    window.addEventListener('error', sendException);
    window.addEventListener('unhandledrejection', sendException);

    return () => {
      window.removeEventListener('error', sendException);
      window.removeEventListener('unhandledrejection', sendException);
    };
  }, [GA]);

  return (
    <CookieConsent
      buttonText="Got it!"
      style={{ background: '#5F6062', color: '#D6D6D6', fontSize: '2rem' }}
      buttonStyle={{ color: '#fff', background: '#3D8706', fontSize: '2rem' }}
    >
      This website uses cookies to ensure you get the best experience on our website.
      {' '}
      <a href="https://www.qlik.com/us/legal/cookies-and-privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#D6D6D6' }}>Learn more</a>
    </CookieConsent>
  );
}

useErrorReporting.propTypes = {
  GA: PropTypes.string,
};

useErrorReporting.defaultProps = {
  GA: null,
};
