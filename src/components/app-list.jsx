import React, { useState } from 'react';
import usePromise from 'react-use-promise';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import useBackend from './use/use-backend';

const useDocList = (global) => usePromise(() => (global ? global.getDocList() : null), [global]);

export default function AppList({ webIntegrationId, global, engineURL }) {
  const [hasMore, setHasMore] = useState(true);
  const [next, setNext] = useState('/v1/items?limit=10');
  const [apps, setApps] = useState([]);
  let appsResponse;
  let error;
  let isLoading;
  let loadApps;
  if (webIntegrationId) {
    // QCS/QSEoK
    [appsResponse, error, isLoading, , loadApps] = useBackend({ url: `${next}`, manual: true });
  } else if (global) {
    // Qlik Core/QSEoW/QS Desktop
    [appsResponse, error] = useDocList(global);
  }

  function updateEngineURL(url, appId) {
    let URLobject = new URL(url);
    let path = URLobject.pathname.length > 1 ? URLobject.pathname : '';
    if (appId.includes(path)) {
      path = null;
    }
    if (path && path.charAt(path.length - 1) !== '/') {
      path += '/';
    }
    URLobject = `${URLobject.origin}${path || ''}${appId}${URLobject.search}`;
    window.location.assign(`${window.location.protocol}//${window.location.host}?engine_url=${URLobject}`);
  }

  // TODO: fix empty doc list
  // if (tempArray.length < 1) {
  //   throw new Error('Empty doc list');
  // }

  function loadMoreRows() {
    if (!isLoading && webIntegrationId) {
      loadApps();
    }
  }

  if (error) {
    throw (error);
  }

  if (appsResponse && !isLoading) {
    const tempApps = apps;
    if (webIntegrationId) {
      if (!apps.some((a) => a.id === appsResponse.data[0].resourceId)) {
        appsResponse.data.map((app) => tempApps.push({ name: app.name, id: app.resourceId, description: app.resourceAttributes.description }));
        if (appsResponse.links.next.href) {
          const t = appsResponse.links.next.href.substring(appsResponse.links.next.href.indexOf('/v1'));
          setNext(t);
          setApps(tempApps);
        } else {
          setHasMore(false);
        }
      }
    } else if (global) {
      if (!apps.some((a) => a.id === appsResponse[0].qDocId)) {
        appsResponse.forEach((app) => tempApps.push({ name: app.qTitle, id: app.qDocId, description: app.qMeta.description }));
        setApps(tempApps);
        setHasMore(false);
      }
    }
  }
  const loader = <div className="loader">Loading ...</div>;
  const items = [];
  if (apps.length > 0) {
    apps.map((app) => items.push(
      <li key={app.id} onClick={() => updateEngineURL(engineURL, app.id)}>
        <i className="icon" />
        <span className="title">
          <b>{app.name}</b>
          {' '}
    (
          {app.description || 'No description'}
    )
        </span>
      </li>,
    ));
  }

  return (
    <div className="info">
      <p>Connection to the websocket was successful, but there is no open app. Choose one below:</p>
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMoreRows}
        hasMore={hasMore}
        loader={loader}
      >
        <ul className="doc-list">
          {items}
        </ul>
      </InfiniteScroll>
    </div>
  );
}

AppList.propTypes = {
  webIntegrationId: PropTypes.string,
  global: PropTypes.object,
  engineURL: PropTypes.string,
};

AppList.defaultProps = {
  webIntegrationId: null,
  global: null,
  engineURL: null,
};
