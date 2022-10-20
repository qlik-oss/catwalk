import Axios from 'axios';
import { configure } from 'axios-hooks';

export default function bootstrap(tenantUrl, webIntegrationId, csrfToken) {
  const axiosInstance = Axios.create({
    baseURL: `${tenantUrl}/api`,
    withCredentials: true,
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
