import React from 'react';
import SVGInline from 'react-svg-inline';
import loading from '../assets/catwalk-loading.svg';

import './loading.pcss';

export default function Loading() {
  return (
    <div className="center-content">
      <SVGInline className="loading" svg={loading} />
    </div>
  );
}
