import React from 'react';

/**
 * Component not implemented yet (ish). Lots of logic to go here to render
 * lines between fields in a good way.
 */

/* export default class Relation extends React.Component {
  constructor() {
    super();
    this.state = {
      positions: [],
      paths: [],
    };
  }

  componentWillMount() {
    const { relation } = this.props;
    const paths = relation.qTables.map(t => (<path key={t} d="" />));
    this.setState({ paths });
  }

  updatePositions(ids) {
    const nodes = document.querySelectorAll(ids);
    [...nodes].forEach((node) => {
      const rect = node.getBoundingClientRect();
      console.log(rect);
    });
  }

  render() {
    const { relation } = this.props;
    const { paths } = this.state;
    setTimeout(() => this.updatePositions());
    return (
      <svg className="relations" xmlns="http://www.w3.org/2000/svg">
        {paths}
      </svg>
    );
  }
}
*/

export default function Relation() {
  return (<svg />);
}
