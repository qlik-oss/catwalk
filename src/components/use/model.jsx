import { useMemo } from 'react';
import usePromise from 'react-use-promise';

export default function useModel(app, def) {
  const [model, error] = usePromise(useMemo(() => app.createSessionObject(def), [app.id + JSON.stringify(def)]));
  if (error) throw error;
  return model;
}
