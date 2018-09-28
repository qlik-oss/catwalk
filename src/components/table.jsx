
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import OutsideClickHandler from 'react-outside-click-handler';

import Field from './field';
import Filterbox from './filterbox';

import './table.css';

function renderFilterbox(app, field, alignTo) {
  let item = alignTo;
  while (item.parentNode && item.nodeName !== 'LI') {
    item = item.parentNode;
  }
  item.classList.add('selected');
  ReactDOM.render(
    <OutsideClickHandler
      onOutsideClick={() => ReactDOM.unmountComponentAtNode(document.querySelector('#overlays'))}
    >
      <Filterbox
        app={app}
        field={field}
        alignTo={item}
        onClose={() => item.classList.remove('selected')}
      />
    </OutsideClickHandler>,
    document.querySelector('#overlays'),
  );
}

export default class Table extends React.Component {
  constructor() {
    super();
    this.fieldStates = {};
    this.state = { expanded: true, stateNumbers: {} };
  }

  toggleVisibility(current) {
    this.setState({ expanded: !current });
  }

  updateStates(fieldToUpdate, fieldStates) {
    this.fieldStates[fieldToUpdate] = fieldStates;
    let selected = 0;
    let excluded = 0;
    Object.entries(this.fieldStates).forEach((entry) => {
      selected += entry[1].qSelected;
      excluded += entry[1].qExcluded;
    });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({ stateNumbers: { selected, excluded } });
    }, 100);
  }

  render() {
    const { table, app } = this.props;
    const { expanded, stateNumbers } = this.state;
    const fields = table.qFields
      .filter(f => f.qKeyType !== 'NOT_KEY')
      .map(f => (
        <li
          key={f.qName}
          className="item"
          onClick={evt => renderFilterbox(app, f.qName, evt.target)}
        >
          <Field
            app={app}
            field={f.qName}
            onChange={states => this.updateStates(f.qName, states)}
          />
        </li>
      ));
    const list = (
      <ul>
        {fields}
      </ul>
    );
    const classes = ['table'];
    if (expanded) {
      classes.push('expanded');
    }
    if (stateNumbers.selected) {
      classes.push('has-selections');
    }
    return (
      <div key={table.qName} className={classes.join(' ')}>
        <div className="header">
          {table.qName}
          <i
            tabIndex="0"
            role="button"
            className="material-icons toggle"
            onClick={() => this.toggleVisibility(expanded)}
          >
            {expanded ? 'expand_more' : 'expand_less'}
          </i>
        </div>
        {expanded && list}
      </div>
    );
  }
}

Table.propTypes = {
  app: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired,
};
