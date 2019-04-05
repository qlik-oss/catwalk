import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import cat from '../assets/peeking.svg';

import './cat-with-bubble.pcss';

export default function CatWithBubble({ text, onClick, width }) {
  return (
    <div>
      <SVGInline className="cat" svg={cat} />
      <p className="bubble" onClick={onClick} style={{ width: `${width}` }}>
        {text}
      </p>
    </div>
  );
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
