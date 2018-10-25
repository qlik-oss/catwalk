import React from 'react';
import {
  Table, AutoSizer, InfiniteLoader,
} from 'react-virtualized';
import 'react-virtualized/styles.css';
import PropTypes from 'prop-types'; // only needs to be imported once

function wrappingRowRenderer(inputParams, rowRenderer) {
  const {
    index,
    onRowClick,
    onRowDoubleClick,
    onRowMouseOut,
    onRowMouseOver,
    onRowRightClick,
    rowData,
  } = inputParams;

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
  return rowRenderer({ defaultProps: a11yProps, ...inputParams });
}

export class VirtualTable extends React.Component {
  constructor() {
    super();
    this.infiniteLoaderRef = React.createRef();
    this.table = React.createRef();
    const state = {
      loadedRowsMap: {},
      layout: null,
    };
    this.state = state;
    this.isRowLoaded = this.isRowLoaded.bind(this);
    this.loadMoreRows = this.loadMoreRows.bind(this);
    this.getRow = this.getRow.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.layout !== prevState.layout) {
      // console.log('New state');
      const newState = { layout: nextProps.layout, loadedRowsMap: {}, lastLoadedRowsMap: prevState.loadedRowsMap };
      newState.layout.qListObject.qDataPages[0].qMatrix.forEach((row, i) => {
        newState.loadedRowsMap[i] = row;
      });
      return newState;
    }
    return null;
  }

  componentDidUpdate() {
    // only do this for scrolled components!
    if (this.scrollTop > 0) {
      this.infiniteLoaderRef.current.resetLoadMoreRowsCache(true); // Probably not needed
      this.table.forceUpdate();
    }
  }

  onScroll({ scrollTop }) {
    this.scrollTop = scrollTop;
  }

  getRow({ index }) {
    const { loadedRowsMap, lastLoadedRowsMap } = this.state;
    // console.log('getRow', index, loadedRowsMap[index]);
    return loadedRowsMap[index] || lastLoadedRowsMap[index];
  }

  isRowLoaded({ index }) {
    const { loadedRowsMap } = this.state;
    // console.log('IsRowLoaded', index, loadedRowsMap[index]);
    return !!loadedRowsMap[index];
  }

  loadMoreRows({ startIndex, stopIndex }) {
    // console.log('Load more rows', startIndex, stopIndex);
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
    const {
      layout, onRowClick, children, rowRenderer, noRowsRenderer,
    } = this.props;

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
            {({ onRowsRendered, registerChild }) => {
              const grab = (table) => { this.table = table; registerChild(table); };
              return (
                <Table
                  height={height}
                  width={width}
                  ref={grab}
                  onRowsRendered={onRowsRendered}
                  disableHeader
                  rowHeight={24}
                  rowCount={layout.qListObject.qSize.qcy}
                  rowGetter={this.getRow}
                  tabIndex={null}
                  onRowClick={onRowClick}
                  onScroll={this.onScroll}
                  rowRenderer={params => wrappingRowRenderer(params, rowRenderer)}
                  noRowsRenderer={noRowsRenderer}
                >
                  {children}
                </Table>
              );
            }}
          </InfiniteLoader>)
        }
      </AutoSizer>
    );
  }
}

VirtualTable.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  layout: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  onRowClick: PropTypes.func,
  rowRenderer: PropTypes.func.isRequired,
  noRowsRenderer: PropTypes.func,
};

VirtualTable.defaultProps = {
  onRowClick: () => {},
  noRowsRenderer: null,
};

export default VirtualTable;
