import React from 'react';
import PropTypes from 'prop-types';

import './filterbox.css';

const KEY_ENTER = 13;

class Filterbox extends React.Component {
  constructor() {
    super();
    this.boundRefresh = this.refresh.bind(this);
    this.state = {};
  }

  componentWillMount() {
    const { app, field, alignTo } = this.props;
    if (alignTo) {
      const rect = alignTo.getBoundingClientRect();
      this.setState({
        style: {
          position: 'absolute',
          top: rect.top + rect.height + window.scrollY,
          left: rect.left + window.scrollX - 1,
          width: rect.width + 2, // 1px border x2
        },
      });
    }
    app.getOrCreateListbox(field).then((model) => {
      this.setState({ model });
      model.on('changed', this.boundRefresh);
      this.refresh(true);
    });
  }

  componentWillUnmount() {
    const { onClose } = this.props;
    const { model } = this.state;
    if (model) {
      model.removeListener('changed', this.boundRefresh);
    }
    if (onClose) {
      onClose();
    }
  }

  search(evt) {
    const { value } = evt.target;
    const { keyCode } = evt;
    const { model } = this.state;
    let promise = Promise.resolve();
    if (keyCode === KEY_ENTER) {
      promise = model.acceptListObjectSearch('/qListObjectDef', true);
      evt.target.blur();
    } else {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => promise.then(() => model.searchListObjectFor('/qListObjectDef', value)), 300);
    }
  }

  refresh(shouldPatch) {
    const { model } = this.state;
    let promise = Promise.resolve();
    if (shouldPatch) {
      promise = model.applyPatches([{ qOp: 'replace', qPath: '/qListObjectDef/qInitialDataFetch/0/qHeight', qValue: '1000' }], false);
    }
    promise.then(() => model.getLayout().then(layout => this.setState({ layout })));
  }

  toggleValue(item) {
    const { model } = this.state;
    model.selectListObjectValues('/qListObjectDef', [item.qElemNumber], true);
  }

  render() {
    const { layout, style } = this.state;
    if (!layout) {
      return null;
    }
    const items = layout.qListObject.qDataPages[0].qMatrix.map((matrixItem) => {
      const item = matrixItem[0];
      const classes = `item state-${item.qState}`;
      return (
        <li
          key={item.qElemNumber}
          className={classes}
          onClick={() => this.toggleValue(item)}
        >
          {item.qText}
        </li>
      );
    });
    const search = (
      <input
        autoFocus
        onKeyUp={evt => this.search(evt)}
        className="search"
        placeholder="Search (wildcard)"
      />
    );
    if (!items.length) {
      return (
        <div className="filterbox empty" style={style}>
          {search}
          <p>
No values.
          </p>
        </div>
      );
    }
    return (
      <div className="filterbox" style={style}>
        {search}
        <ul className="items">
          {items}
        </ul>
      </div>
    );
  }
}

Filterbox.defaultProps = {
  alignTo: null,
  onClose: null,
};

Filterbox.propTypes = {
  app: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  alignTo: PropTypes.object,
  onClose: PropTypes.func,
};

export default Filterbox;
