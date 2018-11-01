import React from 'react';
// import PropTypes from 'prop-types';

import './table.scss';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.addOpen = false;
    this.expressions = [
      { name: 'Sales', type: 'Measure' },
      { name: 'Profit', type: 'Measure' },
      { name: 'Påslakan', type: 'Measure' },
      { name: 'Bengts measure', type: 'Measure' },
      { name: 'Yttrandefrihetsindex', type: 'Measure' },
      { name: 'Sommarlov', type: 'Measure' },
      { name: 'Valdagen 1976', type: 'Measure' },
    ];
  }

  toggleAdd() {
    this.addOpen = !this.addOpen;
    this.forceUpdate();
  }

  render() {
    const expressions = this.expressions.map(expression => (
      <ul className="expression">{expression.name}</ul>
    ));

    const popupStyle = this.addOpen ? { display: 'block' } : { display: 'none' };
    const addStyle = this.addOpen ? { color: '#398ab5' } : { color: '#4d4d4d' };
    return (
      <div className="table">
        <div className="add-popup" style={popupStyle}>
          <li className="popup-content">
            {expressions}
          </li>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th className="add" style={addStyle} role="button" tabIndex="-1" onClick={() => this.toggleAdd()}>
                  <div className="add-container">
                    Add
                    <i className="material-icons">add</i>
                  </div>
                </th>
                <th>
                  Sales
                </th>
                <th>
                  Country
                </th>
                <th>
                  LOLOLOLOL
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
              </tr>
              <tr>
                <td></td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
              </tr>
              <tr>
                <td></td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
              </tr>
              <tr>
                <td></td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
              </tr>
              <tr>
                <td></td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
              </tr>
              <tr>
                <td></td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
              </tr>
              <tr>
                <td></td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
              </tr>
            </tbody>
          </table>
        </div>
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

export default Table;
