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
      <h3>Connect to a Qlik Core engine</h3>
      <p>
        For connecting to a Qlik Core engine running in a Docker container, with a mounted data volume containing the app and starting
        engine with
        {' '}
        <code>DocumentDirectory=&lt;data-folder&gt;</code>
, the websocket URL will
        be
        {' '}
        <code>ws://&lt;host&gt;:&lt;port&gt;/app/&lt;data-folder&gt;/&lt;app-name&gt;</code>
. E.g.
        {' '}
        <code>ws://localhost:9076/app/my-data-folder/my-excellent-app</code>
. For more info, visit
        {' '}
        <a href="https://core.qlik.com/services/qix-engine/apis/qix/introduction/#websockets">https://core.qlik.com/services/qix-engine/apis/qix/introduction/#websockets</a>
.
      </p>
      <h3>Qlik Sense Enterprise on Windows</h3>
      <p>
        For connecting to Qlik Sense Enterprise on Windows, the websocket URL will
        be
        {' '}
        <code>wss://&lt;sense-host.com&gt;/&lt;virtual-proxy-prefix&gt;/app/&lt;app-GUID&gt;</code>
. Note that for the Sense Proxy to allow sessions from catwalk,
        https://catwalk.core.qlik.com needs to be whitelisted in QMC in your Qlik Sense Enterprise on Windows deployment.
      </p>
      <p>
        Make sure that you are logged in to Qlik Sense in another browser tab/window. Then the browser tab running catwalk can use
        the session cookie and attach to the session.
      </p>
      <h3>Qlik Sense Desktop</h3>
      <p>
        For connecting to Qlik Sense Desktop, the websocket URL will be
        {' '}
        <code>ws://localhost:4848/app/&lt;app-name&gt;</code>
.
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
