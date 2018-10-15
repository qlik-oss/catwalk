import schema from 'enigma.js/schemas/12.170.2.json';

import listCache from './list-cache';
import layoutCache from './layout-cache';

const searchParams = new URLSearchParams(document.location.search);
const hostname = searchParams.get('hostname') || 'localhost';
const port = searchParams.get('port') || '9076';
const app = searchParams.get('app') || 'enginedata';

const ERR_ABORTED = 15;

const config = {
  schema,
  app,
  createSocket: () => new WebSocket(`ws://${hostname}:${port}/app/engineData`),
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
