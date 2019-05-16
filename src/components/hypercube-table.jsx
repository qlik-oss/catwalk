import React from 'react';
import PropTypes from 'prop-types';
import { Column } from 'react-virtualized';
import { useLayout } from 'hamus.js';

import VirtualTable from './virtual-table';
import useResolvedValue from './use/resolved-value';

import './hypercube-table.pcss';

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

function columnHeaderRenderer({ label }) {
  return (
    <div className="column-header">
      <span className="ReactVirtualized__Table__headerTruncatedText" key="label">
        {label}
      </span>
      <span>
        <svg title="remove column" width={16} height={16} viewBox="0 0 24 24">
          <path d="M21 6h-5V4.33A2.42 2.42 0 0 0 13.5 2h-3A2.42 2.42 0 0 0 8 4.33V6H3a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2zM10 4.33c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33V6h-4zM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8h12z" />
          <path d="M9 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
          <path d="M15 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
        </svg>
      </span>
    </div>
  );
}

columnHeaderRenderer.propTypes = {
  label: PropTypes.any.isRequired,
};

function noRowsRenderer() {
  return <div className="no-values">No values</div>;
}

const GLYPH_SIZE = 8; // Aproximate max width in pixels of a glyph
const MAX_ROW_GLYTH_LENGTH = 40; // If the column is more than 40 glyphs wide then limit it
const PADDING = 20; // The total padding added around table cells
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
  model, measures, dimensions, height, maxWidth, onHeaderClick,
}) {
  const layout = useResolvedValue(useLayout(model));
  if (!model || !layout) {
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
          width={(calculatedWidth < maxWidth || maxWidth === 0) ? calculatedWidth : maxWidth}
          height={height}
          defPath="/qHyperCubeDef"
        >
          {dimensions.map((dim, dimensionIndex) => (
            <Column
              minWidth={80}
              label={dim.title}
              dataKey={dim.title}
              columnData={dim}
              key={dim.title}
              width={getDimensionWidth(layout, dimensionIndex, dim.title)}
              flexGrow={1}
              cellDataGetter={cellGetterForIndex(layout.qHyperCube.qEffectiveInterColumnSortOrder.indexOf(dimensionIndex))}
              cellRenderer={cellRendererForIndex(layout.qHyperCube.qEffectiveInterColumnSortOrder.indexOf(dimensionIndex))}
              headerRenderer={columnHeaderRenderer}
            />
          ))
          }
          {measures.map((measure, measureIndex) => (
            <Column
              width={getMeasureWidth(layout, measureIndex, measure.title)}
              minWidth={80}
              label={measure.title}
              dataKey={measure.title}
              columnData={measure}
              key={measure.title}
              flexGrow={1}
              cellDataGetter={cellGetterForIndex(layout.qHyperCube.qEffectiveInterColumnSortOrder.indexOf(dimensions.length + measureIndex))}
              cellRenderer={cellRendererForIndex(layout.qHyperCube.qEffectiveInterColumnSortOrder.indexOf(dimensions.length + measureIndex))}
              headerRenderer={columnHeaderRenderer}
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
  model: PropTypes.object,
  maxWidth: PropTypes.number,
  height: PropTypes.number.isRequired,
};
HypercubeTable.defaultProps = {
  onHeaderClick: () => {},
  measures: [],
  dimensions: [],
  model: null,
  maxWidth: 0,
};
