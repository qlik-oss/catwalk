export function getParamFromEngineUrl(paramToFetch) {
  let param = new URLSearchParams(document.location.search).get(paramToFetch);
  if (!param) {
    const params = new URLSearchParams(document.location.search).get('engine_url');
    if (params) {
      const urlObject = new URL(new URLSearchParams(document.location.search).get('engine_url'));
      param = new URLSearchParams(urlObject.search).get(paramToFetch);
    }
  }
  return param;
}

export function getWebIntegrationId() {
  return getParamFromEngineUrl('qlik-web-integration-id');
}

export function getTenantUrl() {
  const URLobject = new URL(new URLSearchParams(document.location.search).get('engine_url'));
  const protocol = URLobject.protocol === 'wss:' ? 'https:' : 'http:';
  const tenant = `${protocol}//${URLobject.host}`;
  return tenant;
}
