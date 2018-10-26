import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import Selections from './selections';
import logo from '../assets/catwalk.svg';

import './topbar.scss';

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { lastReloaded: '' };
    this.setLastReloaded = this.setLastReloaded.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { lastReloadTime } = this.props;
    if (lastReloadTime && lastReloadTime !== prevProps.lastReloadTime) {
      this.setLastReloaded();
    }
  }

  componentWillUnmount() {
    clearInterval(this.lastReloadInterval);
  }

  setLastReloaded() {
    const { lastReloadTime } = this.props;
    const lastReloaded = new Date(lastReloadTime);
    const now = new Date(Date.now());
    const secondsSince = (now.getTime() - lastReloaded.getTime()) / 1000;
    const minutesSince = secondsSince / 60;
    const hoursSince = secondsSince / 3600;
    if (secondsSince < 60) {
      this.lastReloadInterval = setInterval(this.setLastReloaded, 60 * 1000);
      this.setState({ lastReloaded: 'App reloaded less than a minute ago.' });
    } else if (hoursSince < 1) {
      this.lastReloadInterval = setInterval(this.setLastReloaded, 60 * 1000);
      this.setState({ lastReloaded: `App reloaded ${Math.floor(minutesSince)} ${minutesSince <= 2 ? 'minute' : 'minutes'} ago` });
    } else {
      clearInterval(this.lastReloadInterval);
      this.setState({ lastReloaded: `App reloaded at ${lastReloaded.toUTCString()}` });
    }
  }

  render() {
    const { lastReloaded } = this.state;
    return (
      <div className="topbar">
        <Selections />
        <div className="reloaded">
          {lastReloaded}
        </div>
        <div className="topbarLogo" onClick={() => { window.open('https://github.com/qlik-oss/catwalk'); }} role="navigation">
          <SVGInline className="logo" svg={logo} />
        </div>
      </div>
    );
  }
}

TopBar.propTypes = {
  lastReloadTime: PropTypes.string,
};

TopBar.defaultProps = {
  lastReloadTime: null,
};

export default TopBar;
