import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

export default function ScrollArea({
  width, height, className, children,
}) {
  const scrollArea = useRef(null);
  const pan = useRef({});
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollStyle, setScrollStyle] = useState({ style: { width, height, overflow: 'auto' } });
  const onMouseUp = () => {
    if (isScrolling) {
      const cursorStyle = { ...scrollStyle.style, cursor: 'unset' };
      setIsScrolling(false);
      setScrollStyle({ style: cursorStyle });
    }
  };

  const onMouseDown = (evt) => {
    if (evt.target.tagName === 'INPUT') return;
    if (!isScrolling) {
      const { clientX, clientY } = evt;
      pan.current.x = clientX;
      pan.current.y = clientY;
      const cursorStyle = { ...scrollStyle.style, cursor: 'grab' };
      setIsScrolling(true);
      setScrollStyle({ style: cursorStyle });
      if (document.activeElement.tagName !== 'INPUT') {
        evt.preventDefault();
      }
    }
  };

  const onMouseMove = (evt) => {
    if (isScrolling) {
      scrollArea.current.scrollLeft -= (-pan.current.x + (pan.current.x = evt.clientX));
      scrollArea.current.scrollTop -= (-pan.current.y + (pan.current.y = evt.clientY));
    }
  };

  const renderChildren = (dom) => React.cloneElement(dom, { onMouseUp, onMouseDown });

  return (
    <div
      className={className}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      ref={scrollArea}
      style={scrollStyle.style}
      role="tablist"
      tabIndex={-1}
    >
      {children && renderChildren(children)}
    </div>
  );
}

ScrollArea.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired,
};
