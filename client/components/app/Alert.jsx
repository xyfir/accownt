import { Snackbar } from 'react-md';
import React from 'react';

export default class AppAlert extends React.Component {

  constructor(props) {
    super(props);

    this.state = { toasts: [] };
  }

  /**
   * Remove first element from toasts array.
   */
  onDismissAlert() {
    const [, ...toasts] = this.state.toasts;
    this.setState({ toasts });
  }

  /**
   * Creates a 'toast' for react-md Snackbar component.
   * @param {string} message - The text content of the toast.
   */
  _alert(message) {
    this.setState({
      toasts: this.state.toasts.concat([{ text: message }])
    });
  }

  render() {
    return (
      <Snackbar
        toasts={this.state.toasts}
        onDismiss={() => this.onDismissAlert()}
      />
    );
  }

}