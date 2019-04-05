import schema from 'enigma.js/schemas/12.170.2.json';

import listCache from './list-cache';
import layoutCache from './layout-cache';
import getDoc from './get-doc';
import { reloadInProgressInterceptor } from './reload-in-progress-interceptor';

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
    engineUrl = 'wss://apps.core.qlik.com/app/doc/e9d5d8ce-5f17-4976-9da4-c67eb4efe805';
  }
}
const config = {
  schema,
  url: engineUrl,
  createSocket: url => new WebSocket(url),
  mixins: [listCache, ...layoutCache, getDoc],
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
