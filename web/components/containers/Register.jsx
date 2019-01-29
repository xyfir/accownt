import React from 'react';

// Components
import Account from 'components/register/Account';
import Service from 'components/register/Service';

export default class Register extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    switch (this.props.path[2]) {
      case 'service':
        return <Service />;
      default:
        return <Account />;
    }
  }
}
