javascript: (function () {
  const getAppId = (location) => {
    const prefix = '/sense/app/';
    let start = location.pathname.indexOf(prefix);
    if (start === -1) return;
    start += prefix.length;
    const end = location.pathname.indexOf('/', start);
    const appId = location.pathname.substring(start, end !== -1 ? end : location.pathname.length);
    return appId;
  };
  const appId = getAppId(window.location);
  if (appId) {
    const { hostname } = window.location;
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    const port = window.location.port === '' ? '': `:${window.location.port}`;

    const engineUrl = `${protocol}://${hostname}${port}/app/${appId}`;
    const url = `http://catwalk.core.qlik.com/?engine_url=${engineUrl}`;
    window.open(url, '_blank');
  } else {
    const url = 'http://catwalk.core.qlik.com';
    window.open(url, '_blank');
  }
}());
