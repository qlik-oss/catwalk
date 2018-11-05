import React from 'react';
import PropTypes from 'prop-types';


import './dimension-list.pcss';

export function DimensionList(props) {
  const { dimensionList, onDimensionClicked } = props;
  if (dimensionList) {
    return (
      <div className="dimension-list">
        { dimensionList.map(dimensionItem => (
          <div className="measure-item" tabIndex="-1" role="button" onClick={() => onDimensionClicked(dimensionItem)} title={dimensionItem.qMeta.description} key={dimensionItem.qInfo.qId}>{dimensionItem.qMeta.title}</div>
        ))
        }
      </div>
    );
  }
  return <div>No measures</div>;
}
DimensionList.propTypes = {
  dimensionList: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDimensionClicked: PropTypes.func.isRequired,
};

export default DimensionList;
