import { useState, useEffect } from 'react';

const ERR_RELOAD_IN_PROGRESS = 11000;
let retryCalls = [];
let wasInReloadOnStartup;
let reloadInProgress;
let setReloadInProgress;

function useReloadInProgress(app) {
  [reloadInProgress, setReloadInProgress] = useState(wasInReloadOnStartup);
  useEffect(() => {
    if (!app) return null;

    const modelChanged = () => {
      if (reloadInProgress) {
        setReloadInProgress(false);
        retryCalls.forEach(retryCall => retryCall());
        retryCalls = [];
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
          if (!reloadInProgress) {
            setReloadInProgress(true);
          }
          setTimeout(() => {
            retry();
          }, 500);
        }
      }
    }

    setTimeout(() => {
      retry();
    }, 500);
  }));
}
const interceptor = {
  onRejected(session, request, error) {
    if (error.code === ERR_RELOAD_IN_PROGRESS) {
      if (!reloadInProgress) {
        if (setReloadInProgress) {
          setReloadInProgress(true);
        } else {
          wasInReloadOnStartup = true;
        }
      }
      if (request.method === 'GetActiveDoc' || request.method === 'OpenDoc') {
        return retryUsingTimeouts(request);
      }
    }
    throw error;
  },
};

export default {
  useReloadInProgress,
  interceptor,
};
