/* eslint-disable no-labels,  no-unused-labels, no-restricted-syntax */
javascript: (function bookmark() {
  const getAppId = (location) => {
    let prefix = '';
    let start = -1;
    for (const p of ['/sense/app/', '/dataloadeditor/app/', '/datamodelviewer/app/']) {
      start = location.pathname.indexOf(p);
      if (start > -1) {
        prefix = p;
        break;
      }
    }
    if (start === -1) return undefined;
    start += prefix.length;
    const end = location.pathname.indexOf('/', start);
    const appId = location.pathname.substring(start, end !== -1 ? end : location.pathname.length);
    return appId;
  };
  const appId = getAppId(window.location);
  if (appId) {
    const { hostname } = window.location;
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    const port = window.location.port === '' ? '' : `:${window.location.port}`;

    const engineUrl = `${protocol}://${hostname}${port}/app/${appId}`;
    const url = `http://catwalk.core.qlik.com/?engine_url=${engineUrl}`;
    window.open(url, '_blank');
  } else {
    const url = 'http://catwalk.core.qlik.com';
    window.open(url, '_blank');
  }
}());
