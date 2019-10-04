import React, { useState } from 'react';
import SVGInline from 'react-svg-inline';
import { getWebIntegrationId, getParamFromEngineUrl } from '../util';
import star from '../assets/star.svg';

export default function Star() {
  const engineURL = new URLSearchParams(document.location.search).get('engine_url');
  let wsUrl = '';
  if (engineURL) {
    const wid = getWebIntegrationId();
    let searchParams = '';
    if (wid) {
      const csrf = getParamFromEngineUrl('qlik-csrf-token');
      searchParams = `/?qlik-web-integration-id=${wid}&qlik-csrf-token=${csrf}`;
    }
    wsUrl = new URL(engineURL).origin + (searchParams ? `${searchParams}` : '');
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
