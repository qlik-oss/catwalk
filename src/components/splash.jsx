import React from 'react';
import PropTypes from 'prop-types';

import SVGcatWithBubble from './cat-with-bubble';
import SVGlogo from '../assets/catwalk.svg';
import demoApp from '../demo-app';
import { getWebIntegrationId, assignEngineUrl } from '../util';
import AppList from './app-list';
import ErrorInfo from './error-info';
import './splash.pcss';

export default function Splash({
  error = null,
  engineURL = '',
  global,
  fetchDocList,
}) {
  let contentLogo = { className: 'logo' };

  const speechBubbleClick = () => {
    assignEngineUrl(demoApp);
  };

  const webIntegrationId = getWebIntegrationId(document.location);
  const showError = error && !fetchDocList;
  if (showError) {
    contentLogo = { className: 'error-logo' };
  }
  return (
    <>
      <div className="center-content">
        <div className="splash">
          <SVGlogo className={contentLogo.className} />
          { fetchDocList
            && <AppList webIntegrationId={webIntegrationId} global={global} engineURL={engineURL} />}
          {
  showError
  && <ErrorInfo error={error} engineURL={engineURL} />
}
        </div>
      </div>
      <SVGcatWithBubble
        text="Click my speech bubble to open the demo app."
        onClick={speechBubbleClick}
        width="7em"
      />
    </>
  );
}

Splash.propTypes = {
  error: PropTypes.object,
  engineURL: PropTypes.string,
  global: PropTypes.object,
  fetchDocList: PropTypes.bool,
};

Splash.defaultProps = {
  error: null,
  engineURL: '',
  global: null,
  fetchDocList: false,
};
