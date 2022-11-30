import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';

import CatWithBubble from './cat-with-bubble';
import logo from '../assets/catwalk.svg';
import catwalkAway from '../assets/catwalk-away.svg';
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
  let contentLogo = { className: 'logo', svg: logo };

  const speechBubbleClick = () => {
    assignEngineUrl(demoApp);
  };

  const webIntegrationId = getWebIntegrationId(document.location);
  const showError = error && !fetchDocList;
  if (showError) {
    contentLogo = { className: 'error-logo', svg: catwalkAway };
  }
  return (
    <>
      <div style={{ padding: '5px 10px', fontSize: '1.5rem' }}>
        <span style={{ color: 'red' }}>&#9888;</span>
        {' '}
        This project is no longer maintained. If you are interested in working on the project you can still create a fork of it on Github. This web-app will be shut down in February 2023.
        <hr />
      </div>
      <div className="center-content">
        <div className="splash">
          <SVGInline className={contentLogo.className} svg={contentLogo.svg} />
          { fetchDocList
            && <AppList webIntegrationId={webIntegrationId} global={global} engineURL={engineURL} />}
          {
  showError
  && <ErrorInfo error={error} engineURL={engineURL} />
}
        </div>
      </div>
      <CatWithBubble
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
