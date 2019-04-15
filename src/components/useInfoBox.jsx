import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';

import alert from '../assets/alert-triangle-outline.svg';

import './info-box.pcss';

const context = React.createContext();

const InfoBoxContainer = props => (
  <div {...props} />
);

const InfoBox = ({ children, visible }) => (
  <div className={`info-box ${visible ? 'visible' : 'hidden'}`}>
    <SVGInline className="alert" svg={alert} />
    {children}
  </div>
);

InfoBox.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
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

  const show = (text) => {
    const id = Math.random().toString(36).substr(2, 9);
    setAnimateOutTimer(setTimeout(() => { setInfoBox({ content: text, id, visible: false }); }, 5000));
    setShowTimer(setTimeout(() => { setInfoBox(null); }, 6000));
    setInfoBox({ content: text, id, visible: true });
  };

  return (
    <context.Provider value={{ show }}>
      {children}
      <InfoBoxContainer className="info-box-container">
        {infoBox
          ? (
            <InfoBox key={infoBox.id} visible={infoBox.visible}>
              {infoBox.content}
            </InfoBox>
          ) : null
        }
      </InfoBoxContainer>
    </context.Provider>
  );
}

InfoBoxProvider.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export const useInfoBox = () => useContext(context);
