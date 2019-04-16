import React,
{
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';

import useColumnOptions from './use/column-options';
import CubeColumnChooser from './cube-column-chooser';
import HypercubeTable from './hypercube-table';
import useForce from './use/force';
import useModel from './use/model';

import './cube.pcss';

// The component needs to be wrapped in `forwardRef` to give access to the
// ref object assigned using the `ref` prop.
const Cube = forwardRef(({ app, tableData: { initialColumns }, closeOnClickOutside }, ref) => {
  const selectableColumns = useColumnOptions(app);
  const [columns, setColumns] = useState(initialColumns);
  const currentHeader = useRef(null);
  const columnToReplace = useRef(null);
  const addOpen = useRef(false);
  const forceUpdate = useForce();
  let model = null;
  let hypercubeProps = null;

  // Any instance of the component is extended with what is returned from the
  // callback passed as the second argument.
  useImperativeHandle(ref, () => ({
    copyToClipboard() {
      if (hypercubeProps) {
        copy(JSON.stringify(hypercubeProps));
      }
    },
    async exportHypercube() {
      if (model) {
        const result = await model.exportData('OOXML', '/qHyperCubeDef');
        const engineUrl = new URLSearchParams(document.location.search).get('engine_url');
        if (engineUrl) {
          const elem = document.createElement('a');
          elem.href = `${new URL(engineUrl).origin.replace('ws', 'http')}${result.qUrl}`;
          elem.target = '_blank';
          document.body.appendChild(elem);
          elem.click();
          document.body.removeChild(elem);
        }
      }
    },
  }));

  function closeAdd() {
    if (currentHeader.current) {
      currentHeader.current.classList.remove('active');
    }
    addOpen.current = false;
    columnToReplace.current = null;
    forceUpdate();
  }

  function openAdd() {
    currentHeader.current.classList.add('active');
    addOpen.current = true;
    forceUpdate();
  }

  function toggleAdd(e) {
    if (!addOpen.current) {
      currentHeader.current = e.currentTarget;
      openAdd();
    } else {
      closeAdd();
    }
  }

  function addColumn(column) {
    if (column) {
      if (columnToReplace.current) {
        setColumns(columns.map(existingColumn => (existingColumn === columnToReplace.current ? column : existingColumn)));
        columnToReplace.current = null;
      } else {
        setColumns([...columns, column]);
      }
    }
    closeAdd();
  }

  function onHeaderClick({ columnData, event }) {
    columnToReplace.current = columnData;
    toggleAdd(event);
  }

  function createProperties(dimensions, measures) {
    const hypercubeDef = {
      qInfo: {
        qType: 'catwalk-hypercube',
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
    if (dimensions && dimensions.length) {
      hypercubeDef.qHyperCubeDef.qDimensions = dimensions.map(dimension => dimension.hyperCubeContent);
    } else {
      hypercubeDef.qHyperCubeDef.qDimensions = [];
    }
    if (measures && measures.length) {
      hypercubeDef.qHyperCubeDef.qMeasures = measures.map(measure => measure.hyperCubeContent);
    } else {
      hypercubeDef.qHyperCubeDef.qMeasures = [];
    }
    return hypercubeDef;
  }

  const popup = addOpen.current ? <CubeColumnChooser alignTo={currentHeader.current} selectableColumns={selectableColumns} chooseColumn={addColumn} closeOnClickOutside={closeOnClickOutside} /> : null;

  const measures = columns.filter(column => column.type === 'measure');
  const dimensions = columns.filter(column => column.type === 'dimension' || column.type === 'field');
  hypercubeProps = createProperties(dimensions, measures);
  model = useModel(app, hypercubeProps);

  const isEmpty = measures.length + dimensions.length === 0;
  if (isEmpty && addOpen.current) {
    return popup;
  }
  return (
    <div className={`cube ${isEmpty ? 'empty' : ''}`}>
      {popup}
      <div className="table-wrapper">
        <div role="button" title="Add another column" tabIndex="-1" className={`column-add-button ${isEmpty ? 'empty' : ''}`} onClick={e => toggleAdd(e)}>
          <span className="text">+</span>
        </div>
        {!isEmpty ? <HypercubeTable model={model} onHeaderClick={data => onHeaderClick(data)} dimensions={dimensions} measures={measures} height={28 * 8} maxWidth={100 * 8} /> : null}
      </div>
    </div>
  );
});
export default Cube;

Cube.defaultProps = {
  closeOnClickOutside: () => true,
};

Cube.propTypes = {
  app: PropTypes.object.isRequired,
  tableData: PropTypes.object.isRequired,
  closeOnClickOutside: PropTypes.func,
};
