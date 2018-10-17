import React from 'react';
import PropTypes from 'prop-types';
import renderDebouncer from './render-debouncer';

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

    async updateModel() {
      const { app } = this.props;
      try {
        const model = await createModel(app, this.props);
        renderDebouncer(() => this.setState({ model, error: null }));
      } catch (error) {
        renderDebouncer(() => this.setState({ model: null, error }));
      }
    }

    render() {
      const { model, error } = this.state;
      if (error) {
        throw error;
      }

      if (!model) {
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
