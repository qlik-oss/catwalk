import { useMemo } from 'react';
import usePromise from 'react-use-promise';

export default function useModel(app, def) {
  const [model, error] = usePromise(useMemo(async () => {
    const sessionObject = await app.createSessionObject({ qInfo: { qId: 'MeasureList', qType: 'MeasureList' }, qMeasureListDef: { qType: 'measure', qData: { title: '/qMetaDef/title', expression: '/qMeasure/qDef' } } });
    sessionObject.getLayout();
  }, [app.id + JSON.stringify(def)]));
  if (error) throw error;
  return model;
}
