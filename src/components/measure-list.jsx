import React from 'react';
import PropTypes from 'prop-types';


import './measure-list.scss';

export function MeasureList(props) {
  const { measureList, onMeasureClicked } = props;
  if (measureList) {
    return (
      <div className="measure-list">
        { measureList.map(measureItem => (
          <div className="measure-item" tabIndex="-1" role="button" onClick={() => onMeasureClicked(measureItem)} title={measureItem.qMeta.description} key={measureItem.qInfo.qId}>{measureItem.qMeta.title}</div>
        ))
        }
      </div>
    );
  }
  return <div>No measures</div>;
}
MeasureList.propTypes = {
  measureList: PropTypes.arrayOf(PropTypes.object).isRequired,
  onMeasureClicked: PropTypes.func.isRequired,
};


export default MeasureList;
