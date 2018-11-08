import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Cube from './cube';

import useColumnOptions from './use/column-options';
import CubeColumnChooser from './cube-column-chooser';

import './cubes.pcss';

export function Cubes({ app }) {
  const [count, setCount] = useState(1);
  const [cubeList, setCubeList] = useState([]);
  const [, forceUpdate] = useState(null);
  const addButtonRef = useRef(null);

  const selectableColumns = useColumnOptions(app);
  const addOpen = useRef(false); // Start with add dialog open

  function addCube(column) {
    if (column) {
      const newCube = { id: count, initialColumns: [column] };
      setCount(count + 1);
      setCubeList([
        newCube,
        ...cubeList,
      ]);
    }
    addOpen.current = false;
    forceUpdate();
  }

  function removeCube(id) {
    setCubeList(cubeList.filter(item => item.id !== id));
  }

  function openColumnChooser() {
    addOpen.current = true;
    forceUpdate();
  }

  const popup = addOpen.current ? <CubeColumnChooser arrowStyle="arrowRight" alignTo={addButtonRef.current} selectableColumns={selectableColumns} chooseColumn={column => addCube(column)} /> : null;
  const cubeDivs = cubeList.map(cube => (
    <div key={cube.id} className="card">
      <div className="title">HYPERCUBE</div>
      <span role="button" tabIndex="-1" className="close" onClick={() => removeCube(cube.id)}>X</span>
      <Cube app={app} tableData={cube} />
    </div>));
  return (
    <div>
      <div className="cubes">
        <div className="add-button" ref={addButtonRef} role="button" tabIndex="-1" onClick={() => openColumnChooser()}>
          <span className="text" title="Create a new hypercube">+</span>
        </div>
        {cubeDivs}
      </div>
      {popup}
    </div>
  );
}

Cubes.propTypes = {
  app: PropTypes.object.isRequired,
};

export default Cubes;
