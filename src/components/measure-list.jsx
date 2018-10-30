import React from 'react';
import PropTypes from 'prop-types';


import './measure-list.scss';

export function MeasureList(props) {
  const { measureList, onMeasureClicked } = props;
  console.log('measurelist ', measureList, props);
  if (measureList) {
    return (
      <div className="measure-list">
        { measureList.map(measureItem => (
          <div className="measure-item" tabIndex="-1" role="button" onClick={(e) => onMeasureClicked(measureItem)} title={measureItem.qMeta.description} key={measureItem.qInfo.qId}>{measureItem.qMeta.title}</div>
        ))
        }
      </div>
    );
  }
  return <div>No measures</div>;
}
MeasureList.propTypes = {
  measureList: PropTypes.arrayOf(PropTypes.object),
  onMeasureClicked: PropTypes.func.isRequired,
};

MeasureList.defaultProps = {
  measureList: null,
};

export default MeasureList;
