import schema from 'enigma.js/schemas/12.170.2.json';

import listCache from './list-cache';
import layoutCache from './layout-cache';
import getDoc from './get-doc';
import { reloadInProgressInterceptor } from './reload-in-progress-interceptor';

const ERR_ABORTED = 15;

const config = {
  schema,
  url: new URLSearchParams(document.location.search).get('engine_url') || `ws://localhost:9076/app/${+new Date()}`,
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
