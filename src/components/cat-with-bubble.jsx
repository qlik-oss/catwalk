import React, { useState } from 'react';
import PropTypes from 'prop-types';

import SVGcat from '../assets/peekaboocat.svg';
import SVGclose from '../assets/close-outline.svg';

import './cat-with-bubble.pcss';

export default function CatWithBubble({ text, onClick, width }) {
  const [show, setShow] = useState(true);

  const hide = () => {
    setShow(false);
  };

  if (show) {
    return (
      <div className="cat-with-bubble">
        <SVGclose className="close-me" onClick={() => hide()} title="Hide cat" />
        <SVGcat className="cat" />
        <p className="bubble" onClick={onClick} style={{ width: `${width}` }}>
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
