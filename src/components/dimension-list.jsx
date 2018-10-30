import React from 'react';
import PropTypes from 'prop-types';


import './dimension-list.scss';

export function DimensionList(props) {
  const { dimensionList, onDimensionClicked } = props;
  console.log('dimensionList', dimensionList, props);
  if (dimensionList) {
    return (
      <div className="measure-list">
        { dimensionList.map(dimensionItem => (
          <div className="measure-item" tabIndex="-1" role="button" onClick={(e) => onDimensionClicked(dimensionItem)} title={dimensionItem.qMeta.description} key={dimensionItem.qInfo.qId}>{dimensionItem.qMeta.title}</div>
        ))
        }
      </div>
    );
  }
  return <div>No measures</div>;
}
DimensionList.propTypes = {
  dimensionList: PropTypes.arrayOf(PropTypes.object),
  onDimensionClicked: PropTypes.func.isRequired,
};

DimensionList.defaultProps = {
  measureList: null,
};

export default MeasureList;
