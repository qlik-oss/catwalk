import React from 'react';
import PropTypes from 'prop-types';

import Table from './table';
import Relation from './relation';
import './model.css';

export default class Model extends React.Component {
  componentDidMount() {
    const { app } = this.props;
    app.getTablesAndKeys({}, {}, 0, true, false)
      .then(tablesAndKeys => this.setState({ tablesAndKeys }));
  }

  render() {
    if (!this.state) {
      return null;
    }
    const { app } = this.props;
    const { tablesAndKeys } = this.state;
    const tables = tablesAndKeys.qtr
      .sort((a, b) => b.qFields.length - a.qFields.length)
      .map(t => (
        <div key={t.qName} className="item">
          <Table app={app} table={t} />
        </div>
      ));
    const relations = tablesAndKeys.qk
      .map(r => (<Relation key={r.qKeyFields.join('-')} relation={r} />));
    return (
      <div className="model">
        <div className="relations">
          {relations}
        </div>
        <div className="tables">
          {tables}
        </div>
      </div>
    );
  }
}

Model.propTypes = {
  app: PropTypes.object.isRequired,
};
