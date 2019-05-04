import { useMemo } from 'react';
import { useLayout, useModel } from 'hamus.js';
import useErrorThrow from './error-throw';

const genericObjectProperties = {
  qInfo: {
    qId: 'MeasureList',
    qType: 'MeasureList',
  },
  qMeasureListDef: {
    qType: 'measure',
    qData: {
      title: '/qMetaDef/title',
      label: '/qMeasure/qLabel',
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
    },
  },
};

export function layoutToListsStructure(layout) {
  if (layout) {
    const measures = layout.qMeasureList.qItems ? layout.qMeasureList.qItems.map((measure) => {
      let measureTitle = measure.qInfo.qId;
      if (measure.qData.title) {
        const { title } = measure.qData;
        measureTitle = title;
      } else if (measure.qData.label) {
        measureTitle = measure.qData.label;
      }
      return (
        {
          title: measureTitle,
          type: 'measure',
          hyperCubeContent: { qLibraryId: measure.qInfo.qId },
        }
      );
    }) : [];
    const dimensions = layout.qDimensionList.qItems ? layout.qDimensionList.qItems.map((dimension) => {
      let dimTitle = dimension.qInfo.qId;
      if (dimension.qData.title) {
        const { title } = dimension.qData;
        dimTitle = title;
      } else if (dimension.qData.all.qFieldLabels && dimension.qData.all.qFieldLabels.length > 0) {
        const [label] = dimension.qData.all.qFieldLabels;
        dimTitle = label;
      }
      return (
        {
          title: dimTitle,
          type: 'dimension',
          hyperCubeContent: { qLibraryId: dimension.qInfo.qId },
        }
      );
    }) : [];
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
  const model = useErrorThrow(useModel(app, genericObjectProperties));
  const layout = useErrorThrow(useLayout(model));
  const listStructure = useMemo(() => layoutToListsStructure(layout), [layout]);
  return listStructure;
}
