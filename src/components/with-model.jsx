import React from 'react';
import PropTypes from 'prop-types';

function withModel(WrappedComponent, createModel) {
  class WithModel extends React.Component {
    constructor(props) {
      super(props);
      this.state = { model: null };
      this.updateModel = this.updateModel.bind(this);
    }

    componentDidMount() {
      this.updateModel();
    }

    componentWillUnmount() {
      // Make sure pending promises doesn't trigger any internal
      // react logic after we're unmounted. It's either this,
      // or wrapping all promises so that we can reject them...
      this.setState = () => {};
    }

    handleError(error) {
      this.setState({ model: null, error });
    }

    async updateModel() {
      const { app } = this.props;
      try {
        const model = await createModel(app, this.props);
        this.setState({ model, error: null });
      } catch (error) {
        this.handleError(error);
      }
    }

    render() {
      const { model, error } = this.state;
      if (!model || error) {
        return null;
      }

      return <WrappedComponent {...this.props} model={model} />;
    }
  }

  WithModel.propTypes = {
    app: PropTypes.object.isRequired,
  };

  return WithModel;
}

export default withModel;
