import React from 'react';

// Components
import Passwordless from 'components/login/Passwordless';
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
    const hash = location.hash.split('?')[0].split('/');

    switch (hash[2]) {
      case 'passwordless':
        return <Passwordless {...this.state} save={this._save} />;
      case 'recovery':
        return <Recovery {...this.state} save={this._save} />;
      case 'service':
        return <Service {...this.state} save={this._save} />;
      case 'verify':
        return <Step2 {...this.state} save={this._save} />;
      default:
        // Support old service login links at `#/login/:id`
        if (hash[2])
          return <Service {...this.state} save={this._save} />;
        else
          return <Step1 {...this.state} save={this._save} />;
    }
  }
  
}