import schema from 'enigma.js/schemas/12.170.2.json';

import layoutCache from './layout-cache';
import getDoc from './get-doc';
import { reloadInProgressInterceptor } from './reload-in-progress-interceptor';
import demoApp from '../demo-app';
import { assignEngineUrl, convertProtocol } from '../util';

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
    assignEngineUrl(engineUrl);
  }
} else {
  const paramIndex = document.location.search.indexOf('engine_url');
  const newUrl = new URL(document.location.search.slice(paramIndex + 11, document.location.search.length));
  if (newUrl.search) {
    const params = newUrl.search.slice(1, newUrl.search.length);
    const path = newUrl.pathname;
    engineUrl = encodeURI(new URL(`${newUrl.origin + path}?${params}`)).toString();
  }
  if (engineUrl.toLowerCase().startsWith('http' || 'https')) {
    engineUrl = convertProtocol(engineUrl);
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

export default config;
