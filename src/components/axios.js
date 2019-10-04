import Axios from 'axios';
import { configure } from 'axios-hooks';
import { setupCache } from 'axios-cache-adapter';

export default function bootstrap(tenantUrl, webIntegrationId, csrfToken) {
  const axiosInstance = Axios.create({
    baseURL: `${tenantUrl}/api`,
    withCredentials: true,
    adapter: setupCache({ maxAge: 1000 }).adapter,
    headers: {
      'qlik-web-integration-id': webIntegrationId,
      'content-type': 'application/json',
      ...csrfToken && { 'qlik-csrf-token': csrfToken },
    },
  });

  configure({
    axios: axiosInstance,
  });
}
