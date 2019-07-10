import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import Collapsible from 'react-collapsible';

import CatWithBubble from './cat-with-bubble';
import logo from '../assets/catwalk.svg';
import catwalkAway from '../assets/catwalk-away.svg';
import demoApp from '../demo-app';

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
    const URLobject = new URL(url);
    const protocol = URLobject.protocol === 'ws:' ? 'http://' : 'https://';
    let newURL = url;

    if (appId) {
      // Adding slash to support doclist for sense Desktop
      const UniformedAppId = appId.charAt(0) === '/' ? appId : `/${appId}`;
      newURL = `${URLobject.origin}${UniformedAppId}`;
    }
    window.location.assign(`${protocol}${window.location.host}?engine_url=${encodeURI(newURL)}`);
  }

  const form = (
    <form
      className="url-form centered-content"
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

  const learnMore = (
    <Collapsible trigger="Learn more">
      <h3>General</h3>
      <p>Make sure that you have the right privileges to list apps or view the app.</p>
      <h3>Engine running in Docker container</h3>
      <p>
        For connecting to an Engine running in a Docker container with a mounted data volume containing the app and starting
        engine with <strong>DocumentDirectory=&lt;data-folder&gt;</strong>, the websocket URL will
        be <strong>ws://&lt;host&gt;:&lt;port&gt;/&lt;data-folder/&lt;app&gt;</strong>. E.g. <strong>ws://localhost:9076/data/my-excellent-app</strong>.
      </p>
      <h3>Qlik Sense Enterprise on Windows</h3>
      <p>
        For connecting to a Qlik Sense Enterprise on Windows using default virtual proxy, the websocket URL will
        be <strong>wss://&lt;sense-host.com&gt;/app/&lt;app-GUID&gt;</strong>. If using a custom virtual proxy the
        websocket URL will need to reflect this. Also note that for the Sense Proxy to allow sessions from catwalk,
        catwalk needs to be whitelisted in Qlik Sense Enterprise.
      </p>
      <p>
        Make sure that you are logged in to Qlik Sense in another browser tab/window. This is needed in order for catwalk
        to use the X-Qlik-Session cookie and attach to the session.
      </p>
      <h3>Qlik Sense Desktop</h3>
      <p>
        For connecting to a Qlik Sense Desktop, the websocket URL will be <strong>ws://localhost:4848/app/&lt;app-name&gt;</strong>.
      </p>
    </Collapsible>
  );

  if (Array.isArray(docs) && docs.length) {
    content = (
      <div className="info">
        <p>Websocket connected, but no open app. Choose one below:</p>
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
      <div className="center-text info">
        <p>Websocket connected but the app list was empty.</p>
        <p>Please make sure there are apps accessible on this engine and reload the page, or connect to another one:</p>
        {form}
      </div>
    );
  } else if (error && error.target && error.target.constructor.name === 'WebSocket') {
    content = (
      <div className="center-text info">
        <p>Websocket connection failed. Please enter a valid websocket URL:</p>
        {form}
        {learnMore}
      </div>
    );
  } else if (!engineURL) {
    content = (
      <div className="center-text info">
        <p>Could not find any valid websocket URL. Please enter a websocket URL:</p>
        {form}
        {learnMore}
      </div>
    );
  } else if (error) {
    contentLogo = { className: 'error-logo', svg: catwalkAway };
    content = (
      <div className="center-text info">
        <pre className="centered-content"><code>{error.stack}</code></pre>
        <pre className="centered-content"><code>{componentStack}</code></pre>
        {learnMore}
      </div>
    );
  }

  const speechBubbleClick = () => {
    if (window.location) {
      const URLobject = new URL(window.location.href);
      window.location.assign(`${URLobject.protocol}//${window.location.host}?engine_url=${demoApp}`);
    }
  };

  if (content) {
    return (
      <React.Fragment>
        <div className="center-content">
          <div className="splash">
            <SVGInline {...contentLogo} />
            {content}
          </div>
        </div>
        <CatWithBubble
          text="Click my speech bubble to open the demo app."
          onClick={speechBubbleClick}
          width="7em"
        />
      </React.Fragment>
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
