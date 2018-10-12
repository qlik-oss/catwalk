import schema from 'enigma.js/schemas/12.20.0.json';

import listCache from './list-cache';
import layoutCache from './layout-cache';

const ERR_ABORTED = 15;
const url = process.env.ENGINE_URL;

const config = {
  schema,
  createSocket: () => new WebSocket(url || `ws://${location.hostname}:9076/app/${+new Date()}`), // eslint-disable-line
  mixins: [listCache, layoutCache],
  responseInterceptors: [{
    onRejected(session, request, error) {
      if (error.code === ERR_ABORTED) {
        return request.retry();
      }
      throw error;
    },
  }],
};

module.exports = config;
