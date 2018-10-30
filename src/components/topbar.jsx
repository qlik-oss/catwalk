import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';

import Selections from './selections';
import logo from '../assets/catwalk.svg';

import './topbar.scss';

export default function TopBar({ app, appLayout: { qLastReloadTime } }) {
  const [lastReloadString, setLastReloadString] = useState('');
  const [lastRefresh, setLastRefresh] = useState(null);
  const [refreshTimer, setRefreshTimer] = useState(0);

  useEffect(() => {
    const now = new Date();
    const lastReloaded = new Date(qLastReloadTime);
    const secondsSince = (now.getTime() - lastReloaded.getTime()) / 1000;
    const minutesSince = secondsSince / 60;
    const hoursSince = secondsSince / 3600;
    const interval = 5 * 1000;
    if (secondsSince < 60) {
      setLastReloadString('App reloaded less than a minute ago.');
    } else if (hoursSince < 1) {
      setLastReloadString(`App reloaded ${Math.floor(minutesSince)} ${minutesSince <= 2 ? 'minute' : 'minutes'} ago`);
    } else {
      setLastReloadString(`App reloaded at ${lastReloaded.toUTCString()}`);
    }
    setRefreshTimer(setTimeout(() => setLastRefresh(now), interval));
    return () => clearTimeout(refreshTimer);
  }, [lastRefresh]);

  return (
    <div className="topbar">
      <Selections app={app} />
      <div className="reloaded">
        {lastReloadString}
      </div>
      <div className="topbarLogo" onClick={() => { window.open('https://github.com/qlik-oss/catwalk'); }} role="navigation">
        <SVGInline className="logo" svg={logo} />
      </div>
    </div>
  );
}

TopBar.propTypes = {
  app: PropTypes.object.isRequired,
  appLayout: PropTypes.object.isRequired,
};
