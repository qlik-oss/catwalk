import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function ReloadTime({ lastReloadTime, className }) {
  const [lastReloadString, setLastReloadString] = useState('');
  const [lastRefresh, setLastRefresh] = useState(null);
  const [refreshTimer, setRefreshTimer] = useState(0);

  useEffect(() => {
    if (lastReloadTime === '') {
      return undefined;
    }
    const now = new Date();
    const interval = 5 * 1000;
    const lastReloaded = new Date(lastReloadTime);
    const secondsSince = (now.getTime() - lastReloaded.getTime()) / 1000;
    const minutesSince = secondsSince / 60;
    const hoursSince = secondsSince / 3600;

    if (secondsSince < 60) {
      setLastReloadString('App reloaded less than a minute ago.');
    } else if (hoursSince < 1) {
      setLastReloadString(`App reloaded ${Math.floor(minutesSince)} ${minutesSince <= 2 ? 'minute' : 'minutes'} ago`);
    } else {
      setLastReloadString(`App reloaded at ${lastReloaded.toUTCString()}`);
    }
    setRefreshTimer(setTimeout(() => { setLastRefresh(now); }, interval));
    return () => clearTimeout(refreshTimer);
  }, [lastRefresh, lastReloadTime]);

  return (
    <div className={className}>
      {lastReloadString}
    </div>
  );
}

ReloadTime.propTypes = {
  lastReloadTime: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};
