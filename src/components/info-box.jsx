import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SVGsuccess from '../assets/checkmark-circle-2-outline.svg';
import SVGwarning from '../assets/alert-triangle-outline.svg';
import './info-box.pcss';

const context = React.createContext();

const InfoBoxContainer = ({ className, children }) => (
  <div className={className}>
    {children}
  </div>
);

InfoBoxContainer.propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

InfoBoxContainer.defaultProps = {
  children: null,
};

const InfoBox = ({ children, alert, visible }) => (
  <div className={`info-box ${visible ? 'visible' : 'hidden'}`}>
    {
      alert === 'success'
        ? <SVGsuccess className={`alert ${alert}`} />
        : <SVGwarning className={`alert ${alert}`} />
    }
    {children}
  </div>
);

InfoBox.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  alert: PropTypes.string.isRequired,
  visible: PropTypes.bool,
};

InfoBox.defaultProps = {
  visible: true,
};

export function InfoBoxProvider({ children }) {
  const [infoBox, setInfoBox] = useState(null);
  const [showTimer, setShowTimer] = useState(0);
  const [animateOutTimer, setAnimateOutTimer] = useState(0);

  useEffect(() => { clearTimeout(showTimer); clearTimeout(animateOutTimer); }, []);

  const show = (alert, text) => {
    const id = Math.random().toString(36).substring(2, 9);
    setAnimateOutTimer(setTimeout(() => {
      setInfoBox({
        content: text, id, alert, visible: false,
      });
    }, 4000));
    setShowTimer(setTimeout(() => { setInfoBox(null); }, 5000));
    setInfoBox({
      content: text, id, alert, visible: true,
    });
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <context.Provider value={{ show }}>
      {children}
      <InfoBoxContainer className="info-box-container">
        {infoBox
          ? (
            <InfoBox key={infoBox.id} alert={infoBox.alert} visible={infoBox.visible}>
              <p>{infoBox.content}</p>
            </InfoBox>
          ) : null}
      </InfoBoxContainer>
    </context.Provider>
  );
}

InfoBoxProvider.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export const useInfoBox = () => useContext(context);
