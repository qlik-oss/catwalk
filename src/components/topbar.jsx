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

import Selections from './selections';
import ReloadTime from './reload-time';
import logo from '../assets/catwalk.svg';
import moreHorizontalOutline from '../assets/more-horizontal-outline.svg';

import '../assets/ReactContexify.min.css';
import './topbar.pcss';

export default function TopBar({ app, appLayout, startGuide }) {
  const lastReloadTime = appLayout ? appLayout.qLastReloadTime : '';
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
      <ReloadTime lastReloadTime={lastReloadTime} className="reloaded" />
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
  appLayout: null,
  startGuide: null,
};

TopBar.propTypes = {
  app: PropTypes.object.isRequired,
  appLayout: PropTypes.object,
  startGuide: PropTypes.func,
};
