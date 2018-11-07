import React from 'react';
import PropTypes from 'prop-types';
import Column from 'react-virtualized/dist/es/Table/Column';

import VirtualTable from './virtual-table';

import './hypercube-table.pcss';
import useModel from './use/model';
import useLayout from './use/layout';

function cellGetterForIndex(index) {
  return function cellGetter({ rowData }) {
    if (!rowData || !rowData[index]) {
      return '';
    }
    return rowData[index].qText;
  };
}

function cellRendererForIndex(index) {
  function cellRenderer({ rowData }) {
    if (!rowData || !rowData[index]) {
      return (<div>...</div>);
    }
    let title;
    if (!rowData[index].qNum || rowData[index].qNum === 'NaN') {
      title = `'${rowData[index].qText || ''}' (No numerical representation)`;
    } else {
      title = `'${rowData[index].qText}' (Numerical representation: ${rowData[index].qNum})`;
    }
    return (
      <div title={title}>
        {rowData[index].qText ? rowData[index].qText : '< empty >'}
      </div>
    );
  }
  cellRenderer.propTypes = {
    rowData: PropTypes.object.isRequired,
  };
  return cellRenderer;
}

function rowRenderer({
  defaultProps, rowData, style, columns, className, key,
}) {
  const classes = `item state-${rowData ? rowData[0].qState : 'Loading'} ${className}`;
  return (
    <div
      {...defaultProps}
      className={classes}
      key={key}
      role="row"
      style={style}
    >
      {columns}
    </div>
  );
}

function headerRowRenderer({
  className, columns, style,
}) {
  const { width, paddingRight } = style;
  let newStyle;
  if (width && paddingRight) {
    newStyle = { ...style, width: width - paddingRight };
  } else {
    newStyle = style;
  }

  return (
    <div
      className={className}
      role="row"
      style={{ ...newStyle }}
    >
      {columns}
    </div>
  );
}
headerRowRenderer.propTypes = {
  className: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  style: PropTypes.object.isRequired,
};

function noRowsRenderer() {
  return <div className="no-values">No values</div>;
}

const GLYPH_SIZE = 8;
const MAX_ROW_GLYTH_LENGTH = 40;
function getMeasureWidth(layout, measureIndex, measureName) {
  const dataSize = layout.qHyperCube.qMeasureInfo.length > measureIndex ? layout.qHyperCube.qMeasureInfo[measureIndex].qApprMaxGlyphCount : 0;
  const titleSize = (measureName || '').length;
  const size = Math.min(Math.max(dataSize, titleSize), MAX_ROW_GLYTH_LENGTH);
  return size * GLYPH_SIZE + 8;
}

function getDimensionWidth(layout, dimensionIndex, dimensionName) {
  const dataSize = layout.qHyperCube.qDimensionInfo.length > dimensionIndex ? layout.qHyperCube.qDimensionInfo[dimensionIndex].qApprMaxGlyphCount : 0;
  const titleSize = (dimensionName || '').length;
  const size = Math.min(Math.max(dataSize, titleSize), MAX_ROW_GLYTH_LENGTH);
  return size * GLYPH_SIZE + 8;
}

function getTotalWidth(layout, dimensions, measures) {
  if (!layout) {
    return 0;
  }
  const dimSizes = dimensions.map((dim, dimensionIndex) => getDimensionWidth(layout, dimensionIndex, dim.title));
  const mesSizes = measures.map((measure, measureIndex) => getMeasureWidth(layout, measureIndex, measure.title));
  return 20 + dimSizes.reduce((a, b) => a + b, 0) + mesSizes.reduce((a, b) => a + b, 0);
}

export default function HypercubeTable({
  app, measures, dimensions, height, maxWidth, onHeaderClick,
}) {
  const hypercubeProps = {
    qInfo: {
      qId: 'measurebox1',
      qType: 'measurebox1',
    },
    qHyperCubeDef: {
      qInitialDataFetch: [
        {
          qTop: 0,
          qLeft: 0,
          qHeight: 20,
          qWidth: dimensions.length + measures.length,
        },
      ],
    },
  };
  if (dimensions && dimensions.length > 0) {
    hypercubeProps.qHyperCubeDef.qDimensions = dimensions.map(dimension => dimension.hyperCubeContent);
  } else {
    hypercubeProps.qHyperCubeDef.qDimensions = [];
  }
  if (measures && measures.length > 0) {
    hypercubeProps.qHyperCubeDef.qMeasures = measures.map(measure => measure.hyperCubeContent);
  } else {
    hypercubeProps.qHyperCubeDef.qMeasures = [];
  }

  const model = useModel(app, hypercubeProps);
  const layout = useLayout(model);

  function onHeaderClickInternal(data) {
    onHeaderClick(data);
  }
  const totalWidth = getTotalWidth(layout, dimensions, measures);
  if (layout && totalWidth > 0) {
    return (
      <div role="Table" tabIndex="-1" className="hypercube-table">
        <VirtualTable
          layout={layout}
          model={model}
          rowRenderer={rowRenderer}
          noRowsRenderer={noRowsRenderer}
          headerRowRenderer={headerRowRenderer}
          onHeaderClick={data => onHeaderClickInternal(data)}
          headerRowHeight={24}
          width={totalWidth < maxWidth ? totalWidth : maxWidth}
          height={height}
          defPath="/qHyperCubeDef"
        >
          {dimensions.map((dim, dimensionIndex) => (
            <Column
              label={dim.title}
              dataKey={dim.title}
              columnData={dim}
              key={dim.title}
              width={getDimensionWidth(layout, dimensionIndex, dim.title)}
              flexGrow={1}
              flexShrink={1}
              cellDataGetter={cellGetterForIndex(dimensionIndex)}
              cellRenderer={cellRendererForIndex(dimensionIndex)}
            />
          ))
          }
          {measures.map((measure, measureIndex) => (
            <Column
              width={getMeasureWidth(layout, measureIndex, measure.title)}
              label={measure.title}
              dataKey={measure.title}
              columnData={measure}
              key="measure"
              flexGrow={1}
              flexShrink={1}
              cellDataGetter={cellGetterForIndex(dimensions.length + measureIndex)}
              cellRenderer={cellRendererForIndex(dimensions.length + measureIndex)}
            />
          ))
           }
        </VirtualTable>
      </div>
    );
  }
  return (<div />);
}

HypercubeTable.propTypes = {
  onHeaderClick: PropTypes.func,
  measures: PropTypes.arrayOf(PropTypes.object),
  dimensions: PropTypes.arrayOf(PropTypes.object),
  app: PropTypes.object,
  maxWidth: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};
HypercubeTable.defaultProps = {
  onHeaderClick: () => {},
  measures: [],
  dimensions: [],
  app: null,
};
