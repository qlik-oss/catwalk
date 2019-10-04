import bootstrap from '../axios';
import useRest from './rest';

export default function useCsrf(tenant, wid) {
  bootstrap(tenant, wid);

  const [csrf, csrfError, csrfIsLoading, csrfResponse] = useRest({ url: '/v1/csrf-token' });
  const needsLogin = csrfError && csrfError.response && csrfError.response.status === 401;
  if (!csrfIsLoading && needsLogin) {
    window.location.assign(`${tenant}/login/?qlik-web-integration-id=${wid}&returnto=${window.location.href}`);
  } else if (csrfResponse) {
    const c = csrfResponse.headers['qlik-csrf-token'];
    bootstrap(tenant, wid, c);
    return [c, csrfError];
  }
  return [csrf, csrfError];
}
