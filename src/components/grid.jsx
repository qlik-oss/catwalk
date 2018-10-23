import React from 'react';
import './grid.scss';

import {
  Column, Table, AutoSizer, InfiniteLoader,
} from 'react-virtualized';
import 'react-virtualized/styles.css';
import PropTypes from 'prop-types'; // only needs to be imported once


function rowRenderer({
  className,
  columns,
  index,
  key,
  onRowClick,
  onRowDoubleClick,
  onRowMouseOut,
  onRowMouseOver,
  onRowRightClick,
  rowData,
  style,
}) {
  const a11yProps = { 'aria-rowindex': index + 1 };

  if (
    onRowClick
    || onRowDoubleClick
    || onRowMouseOut
    || onRowMouseOver
    || onRowRightClick
  ) {
    a11yProps['aria-label'] = 'row';
    a11yProps.tabIndex = 0;

    if (onRowClick) {
      a11yProps.onClick = event => onRowClick({ event, index, rowData });
    }
    if (onRowDoubleClick) {
      a11yProps.onDoubleClick = event => onRowDoubleClick({ event, index, rowData });
    }
    if (onRowMouseOut) {
      a11yProps.onMouseOut = event => onRowMouseOut({ event, index, rowData });
    }
    if (onRowMouseOver) {
      a11yProps.onMouseOver = event => onRowMouseOver({ event, index, rowData });
    }
    if (onRowRightClick) {
      a11yProps.onContextMenu = event => onRowRightClick({ event, index, rowData });
    }
  }

  const classes = `item state-${rowData ? rowData[0].qState : 'Loading'} ${className}`;

  return (
    <div
      {...a11yProps}
      className={classes}
      key={key}
      role="row"
      style={style}
    >
      {columns}
    </div>
  );
}

function listboxNameColumnGetter({
  columnData,
  dataKey,
  rowData,
}) {
  return rowData ? rowData[0].qText : '...';
}

function listboxFrequencyColumnGetter({
  columnData,
  dataKey,
  rowData,
}) {
  return rowData ? `${rowData[0].qFrequency || '1'}x` : '...';
}

function nameCellRenderer({
  cellData,
  columnData,
  columnIndex,
  dataKey,
  isScrolling,
  rowData,
  rowIndex,
}) {
  // style="flex: 1 1 100px; overflow: hidden;"

  if (!rowData) {
    return (<div>...</div>);
  }


  let title;
  if (!rowData[0].qNum || rowData[0].qNum === 'NaN') {
    title = `'${rowData[0].qText}' (No numerical representation)`;
  } else {
    title = `'${rowData[0].qText}' (Numerical representation: ${rowData[0].qNum})`;
  }


  return (
    <div title={title}>
      {rowData[0].qText}
    </div>
  );
}

function freqCellRenderer({
  cellData,
  columnData,
  columnIndex,
  dataKey,
  isScrolling,
  rowData,
  rowIndex,
}) {
  if (!rowData) {
    return (<div>...</div>);
  }
  if (rowData[0].qFreq > 1) {
    return (
      <div title={`This value occurs ${rowData[0].qFreq} times`}>
        {`${rowData[0].qFreq}x`}
      </div>
    );
  }
  return (<div title="This value occurs only once"> 1x </div>);
}

export class VirtualGrid extends React.Component {
  constructor() {
    super();
    this.infiniteLoaderRef = React.createRef();
    this.table = React.createRef();
    const state = {
      loadedRowsMap: {},
      layout: null,
    };
    this.state = state;
    this.layoutOnPreviousRender = null;
    this.isRowLoaded = this.isRowLoaded.bind(this);
    this.loadMoreRows = this.loadMoreRows.bind(this);
    this.getRow = this.getRow.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.layout !== prevState.layout) {
      const newState = { layout: nextProps.layout, loadedRowsMap: {} };
      newState.layout.qListObject.qDataPages[0].qMatrix.forEach((row, i) => {
        newState.loadedRowsMap[i] = row;
      });
      return newState;
    }
    return null;
  }

  onRowClick({ rowData }) {
    const { model } = this.props;
    if (rowData) {
      model.selectListObjectValues('/qListObjectDef', [rowData[0].qElemNumber], true);
    }
  }

  getRow({ index }) {
    const { loadedRowsMap } = this.state;
    return loadedRowsMap[index];
  }

  isRowLoaded({ index }) {
    const { loadedRowsMap } = this.state;
    return !!loadedRowsMap[index];
  }

  loadMoreRows({ startIndex, stopIndex }) {
    console.log(startIndex, stopIndex);
    const { loadedRowsMap } = this.state;
    const { model } = this.props;

    return model.getListObjectData('/qListObjectDef', [{
      qTop: startIndex,
      qHeight: stopIndex - startIndex + 1,
      qLeft: 0,
      qWidth: 1,
    }]).then((result) => {
      const top = result[0].qArea.qTop;
      const loadedRows = result[0].qMatrix;
      loadedRows.forEach((row, index) => {
        loadedRowsMap[top + index] = row;
      });
    });
  }


  render() {
    const { layout } = this.props;
    if (!!this.layoutOnPreviousRender && layout !== this.layoutOnPreviousRender) {
      this.infiniteLoaderRef.current.resetLoadMoreRowsCache(); // Probably not needed
    }
    this.layoutOnPreviousRender = layout;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={layout.qListObject.qSize.qcy}
            threshold={3}
            minimumBatchSize={100}
            ref={this.infiniteLoaderRef}
          >
            {({ onRowsRendered, registerChild }) => (
              <Table
                height={height}
                width={width}
                ref={registerChild}
                onRowsRendered={onRowsRendered}
                disableHeader
                rowHeight={24}
                rowCount={layout.qListObject.qSize.qcy}
                rowGetter={this.getRow}
                tabIndex={null}
                onRowClick={this.onRowClick}
                rowRenderer={rowRenderer}
              >
                <Column
                  label="Name"
                  dataKey="name"
                  width={100}
                  flexGrow={1}
                  flexShrink={1}
                  cellDataGetter={listboxNameColumnGetter}
                  cellRenderer={nameCellRenderer}
                />
                <Column
                  width={40}
                  label="Description"
                  dataKey="description"
                  flexGrow={1}
                  flexShrink={0}
                  cellDataGetter={listboxFrequencyColumnGetter}
                  cellRenderer={freqCellRenderer}

                />
              </Table>
            )}
          </InfiniteLoader>)
        }
      </AutoSizer>
    );
  }
}

VirtualGrid.propTypes = {
  layout: PropTypes.object,
  model: PropTypes.object,
};

VirtualGrid.defaultProps = {
  layout: null,
  model: null,
};

export default VirtualGrid;
