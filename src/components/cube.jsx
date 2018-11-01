import React from 'react';
// import PropTypes from 'prop-types';
import Table from './table';
import './cube.scss';

class Cube extends React.Component {
  constructor(props) {
    super(props);
    this.count = 0;
    this.cubes = [];
  }

  addCube() {
    this.cubes.push({ id: this.count });
    this.count = this.count + 1;
    this.forceUpdate();
  }

  removeCube(id) {
    let index;
    this.cubes.forEach((table, i) => {
      if (table.id === id) {
        index = i;
      }
    });
    this.cubes.splice(index, 1);
    this.forceUpdate();
  }

  render() {
    const tables = this.cubes.map(table => (
      <div key={table.id} className="card">
        <i role="button" tabIndex="-1" className="material-icons close" onClick={() => this.removeCube(table.id)}>close</i>
        <Table />
      </div>));
    return (
      <div className="cube">
        <div className="add-button">
          <i role="button" tabIndex="-1" className="material-icons add" onClick={() => this.addCube()}>add_circle</i>
        </div>
        {tables}
      </div>
    );
  }
}

// Cube.propTypes = {
//   lastReloadTime: PropTypes.string,
// };

// Cube.defaultProps = {
//   lastReloadTime: null,
// };

export default Cube;
