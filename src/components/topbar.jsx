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
import demoApp from '../demo-app';
import { getWebIntegrationId, getParamFromEngineUrl, assignEngineUrl } from '../util';

import Selections from './selections';
import ReloadTime from './reload-time';
import logo from '../assets/catwalk.svg';
import moreHorizontalOutline from '../assets/more-horizontal-outline.svg';

import '../assets/ReactContexify.min.css';
import './topbar.pcss';

export default function TopBar({
  app, appLayout, startGuide, isLocalStorage,
}) {
  const chooseApp = () => {
    // we need to add connected ws, if any.
    const engineURL = new URLSearchParams(document.location.search).get('engine_url');
    let wsUrl = '';
    if (engineURL) {
      if (engineURL !== demoApp) {
        const newEngineURL = new URL(engineURL);
        let searchParams = '';
        const wid = getWebIntegrationId();
        if (wid) {
          const csrf = getParamFromEngineUrl('qlik-csrf-token');
          searchParams = `?qlik-web-integration-id=${wid}&qlik-csrf-token=${csrf}`;
        }
        wsUrl = `${newEngineURL.origin}${newEngineURL.pathname.replace(/[^/]*$/.exec(newEngineURL.pathname)[0], '')}`;
        if (searchParams) {
          wsUrl += searchParams;
        }
      }
    }
    assignEngineUrl(wsUrl);
  };

  const goToGithub = () => {
    window.open('https://github.com/qlik-oss/catwalk');
  };

  const goToDataPolicy = () => {
    window.open('https://github.com/qlik-oss/catwalk/blob/master/README.md#Data-Policy');
  };

  const TopbarMenu = () => (
    <Menu id="menu_id" className="menu" animation={animation.fade}>
      <Item onClick={chooseApp}>Choose App</Item>
      <Separator />
      <Item onClick={startGuide}>Start Guide</Item>
      <Separator />
      <Item onClick={goToGithub}>Go to GitHub</Item>
      <Separator />
      <Item onClick={goToDataPolicy}>Data Policy</Item>
    </Menu>
  );
  let selections;
  let reloaded;
  let star;
  if (app) {
    selections = <Selections app={app} />;
    if (appLayout) {
      reloaded = <ReloadTime lastReloadTime={appLayout.qLastReloadTime} className="reloaded" />;
      star = <Star isLocalStorage={isLocalStorage} />;
    }
  }
  return (
    <div className="topbar">
      <div className="topbarLogo" onClick={goToGithub} role="navigation">
        <SVGInline className="logo" svg={logo} />
      </div>
      {selections}
      {star}
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
  isLocalStorage: false,
};

TopBar.propTypes = {
  app: PropTypes.object,
  appLayout: PropTypes.object,
  startGuide: PropTypes.func,
  isLocalStorage: PropTypes.bool,
};
