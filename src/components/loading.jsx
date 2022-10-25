import React from 'react';
import SVGLoading from '../assets/catwalk-loading.svg';

import './loading.pcss';

export default function Loading() {
  return (
    <div className="center-content">
      <SVGLoading className="loading" />
    </div>
  );
}
