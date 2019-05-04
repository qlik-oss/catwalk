import schema from 'enigma.js/schemas/12.170.2.json';

import layoutCache from './layout-cache';
import getDoc from './get-doc';
import { reloadInProgressInterceptor } from './reload-in-progress-interceptor';
import demoApp from '../demo-app';

const ERR_ABORTED = 15;

// prio 1. Use engine_url, if any
let engineUrl = new URLSearchParams(document.location.search).get('engine_url');
// if the engine_url is there, but empty, show field to enter ws.
if (!engineUrl && engineUrl !== '') {
  // prio 2. Is websocketUrl stored in localstorage?
  const storedWSUrl = localStorage.getItem('websocketUrl');
  if (storedWSUrl) {
    engineUrl = storedWSUrl;
  } else {
    // last call, use default apps.core.qlik.com
    engineUrl = demoApp;
  }
}
const config = {
  schema,
  url: engineUrl,
  createSocket: url => new WebSocket(url),
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
