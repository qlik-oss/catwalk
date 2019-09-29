export function getWebIntegrationId() {
  let wid = new URLSearchParams(document.location.search).get('qlik-web-integration-id');
  if (!wid) {
    const params = new URLSearchParams(document.location.search).get('engine_url');
    if (params) {
      const urlObject = new URL(new URLSearchParams(document.location.search).get('engine_url'));
      wid = new URLSearchParams(urlObject.search).get('qlik-web-integration-id');
    }
  }
  return wid;
}

export function getTenantUrl() {
  const URLobject = new URL(new URLSearchParams(document.location.search).get('engine_url'));
  const protocol = URLobject.protocol === 'wss:' ? 'https:' : 'http:';
  const tenant = `${protocol}//${URLobject.host}`;
  return tenant;
}
