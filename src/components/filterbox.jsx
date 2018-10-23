import React from 'react';
import PropTypes from 'prop-types';

import withApp from './with-app';
import withModel from './with-model';
import withLayout from './with-layout';

import './filterbox.css';

const KEY_ENTER = 13;

function preventDefaultFn(event) {
  event.stopPropagation();
}
export class Filterbox extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    const { alignTo } = this.props;
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
  }

  componentWillUnmount() {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  }

  search(evt) {
    const { value } = evt.target;
    const { keyCode } = evt;
    const { model } = this.props;
    if (keyCode === KEY_ENTER) {
      model.acceptListObjectSearch('/qListObjectDef', true);
      evt.target.blur();
    } else {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(
        () => model.searchListObjectFor('/qListObjectDef', value),
        300,
      );
    }
  }

  toggleValue(event, item) {
    event.stopPropagation();
    const { model } = this.props;
    model.selectListObjectValues('/qListObjectDef', [item.qElemNumber], true);
  }

  render() {
    const { style } = this.state;
    const { layout } = this.props;
    if (!layout) {
      return null;
    }
    if (!layout.qListObject.qDataPages || layout.qListObject.qDataPages.length === 0) {
      return null;
    }
    const items = layout.qListObject.qDataPages[0].qMatrix.map((matrixItem) => {
      const item = matrixItem[0];
      const classes = `item state-${item.qState}`;
      return (
        <li
          key={item.qElemNumber}
          className={classes}
          onClick={event => this.toggleValue(event, item)}
        >
          {item.qText
            + (item.qFrequency && item.qFrequency !== '1'
              ? ` (${item.qFrequency}x)`
              : '')}
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
        <div role="Listbox" tabIndex="-1" className="filterbox empty" style={style} onClick={preventDefaultFn}>
          {search}
          <ul className="items">
            <li>No values.</li>
          </ul>
        </div>
      );
    }
    return (
      <div role="Listbox" tabIndex="-1" className="filterbox" style={style} onClick={preventDefaultFn}>
        {search}
        <ul className="items">{items}</ul>
      </div>
    );
  }
}

Filterbox.defaultProps = {
  model: null,
  layout: null,
  alignTo: null,
  onClose: null,
};

Filterbox.propTypes = {
  model: PropTypes.object,
  layout: PropTypes.object,
  field: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
  alignTo: PropTypes.object,
  onClose: PropTypes.func,
};

export default withApp(withModel({ WrappedComponent: withLayout(Filterbox), createModel: (app, props) => app.getOrCreateListbox(props.field, 20) }));
