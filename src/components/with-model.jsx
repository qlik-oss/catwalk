import React from 'react';
import PropTypes from 'prop-types';
import renderDebouncer from './render-debouncer';

function withModel({ WrappedComponent, createModel, updateOnAppInvalidation = false }) {
  class WithModel extends React.Component {
    constructor(props) {
      super(props);
      this.state = { model: null };
      this.updateModel = this.updateModel.bind(this);
      this.appChanged = this.appChanged.bind(this);
    }

    componentDidMount() {
      this.updateModel(true);
    }

    componentWillUnmount() {
      const { app } = this.props;
      app.removeListener('changed', this.appChanged);
      // Make sure pending promises doesn't trigger any internal
      // react logic after we're unmounted. It's either this,
      // or wrapping all promises so that we can reject them...
      this.setState = () => {};
    }

    async appChanged() {
      const { app } = this.props;
      const appProperties = await app.getAppProperties();
      const currentReloadTime = appProperties.qLastReloadTime;
      if (app.lastReloadTime !== currentReloadTime) {
        app.lastReloadTime = currentReloadTime;
        this.updateModel();
      }
    }

    async updateModel(firstTime) {
      const { app } = this.props;
      try {
        const model = await createModel(app, this.props);
        if (firstTime && updateOnAppInvalidation) {
          app.on('changed', this.appChanged);
        }
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
