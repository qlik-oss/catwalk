import React from 'react';
import PropTypes from 'prop-types';

function withLayout(WrappedComponent) {
  class WithLayout extends React.Component {
    constructor(props) {
      super(props);
      this.state = { layout: null };
      this.updateLayout = this.updateLayout.bind(this);
    }

    componentDidMount() {
      const { model } = this.props;
      if (model) {
        this.updateLayout(true);
      }
    }

    componentDidUpdate(prevProps) {
      const { model } = this.props;
      if (model !== prevProps.model) {
        this.updateLayout();
      }
    }

    componentWillUnmount() {
      const { model } = this.props;
      model.removeListener('changed', this.updateLayout);
      // Make sure pending promises doesn't trigger any internal
      // react logic after we're unmounted. It's either this,
      // or wrapping all promises so that we can reject them...
      this.setState = () => {};
    }

    async updateLayout(firstTime) {
      const { model } = this.props;
      try {
        const layout = await model.getLayout();
        if (firstTime) model.on('changed', this.updateLayout);
        this.setState({ layout, error: null });
      } catch (error) {
        this.setState({ layout: null, error });
      }
    }

    render() {
      const { layout, error } = this.state;
      if (error) {
        throw error;
      }

      if (!layout) {
        return null;
      }
      return <WrappedComponent {...this.props} layout={layout} />;
    }
  }

  WithLayout.propTypes = {
    model: PropTypes.object,
  };

  WithLayout.defaultProps = {
    model: null,
  };

  return WithLayout;
}

export default withLayout;
