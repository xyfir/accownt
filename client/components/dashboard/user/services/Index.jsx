import React from 'react';

// Components
import List from 'components/dashboard/user/services/List';
import View from 'components/dashboard/user/services/View';

export default class Services extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (location.hash == '#/dashboard/user/services') return <List />;
    else return <View />;
  }
}
