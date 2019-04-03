import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import {
  Menu,
  Item,
  MenuProvider,
  animation,
  Separator,
} from 'react-contexify';
import Star from './star';

import Selections from './selections';
import ReloadTime from './reload-time';
import logo from '../assets/catwalk.svg';
import moreHorizontalOutline from '../assets/more-horizontal-outline.svg';

import '../assets/ReactContexify.min.css';
import './topbar.pcss';

export default function TopBar({ app, appLayout, startGuide }) {
  const chooseApp = () => {
    // we need to add connected ws, if any.
    const engineUrl = new URLSearchParams(document.location.search).get('engine_url');
    let wsUrl = '';
    if (engineUrl) {
      wsUrl = new URL(engineUrl).origin;
    }
    const URLobject = new URL(window.location.href);
    window.location.assign(`${URLobject.protocol}//${window.location.host}?engine_url=${wsUrl}`);
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
  let selections;
  let reloaded;
  if (app) {
    selections = <Selections app={app} />;
    if (appLayout) {
      reloaded = <ReloadTime lastReloadTime={appLayout.qLastReloadTime} className="reloaded" />;
    }
  }
  return (
    <div className="topbar">
      <div className="topbarLogo" onClick={goToGithub} role="navigation">
        <SVGInline className="logo" svg={logo} />
      </div>
      {selections}
      <Star />
      {reloaded}
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
  app: null,
  appLayout: null,
  startGuide: null,
};

TopBar.propTypes = {
  app: PropTypes.object,
  appLayout: PropTypes.object,
  startGuide: PropTypes.func,
};
