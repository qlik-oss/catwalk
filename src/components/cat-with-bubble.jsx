import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import cat from '../assets/peeking.svg';
import close from '../assets/close-outline.svg';

import './cat-with-bubble.pcss';

export default function CatWithBubble({ text, onClick, width }) {
  const [show, setShow] = useState(true);
  const [totalWidth, setTotalWidth] = useState(null);
  const bubbleElement = useRef(null);
  useEffect(() => {
    if (bubbleElement && bubbleElement.current) {
      setTotalWidth({ width: `${bubbleElement.current.getBoundingClientRect().right}px` });
    }
  }, []);

  const hide = () => {
    setShow(false);
  };

  if (show) {
    return (
      <div className="cat-with-bubble" style={totalWidth}>
        <SVGInline className="close-me" svg={close} onClick={() => hide()} title="Hide cat" />
        <SVGInline className="cat" svg={cat} />
        <p className="bubble" onClick={onClick} style={{ width: `${width}` }} ref={bubbleElement}>
          {text}
        </p>
      </div>
    );
  }
  return null;
}

CatWithBubble.defaultProps = {
  text: 'meow',
  onClick: undefined,
  width: '20em',
};

CatWithBubble.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  width: PropTypes.string,
};
