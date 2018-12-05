import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';

import logo from '../assets/catwalk.svg';
import catwalkAway from '../assets/catwalk-away.svg';

import './splash.pcss';

export default function Splash({
  docs = null,
  error = null,
  componentStack = '',
  engineURL = '',
}) {
  let contentLogo = { className: 'logo', svg: logo };
  let content;

  function updateEngineURL(url, appId) {
    let newURL = url;
    if (appId) {
      // Adding slash to support doclist for sense Desktop
      const UniformedAppId = appId.charAt(0) === '/' ? appId : `/${appId}`;
      newURL = `${new URL(newURL).origin}${UniformedAppId}`;
    }
    window.history.replaceState({}, '', `${window.location.pathname}?engine_url=${encodeURI(newURL)}`);
    window.location.reload(false);
  }

  const form = (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        updateEngineURL(evt.target[0].value);
      }}
    >
      <label htmlFor="engineURL">
        <input id="engineURL" type="text" defaultValue={engineURL} />
      </label>
      <input type="submit" value="Connect" />
    </form>
  );

  if (Array.isArray(docs) && docs.length) {
    content = (
      <div>
        <p>WebSocket connected, but no open app. Choose one below:</p>
        <ul className="doc-list">
          {docs.map(doc => (
            <li onClick={() => updateEngineURL(engineURL, doc.qDocId)} key={doc.qDocId}>
              <i className="icon" />
              <span className="title">
                <b>{doc.qTitle}</b>
                {' '}
(
                {doc.qMeta.description || 'No description'}
)
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (Array.isArray(docs)) {
    content = (
      <div>
        <p>WebSocket connected but no open app, in addition the app list was empty.</p>
        <p>Please make sure there are apps accessible on this engine and reload the page, or connect to another one:</p>
        {form}
      </div>
    );
  } else if (!engineURL || (error && error.target && error.target.constructor.name === 'WebSocket')) {
    content = (
      <div>
        <p>WebSocket connection failed. Please pass in a valid WebSocket URL below:</p>
        {form}
      </div>
    );
  } else if (error) {
    contentLogo = { className: 'error-logo', svg: catwalkAway };
    content = (
      <div>
        <pre><code>{error.stack}</code></pre>
        <pre><code>{componentStack}</code></pre>
      </div>
    );
  }

  if (content) {
    return (
      <div className="center-content">
        <div className="splash">
          <SVGInline {...contentLogo} />
          <h3>Taking your Qlik data models to stage</h3>
          {content}
        </div>
      </div>
    );
  }

  return null;
}

Splash.propTypes = {
  docs: PropTypes.array,
  error: PropTypes.object,
  componentStack: PropTypes.string,
  engineURL: PropTypes.string,
};

Splash.defaultProps = {
  docs: null,
  error: null,
  componentStack: '',
  engineURL: '',
};
