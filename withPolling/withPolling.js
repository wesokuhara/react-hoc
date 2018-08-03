import React, { Component } from 'react';

// NOTE: Import your redux store
import store from '...';

const DEFAULT_POLL_FREQUENCY = 5000;

const defaultOptions = {
  pollFn: () => null,
  frequency: DEFAULT_POLL_FREQUENCY
};

const withPolling = optionsFn => WrappedComponent => {
  return class extends Component {
    constructor(props) {
      super(props);

      const userOptions = optionsFn(store.dispatch);
      const finalOptions = Object.assign({}, defaultOptions, userOptions);

      this.state = {
        initialized: false,
        options: finalOptions
      };
    }

    componentDidMount() {
      this._mounted = true; // used to prevent the no-op of updating the state of an unmounted component
      this.init();
      document.addEventListener(
        'visibilitychange',
        this.handleVisibilityChange
      );
    }

    componentWillUnmount() {
      this._mounted = false;
      this.stopPolling();
      document.removeEventListener(
        'visibilitychange',
        this.handleVisibilityChange
      );
    }

    init = async () => {
      await this.startPolling();
      this._mounted && this.setState({ initialized: true });
    };

    handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        this.stopPolling();
      } else {
        this.startPolling();
      }
    };

    startPolling = async () => {
      if (this._timeout) return;
      this._shouldPoll = true;
      await this.poll();
    };

    stopPolling = () => {
      clearTimeout(this._timeout);
      this._timeout = undefined;
      this._shouldPoll = false;
    };

    poll = async () => {
      await this.state.options.pollFn();
      if (this._shouldPoll) {
        this._timeout = setTimeout(this.poll, this.state.options.frequency);
      }
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          initialized={this.state.initialized}
        />
      );
    }
  };
};

export default withPolling;
