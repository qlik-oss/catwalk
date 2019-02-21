import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import Cube from './cube';
import close from '../assets/close-outline.svg';

import useColumnOptions from './use/column-options';
import CubeColumnChooser from './cube-column-chooser';
import useForce from './use/force';

import './cubes.pcss';

export function Cubes({ app, closeOnClickOutside }) {
  const [count, setCount] = useState(1);
  const [cubeList, setCubeList] = useState([]);
  const forceUpdate = useForce();
  const addButtonRef = useRef(null);

  const selectableColumns = useColumnOptions(app);
  const addOpen = useRef(false); // Start with add dialog open

  const closeButton = { className: 'close', svg: close };

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

  const popup = addOpen.current ? <CubeColumnChooser arrowStyle="arrowRight" alignTo={addButtonRef.current} selectableColumns={selectableColumns} chooseColumn={column => addCube(column)} closeOnClickOutside={closeOnClickOutside} /> : null;
  const cubeDivs = cubeList.map(cube => (
    <div key={cube.id} className="card">
      <div className="top-bar">
        <div className="title">HYPERCUBE</div>
        <SVGInline {...closeButton} onClick={() => removeCube(cube.id)} />
      </div>
      <Cube app={app} tableData={cube} closeOnClickOutside={closeOnClickOutside} />
    </div>
  ));
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
  closeOnClickOutside: PropTypes.func.isRequired,
};

export default Cubes;
