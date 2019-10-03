import schema from 'enigma.js/schemas/12.170.2.json';

import layoutCache from './layout-cache';
import getDoc from './get-doc';
import { reloadInProgressInterceptor } from './reload-in-progress-interceptor';
import demoApp from '../demo-app';

const ERR_ABORTED = 15;

// prio 1. Use engine_url, if any
let engineUrl = new URLSearchParams(document.location.search).get('engine_url');

// This is when no engine_url is provided.
if (!engineUrl) {
  if (engineUrl !== '') {
    // prio 2. Is websocketUrl stored in localstorage?
    // or last call, use default apps.core.qlik.com
    const storedWSUrl = localStorage.getItem('websocketUrl');
    engineUrl = storedWSUrl || demoApp;
    window.location.assign(`${window.location.protocol}//${window.location.host}?engine_url=${engineUrl}`);
  }
} else {
  // TODO: snygga upp config
  const paramIndex = document.location.search.indexOf('engine_url');
  const engineUrlWParams = document.location.search.slice(paramIndex + 11, document.location.search.length);
  const newUrl = new URL(engineUrlWParams);
  if (newUrl.search) {
    const params = newUrl.search.slice(1, newUrl.search.length);
    const path = newUrl.pathname;
    let engineFullUrl = new URL(`${newUrl.origin + path}?${params}`);
    engineFullUrl = encodeURI(engineFullUrl);
    engineUrl = engineFullUrl.toString();
  }
}

const config = {
  schema,
  url: engineUrl,
  createSocket: (url) => new WebSocket(url),
  mixins: [...layoutCache, getDoc],
  responseInterceptors: [reloadInProgressInterceptor, {
    onRejected(session, request, error) {
      if (error.code === ERR_ABORTED) {
        return request.retry();
      }
      throw error;
    },
  }],
};

module.exports = config;
