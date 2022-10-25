import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Cube from './cube';
import { useInfoBox } from './info-box';
import SVGclose from '../assets/close-outline.svg';
import SVGcopy from '../assets/copy-outline.svg';
import SVGexportCube from '../assets/download-outline.svg';
import SVGloader from '../assets/loader-outline.svg';

import useColumnOptions from './use/column-options';
import CubeColumnChooser from './cube-column-chooser';
import useForce from './use/force';

import './cubes.pcss';

export function Cubes({ app, closeOnClickOutside, isLocalStorage }) {
  const [count, setCount] = useState(1);
  const [cubeList, setCubeList] = useState([]);
  const forceUpdate = useForce();
  const addButtonRef = useRef(null);
  const refs = useRef([React.createRef()]);

  const selectableColumns = useColumnOptions(app);
  const addOpen = useRef(false); // Start with add dialog open
  const [spinner, setSpinner] = useState(false);
  const infoBox = useInfoBox();

  const closeButton = { className: 'close', svg: SVGclose };

  function addCube(column) {
    if (column) {
      let newId = count;
      const checkId = (i) => i.id === newId;

      while (cubeList.find(checkId)) {
        newId += 1;
      }
      const newCube = { id: newId, initialColumns: [column] };
      setCount(newId + 1);
      setCubeList([
        newCube,
        ...cubeList,
      ]);
      refs.current[newCube.id] = React.createRef();
    }
    addOpen.current = false;
    forceUpdate();
  }

  useEffect(() => {
    // Check if cubes are stored in localstorage.
    if (!isLocalStorage) return;
    const key = `${app.id}/cubes/`;
    const storedCubeList = [];
    Object.keys(localStorage).filter((item) => item.indexOf(key) >= 0).forEach((item) => {
      const cube = { id: Number(item.replace(key, '')), initialColumns: JSON.parse(localStorage.getItem(item)) };
      storedCubeList.push(cube);
      refs.current[cube.id] = React.createRef();
    });
    setCubeList(storedCubeList);
  }, []);

  const removeCube = (id) => {
    setCubeList(cubeList.filter((item) => item.id !== id));
    refs.current[id] = null;
  };

  const openColumnChooser = () => {
    addOpen.current = true;
    forceUpdate();
  };

  const copyToClipboard = (id) => {
    if (refs.current && refs.current[id] && refs.current[id].current) {
      refs.current[id].current.copyToClipboard();
      infoBox.show('success', 'The hypercube def was copied to clipboard.');
    }
  };

  const exportHypercube = async (id) => {
    if (refs.current && refs.current[id] && refs.current[id].current) {
      setSpinner(true);
      try {
        await refs.current[id].current.exportHypercube();
        infoBox.show('success', 'The data was successfully exported.');
      } catch (error) {
        infoBox.show('warning', 'The data could not be exported. Check that you have permissions to export data.');
      }
      setSpinner(false);
    }
  };

  const popup = addOpen.current ? <CubeColumnChooser arrowStyle="arrowRight" alignTo={addButtonRef.current} selectableColumns={selectableColumns} chooseColumn={(column) => addCube(column)} closeOnClickOutside={closeOnClickOutside} /> : null;
  const cubeDivs = cubeList.map((cube) => (
    <div key={cube.id} className="card">
      <div className="top-bar">
        <div className="title">HYPERCUBE</div>
        { spinner ? <SVGloader className="spinner" /> : <SVGexportCube className="export" onClick={() => exportHypercube(cube.id)} title="Export to excel" /> }
        <SVGcopy className="copy" onClick={() => copyToClipboard(cube.id)} title="Copy hypercube def to clipboard" />
        <SVGclose className={closeButton.className} onClick={() => removeCube(cube.id)} title="Close cube" />
      </div>
      <Cube ref={refs.current[cube.id]} app={app} tableData={cube} closeOnClickOutside={closeOnClickOutside} id={cube.id} isLocalStorage={isLocalStorage} closeCube={removeCube} />
    </div>
  ));
  return (
    <div>
      <div className="cubes">
        <div className="add-button" ref={addButtonRef} role="button" tabIndex="-1" onClick={openColumnChooser}>
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
  isLocalStorage: PropTypes.bool,
};

Cubes.defaultProps = {
  isLocalStorage: false,
};

export default Cubes;
