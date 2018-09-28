import React from 'react';
import PropTypes from 'prop-types';

import Field from './field';

import './selections.css';

export default class Selections extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const { app } = this.props;
    app.createSessionObject({
      qInfo: { qType: 'selections' },
      qSelectionObjectDef: {},
    }).then((object) => {
      this.setState({ object });
      object.on('changed', () => this.refresh());
      this.refresh();
    });
  }

  refresh() {
    const { object } = this.state;
    object.getLayout().then(layout => this.setState({ layout }));
  }

  render() {
    const { app } = this.props;
    const { layout } = this.state;
    if (!layout) {
      return null;
    }
    const items = layout.qSelectionObject.qSelections.map(item => (
      <li key={item.qField}>
        <strong title={item.qField}>
          {item.qField}
        </strong>
        <Field app={app} field={item.qField} onlyBar />
      </li>
    ));
    if (!items.length) {
      items.push((
        <li key="none" className="none">
No selections made.
        </li>
      ));
    }
    return (
      <ul className="selections">
        <li key="clear" className="clear" onClick={() => app.clearAll()}>
          <i className="material-icons">
close
          </i>
        </li>
        {items}
      </ul>
    );
  }
}

Selections.propTypes = {
  app: PropTypes.object.isRequired,
};
