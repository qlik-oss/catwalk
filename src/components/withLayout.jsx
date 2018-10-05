import React from 'react';
import PropTypes from 'prop-types';

function withLayout(WrappedComponent, layoutUpdatedCallback) {
  class WithLayout extends React.Component {
    constructor(props) {
      super(props);
      this.state = { layout: null };
      this.refreshLayout = this.refreshLayout.bind(this);
    }

    componentDidMount() {
      const { model } = this.props;
      if (model) {
        this.updateLayout();
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
      model.removeListener('changed', this.refreshLayout);
      // Make sure pending promises doesn't trigger any internal
      // react logic after we're unmounted. It's either this,
      // or wrapping all promises so that we can reject them...
      this.setState = () => {};
    }

    handleError(error) {
      this.setState({ layout: null, error });
    }

    async updateLayout() {
      const { model } = this.props;
      try {
        if (model) {
          const layout = await model.getLayout();
          model.on('changed', this.refreshLayout);
          this.setState({ layout, error: null });
        }
      } catch (error) {
        this.handleError(error);
      }
    }

    async refreshLayout() {
      const { model } = this.props;
      try {
        const layout = await model.getLayout();
        if (layoutUpdatedCallback) {
          layoutUpdatedCallback(layout);
        }
        this.setState({ layout, error: null });
      } catch (error) {
        this.handleError(error);
      }
    }

    render() {
      const { layout } = this.state;
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
