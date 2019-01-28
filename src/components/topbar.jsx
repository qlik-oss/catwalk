import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import {
  Menu,
  Item,
  MenuProvider,
  animation,
  Separator,
} from 'react-contexify';

import Selections from './selections';
import logo from '../assets/catwalk.svg';
import moreHorizontalOutline from '../assets/more-horizontal-outline.svg';

import 'react-contexify/dist/ReactContexify.min.css';
import './topbar.pcss';

export default function TopBar({ app, appLayout: { qLastReloadTime }, startGuide }) {
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

  const chooseApp = () => {
    const URLobject = new URL(window.location.href);
    window.location.assign(`${URLobject.protocol}//${window.location.host}`);
  };
  const goToGithub = () => {
    window.open('https://github.com/qlik-oss/catwalk');
  };

  const TopbarMenu = () => (
    <Menu id="menu_id" className="menu" animation={animation.fade}>
      <Item onClick={chooseApp}>Choose App</Item>
      <Separator />
      <Item onClick={startGuide}>Start Guide</Item>
      <Separator />
      <Item onClick={goToGithub}>Go to GitHub</Item>
    </Menu>
  );

  return (
    <div className="topbar">
      <div className="topbarLogo" onClick={goToGithub} role="navigation">
        <SVGInline className="logo" svg={logo} />
      </div>
      <Selections app={app} />
      <div className="reloaded">
        {lastReloadString}
      </div>
      <MenuProvider id="menu_id" event="onClick" className="menu-provider">
        <div>
          <SVGInline className="more-icon" svg={moreHorizontalOutline} />
        </div>
      </MenuProvider>
      <TopbarMenu />
    </div>
  );
}

TopBar.defaultProps = {
  startGuide: null,
};

TopBar.propTypes = {
  app: PropTypes.object.isRequired,
  appLayout: PropTypes.object.isRequired,
  startGuide: PropTypes.func,
};
