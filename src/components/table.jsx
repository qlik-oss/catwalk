import React from 'react';
// import PropTypes from 'prop-types';

import './table.pcss';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.addOpen = false;
    this.expressions = [
      { name: 'Sales', type: 'Measure' },
      { name: 'Profit', type: 'Dimension' },
      { name: 'Påslakan', type: 'Measure' },
      { name: 'Bengts measure', type: 'Field' },
      { name: 'Yttrandefrihetsindex bla bla bla bla bla', type: 'Field' },
      { name: 'Sommarlov', type: 'Measure' },
      { name: 'Valdagen 1976', type: 'Dimension' },
    ];
  }

  toggleAdd(e) {
    if (this.addOpen === false) {
      this.currentHeader = e.currentTarget;
      this.openAdd();
    } else {
      this.closeAdd();
    }
  }

  closeAdd() {
    this.addOpen = false;
    this.currentHeader.classList.remove('active');
    this.forceUpdate();
  }

  openAdd() {
    this.addOpen = true;
    this.addPopupX = this.currentHeader.offsetLeft + this.currentHeader.offsetWidth / 2;
    this.currentHeader.classList.add('active');
    this.forceUpdate();
  }

  render() {
    const expressions = this.expressions.map(expression => (
      <ul className="expression">
        <span className="expression-name">{expression.name}</span>
        <span className="expression-type">{expression.type}</span>
      </ul>
    ));
    const popupStyle = this.addOpen ? { display: 'flex', left: `${this.addPopupX ? this.addPopupX : 0}px` } : { display: 'none' };
    const popup = this.addOpen ? (
      <div className="add-popup" onBlur={() => { this.closeAdd(); }} style={popupStyle}>
        <div className="input-wrapper">
          <span className="fx">fx</span>
          <input type="text" autoFocus />
        </div>
        <li className="expression-list">
          {expressions}
        </li>
      </div>
    ) : null;

    return (
      <div className="table">
        {popup}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th className="add" role="button" tabIndex="-1" onClick={(e) => { this.toggleAdd(e); }}>
                  <div className="add-container">
                    Add
                    <i className="material-icons">add</i>
                  </div>
                </th>
                <th role="button" tabIndex="-1" onClick={e => this.toggleAdd(e)}>
                  Sales
                </th>
                <th role="button" tabIndex="-1" onClick={e => this.toggleAdd(e)}>
                  Country
                </th>
                <th role="button" tabIndex="-1" onClick={e => this.toggleAdd(e)}>
                  LOLOLOLOL
                </th>
                <th role="button" tabIndex="-1" onClick={e => this.toggleAdd(e)}>
                  Hej
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
              </tr>
              <tr>
                <td></td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
              </tr>
              <tr>
                <td></td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
              </tr>
              <tr>
                <td></td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
              </tr>
              <tr>
                <td></td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
              </tr>
              <tr>
                <td></td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
              </tr>
              <tr>
                <td></td>
                <td>Value</td>
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
