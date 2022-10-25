import React from 'react';
import PropTypes from 'prop-types';
import Collapsible from 'react-collapsible';
import { assignEngineUrl, convertProtocol } from '../util';

export default function ErrorInfo({ error, engineURL }) {
  let showForm = true;
  let showMoreInfo = true;

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
      <h3>Qlik Cloud Services / Qlik Sense on Kubernetes</h3>
      <p>
        The websocket URL to Qlik Cloud Services will be
        {' '}
        <code>wss://&lt;tenant-url&gt;.&lt;region&gt;.qlikcloud.com/app/&lt;app-GUID&gt;?qlik-web-integration-id=&lt;web-integration-id&gt;</code>
        {' '}
        and for a custom Kubernetes deployment
        {' '}
        <code>wss://&lt;sense-on-kubernetes-host.com&gt;/app/&lt;app-GUID&gt;?qlik-web-integration-id=&lt;web-integration-id&gt;</code>
        . The
        {' '}
        <code>web-integration-id</code>
        {' '}
        must be present in order for Qlik Sense to confirm that the request derives from a whitelisted domain.
        For more info, visit
        {' '}
        <a href="https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/Admin/mc-adminster-web-integrations.htm">https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/Admin/mc-adminster-web-integrations.htm</a>
        .
      </p>
      <h3>Qlik Sense Enterprise on Windows</h3>
      <p>
        For connecting to Qlik Sense Enterprise on Windows, the websocket URL will
        be
        {' '}
        <code>wss://&lt;sense-host.com&gt;/&lt;virtual-proxy-prefix&gt;/app/&lt;app-GUID&gt;</code>
        . Note that for the Sense Proxy to allow sessions from catwalk,
        https://catwalk.qlik.dev needs to be whitelisted in QMC in your Qlik Sense Enterprise on Windows deployment.
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

  // TODO: gather all updateEngineURL functions.

  function updateEngineURL(url, appId) {
    let URLobject = new URL(url);
    const path = URLobject.pathname.length > 1 ? URLobject.pathname : '';
    const app = appId || '';
    URLobject = URLobject.origin + path + app + URLobject.search;
    assignEngineUrl(URLobject);
  }

  const urlChanged = (evt) => {
    document.getElementById('engineURL').value = convertProtocol(evt.target.value);
  };

  const form = (
    <form
      className="url-form centered-content"
      onSubmit={(evt) => {
        evt.preventDefault();
        updateEngineURL(evt.target[0].value);
      }}
    >
      <label htmlFor="engineURL">
        Websocket address
        <input id="engineURL" type="text" onChange={urlChanged} defaultValue={engineURL} placeholder="Enter a valid websocket address" />
        <input type="submit" value="Connect" />
      </label>
    </form>
  );

  let errorText = '';
  if (error.target && error.target.constructor.name === 'WebSocket') {
    errorText = (
      <>
        <p>Websocket connection failed.</p>
        <p>Please enter a valid websocket URL.</p>
      </>
    );
  } else if (error.message === 'Not connected') {
    errorText = (<p>Websocket connection failed. If using Qlik Sense Enterprise on Windows, please log in and try again, or connect to another websocket.</p>);
  } else if (error.message === 'Network Error') {
    errorText = (<p>A Network Error occurred, check the websocket address for spelling errors.</p>);
  } else if (error.message === 'Empty doc list') {
    errorText = (
      <>
        <p>Websocket connected but the app list was empty.</p>
        {' '}
        <p>Please make sure there are apps accessible on this engine and reload the page, or connect to another one.</p>
      </>
    );
  } else if (!engineURL) {
    errorText = (<p>No websocket URL is provided. For more information about the websocket URL see Learn more below.</p>);
  } else {
    showMoreInfo = false;
    showForm = false;
    errorText = (
      <pre className="centered-content"><code>{error.stack}</code></pre>
    );
    if (error.message.includes('WebSocket')) {
      showForm = true;
    }
  }
  return (
    <div className="center-text info">
      { errorText }
      { showForm && form }

      { showMoreInfo && learnMore}
    </div>
  );
}

ErrorInfo.propTypes = {
  error: PropTypes.object.isRequired,
  engineURL: PropTypes.string,
};

ErrorInfo.defaultProps = {
  engineURL: '',
};
