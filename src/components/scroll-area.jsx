import React from 'react';
import PropTypes from 'prop-types';

class ScrollArea extends React.Component {
  constructor(props) {
    super(props);
    this.scrollArea = React.createRef();
    this.state = {
      isScrolling: false,
      scrollAreaStyle: { style: { height: props.height, width: props.width, overflow: 'auto' } },
    };
  }

  onMouseUp = () => {
    const { isScrolling, scrollAreaStyle } = this.state;
    if (isScrolling) {
      const cursorStyle = {
        ...scrollAreaStyle.style,
        cursor: 'unset',
      };
      this.setState({ isScrolling: false, scrollAreaStyle: { style: cursorStyle } });
    }
  }

  onMouseDown = (event) => {
    const { isScrolling, scrollAreaStyle } = this.state;
    if (!isScrolling) {
      this.lastClientX = event.clientX;
      this.lastClientY = event.clientY;
      const cursorStyle = {
        ...scrollAreaStyle.style,
        cursor: 'grab',
      };
      this.setState({ isScrolling: true, scrollAreaStyle: { style: cursorStyle } });
      //event.preventDefault();
    }
  }

  onMouseMove = (event) => {
    const { isScrolling } = this.state;
    if (isScrolling) {
      this.scrollArea.scrollLeft -= (-this.lastClientX + (this.lastClientX = event.clientX));
      this.scrollArea.scrollTop -= (-this.lastClientY + (this.lastClientY = event.clientY));
    }
  }

  renderChildren(dom) {
    return React.cloneElement(dom, {
      onMouseUp: this.onMouseUp,
      onMouseDown: this.onMouseDown,
    });
  }

  render() {
    const { scrollAreaStyle } = this.state;
    const { className, children } = this.props;
    return (
      <div
        className={className}
        {...scrollAreaStyle}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
        ref={(e) => { this.scrollArea = e; }}
        role="tabList"
        tabIndex={-1}
      >
        {children && this.renderChildren(children)}
      </div>
    );
  }
}

ScrollArea.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
};

export default ScrollArea;
