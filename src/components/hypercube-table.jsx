import React from 'react';
import PropTypes from 'prop-types';
import { Column } from 'react-virtualized';

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
rowRenderer.propTypes = {
  defaultProps: PropTypes.object.isRequired,
  rowData: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  columns: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
};

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

const GLYPH_SIZE = 8; // Aproximate max width in pixels of a glyph
const MAX_ROW_GLYTH_LENGTH = 40; // If the column is more than 40 glyphs wide then limit it
const PADDING = 8; // The total padding added around table cells
const BORDER = 1; // The size added by the border between cells
const SCROLLBAR_PADDING = 17; // React-virtualized adds and subtracts this value to accomodate for the space stolen by the scroll bar

function getColumnSize(title, approxGlyphCount) {
  const titleSize = (title || '').length;
  const glyphCount = Math.min(Math.max(approxGlyphCount, titleSize), MAX_ROW_GLYTH_LENGTH);
  const columnSizeInPx = glyphCount * GLYPH_SIZE + PADDING + BORDER; // The last column has no border so that is subtracted below
  return columnSizeInPx;
}

function getMeasureWidth(layout, measureIndex, measureName) {
  const approxGlyphCount = layout.qHyperCube.qMeasureInfo.length > measureIndex ? layout.qHyperCube.qMeasureInfo[measureIndex].qApprMaxGlyphCount : 0;
  return getColumnSize(measureName, approxGlyphCount);
}

function getDimensionWidth(layout, dimensionIndex, dimensionName) {
  const approxGlyphCount = layout.qHyperCube.qDimensionInfo.length > dimensionIndex ? layout.qHyperCube.qDimensionInfo[dimensionIndex].qApprMaxGlyphCount : 0;
  return getColumnSize(dimensionName, approxGlyphCount);
}

function getTotalTableWidth(layout, dimensions, measures) {
  if (!layout) {
    return 0;
  }
  const dimSizes = dimensions.map((dim, dimensionIndex) => getDimensionWidth(layout, dimensionIndex, dim.title));
  const mesSizes = measures.map((measure, measureIndex) => getMeasureWidth(layout, measureIndex, measure.title));
  const columnsSize = dimSizes.reduce((a, b) => a + b, 0) + mesSizes.reduce((a, b) => a + b, 0);
  const totalWidth = columnsSize + SCROLLBAR_PADDING - BORDER; // Subtract one border for the last column with doesn't have one
  return totalWidth;
}

export default function HypercubeTable({
  app, measures, dimensions, height, maxWidth, onHeaderClick, hypercubeProps,
}) {
  const model = useModel(app, hypercubeProps);
  const layout = useLayout(model);
  if (!model) {
    return null;
  }
  const calculatedWidth = getTotalTableWidth(layout, dimensions, measures);
  if (layout && calculatedWidth > 0) {
    return (
      <div role="table" tabIndex="-1" className="hypercube-table">
        <VirtualTable
          layout={layout}
          model={model}
          rowRenderer={rowRenderer}
          noRowsRenderer={noRowsRenderer}
          headerRowRenderer={headerRowRenderer}
          onHeaderClick={data => onHeaderClick(data)}
          headerRowHeight={24}
          width={calculatedWidth < maxWidth ? calculatedWidth : maxWidth}
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
  hypercubeProps: PropTypes.object,
};
HypercubeTable.defaultProps = {
  onHeaderClick: () => {},
  measures: [],
  dimensions: [],
  app: null,
  hypercubeProps: null,
};
