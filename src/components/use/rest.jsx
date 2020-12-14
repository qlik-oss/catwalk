import useAxios from 'axios-hooks';

export default function ({ // eslint-disable-line func-names
  url = '/', method = 'get', data = null, manual = false,
}) {
  const [{
    data: resData, error, loading, response,
  }, execute] = useAxios({
    url,
    method,
    data,
  }, { manual });
  return [resData, error, loading, response, execute];
}
