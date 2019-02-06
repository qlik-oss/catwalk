javascript: (function () {
  const { hostname } = window.location;

  const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
  const getAppId = (location) => {
    const prefix = '/sense/app/';
    const start = location.pathname.indexOf(prefix) + prefix.length;
    const end = location.pathname.indexOf('/', start);
    const appId = location.pathname.substring(start, end !== -1 ? end : location.pathname.length);
    return appId;
  };
  const appId = getAppId(window.location);
  const engineUrl = `${protocol}://${hostname}:9076/app/${appId}`;
  const url = `http://catwalk.core.qlik.com/?engine_url=${engineUrl}`;
  window.open(url, '_blank');
}());
