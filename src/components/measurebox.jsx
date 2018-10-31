import React from 'react';
import PropTypes from 'prop-types';

import MeasureList from './measure-list';
import HypercubeTable from './hypercube-table';
import './measurebox.scss';


function findAttribute(event, attrName) {
  let el = event.target;
  while (!!el && !el.getAttribute(attrName)) {
    el = el.parentElement;
  }

  const field = el && el.getAttribute(attrName);
  return field;
}


export class Measurebox extends React.Component {
  constructor() {
    super();
    this.state = { dimensionList: [] };
    this.onMeasureClicked = this.onMeasureClicked.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);
  }

  async componentDidMount() {
    const { app } = this.props;
    const sessionObject = await app.createSessionObject({ qInfo: { qId: 'MeasureList', qType: 'MeasureList' }, qMeasureListDef: { qType: 'measure', qData: { title: '/qMetaDef/title', expression: '/qMeasure/qDef' } } });
    const layout = await sessionObject.getLayout();


    const measureList = layout.qMeasureList.qItems;
    const currentMeasure = measureList[0];
    this.setState({ measureList, currentMeasure });
    document.addEventListener('click', this.onDocumentClick, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick, true);
  }

  onDocumentClick(event) {
    const field = findAttribute(event, 'fieldz');
    if (event.ctrlKey || event.metaKey) {
      const { measureList, currentMeasure, dimensionList } = this.state;
      const dimIndex = dimensionList.indexOf(field);
      if (dimensionList.indexOf(field) >= 0) {
        dimensionList.splice(dimIndex, 1)
      } else if (dimensionList.indexOf(field) === -1) {
        dimensionList.push(field);
      }
      console.log('global click with ctl', field);
      this.setState({ measureList, currentMeasure, dimensionList });
    }
  }

  onMeasureClicked(currentMeasure) {
    const { measureList, dimensionList } = this.state;
    this.setState({ measureList, currentMeasure, dimensionList });
  }

  render() {
    const { measureList, currentMeasure, dimensionList } = this.state;
    const { app } = this.props;
    if (currentMeasure) {
      return (
        <div className="measurebox">
          <HypercubeTable app={app} measure={currentMeasure} dimensions={dimensionList} />
          <MeasureList measureList={measureList} onMeasureClicked={this.onMeasureClicked} />
        </div>
      );
    }
    return null;
  }
}

Measurebox.propTypes = {
  app: PropTypes.object,
};

Measurebox.defaultProps = {
  app: null,
};

export default Measurebox;
