import React from 'react';
import PropTypes from 'prop-types';

/**
 * Not finished, just moved unused things out of Filterbox for popping it out of the dom.
 */
export class Popover extends React.Component {
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

  render() {
    const { style } = this.state;
    return (
      <div style={style} />
    );
  }
}

Popover.defaultProps = {
  alignTo: null,
  onClose: null,
};

Popover.propTypes = {
  alignTo: PropTypes.object,
  onClose: PropTypes.func,
};

export default Popover;
