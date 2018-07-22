import React from 'react';

// Components
import Recovery from 'components/login/Recovery';
import Service from 'components/login/Service';
import Step1 from 'components/login/Step1';
import Step2 from 'components/login/Step2';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this._save = this._save.bind(this);
  }

  /**
   * Allows child components to pass data around to other components as props.
   */
  _save(data) {
    this.setState(data);
  }

  render() {
    const path = location.pathname.split('/');

    switch (path[2]) {
      case 'recovery':
        return <Recovery {...this.state} save={this._save} />;
      case 'service':
        return <Service {...this.state} save={this._save} />;
      case 'verify':
        return <Step2 {...this.state} save={this._save} />;
      default:
        return <Step1 {...this.state} save={this._save} />;
    }
  }
}
