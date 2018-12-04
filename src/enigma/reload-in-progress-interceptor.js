import { useState, useEffect } from 'react';

export const ERR_RELOAD_IN_PROGRESS = 11000;
const RETRY_INTERVAL = 500;
let wasInReloadOnStartup;
let reloadInProgress;
let setReloadInProgress;

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export function useReloadInProgress(app) {
  [reloadInProgress, setReloadInProgress] = useState(wasInReloadOnStartup);
  useEffect(() => {
    if (!app) return null;

    const modelChanged = async () => {
      try {
        await app.getAppLayout();
        if (reloadInProgress) {
          setReloadInProgress(false);
        }
        // When a change is triggered by a reload the getAppLayout sometimes resolve quick enough to not throw a reload in progress error, so call it
        // once more to increase the likelyhood a bit. If this too fails any interaction will immediately pop up the reload in progress dialog
        await sleep(1000);
        await app.getAppLayout();
      } catch (err) {
        if (err.code === ERR_RELOAD_IN_PROGRESS) {
          if (!reloadInProgress) {
            setReloadInProgress(true);
          }
        }
      }
    };

    app.on('changed', modelChanged);
    modelChanged();

    return () => {
      app.removeListener('changed', modelChanged);
    };
  }, [app && app.id]);

  return reloadInProgress;
}

function retryUsingTimeouts(request) {
  return new Promise(((resolve/* , reject */) => {
    async function retry() {
      try {
        const res = await request.retry();
        resolve(res);
      } catch (err) {
        if (err.code === ERR_RELOAD_IN_PROGRESS) {
          setTimeout(() => {
            retry();
          }, RETRY_INTERVAL);
        }
      }
    }

    setTimeout(() => {
      retry();
    }, RETRY_INTERVAL);
  }));
}
export const reloadInProgressInterceptor = {
  onRejected(session, request, error) {
    if (error.code === ERR_RELOAD_IN_PROGRESS) {
      if (!reloadInProgress) {
        if (setReloadInProgress) {
          setReloadInProgress(true);
        } else {
          wasInReloadOnStartup = true;
        }
      }
      if (request.method === 'GetActiveDoc'
        || request.method === 'OpenDoc'
         || request.method === 'CreateSessionObject') {
        return retryUsingTimeouts(request);
      }
    }
    throw error;
  },
};
