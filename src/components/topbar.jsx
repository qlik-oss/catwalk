import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';

import Selections from './selections';
import logo from '../assets/catwalk.svg';

import './topbar.scss';

export default function TopBar({ lastReloadTime }) {
  const [lastReloadString, setLastReloadString] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  useEffect(() => {
    const now = new Date();
    const lastReloaded = new Date(lastReloadTime);
    const secondsSince = (now.getTime() - lastReloaded.getTime()) / 1000;
    const minutesSince = secondsSince / 60;
    const hoursSince = secondsSince / 3600;
    const interval = 60 * 1000;
    if (secondsSince < 60) {
      setLastReloadString('App reloaded less than a minute ago.');
    } else if (hoursSince < 1) {
      setLastReloadString(`App reloaded ${Math.floor(minutesSince)} ${minutesSince <= 2 ? 'minute' : 'minutes'} ago`);
    } else {
      setLastReloadString(`App reloaded at ${lastReloaded.toUTCString()}`);
    }
    setTimeout(() => setLastRefresh(now), interval);
  }, [lastRefresh]);

  return (
    <div className="topbar">
      <Selections />
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
  lastReloadTime: PropTypes.string,
};

TopBar.defaultProps = {
  lastReloadTime: '',
};
