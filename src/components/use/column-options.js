import { useMemo } from 'react';

import useModel from './model';
import useLayout from './layout';

const genericObjectProperties = {
  qInfo: {
    qId: 'MeasureList',
    qType: 'MeasureList',
  },
  qMeasureListDef: {
    qType: 'measure',
    qData: {
      title: '/qMetaDef/title',
      expression: '/qMeasure/qDef',
    },
  },
  qFieldListDef: {
    qShowDerivedFields: true,
  },
  qDimensionListDef: {
    qType: 'dimension',
    qData: {
      title: '/qMetaDef/title',
      all: '/qDim',
      tags: '/qMetaDef/tags',
      grouping: '/qDim/qGrouping',
      info: '/qDimInfos',
      labelExpression: '/qDim/qLabelExpression',
    },
  },
};

export function layoutToListsStructure(layout) {
  if (layout) {
    const measures = layout.qMeasureList.qItems ? layout.qMeasureList.qItems.map(measure => ({
      title: measure.qData.title ? measure.qData.title : measure.qInfo.qId,
      type: 'measure',
      hyperCubeContent: { qLibraryId: measure.qInfo.qId },
    })) : [];
    const dimensions = layout.qDimensionList.qItems ? layout.qDimensionList.qItems.map(dimension => ({
      title: dimension.qData.title ? dimension.qData.title : dimension.qInfo.qId,
      type: 'dimension',
      hyperCubeContent: { qLibraryId: dimension.qInfo.qId },
    })) : [];
    const fields = layout.qFieldList.qItems ? layout.qFieldList.qItems.map(field => ({ title: field.qName, type: 'field', hyperCubeContent: { qDef: { qFieldDefs: [field.qName] } } })) : [];

    const result = [
      ...measures,
      ...dimensions,
      ...fields,
    ];
    result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }
  return [];
}

export default function useColumnOptions(app) {
  const model = useModel(app, genericObjectProperties);
  const layout = useLayout(model);
  const listStructure = useMemo(() => layoutToListsStructure(layout), [layout]);
  return listStructure;
}
