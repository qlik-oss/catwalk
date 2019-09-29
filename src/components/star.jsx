import React, { useState } from 'react';
import SVGInline from 'react-svg-inline';
import star from '../assets/star.svg';

export default function Star() {
  const engineURL = new URLSearchParams(document.location.search).get('engine_url');
  let wsUrl = '';
  if (engineURL) {
    wsUrl = new URL(engineURL).origin;
  }
  const [starred, setStarred] = useState(localStorage.getItem('websocketUrl') === wsUrl);

  const starClick = () => {
    if (localStorage.getItem('websocketUrl') !== wsUrl) {
      localStorage.setItem('websocketUrl', wsUrl);
      setStarred(true);
    } else {
      localStorage.removeItem('websocketUrl');
      setStarred(false);
    }
  };

  let starClass = 'unstarred';
  let starTitle = `Use the connected websocket ${wsUrl} as default`;
  if (starred) {
    starClass = 'starred';
    starTitle = `Remove ${wsUrl} from default`;
  }

  return (
    <div className="star" onClick={starClick} role="navigation" title={starTitle}>
      <SVGInline className={`star ${starClass}`} svg={star} />
    </div>
  );
}
