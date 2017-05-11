import request from 'superagent';
import React from 'react';

// Components
import Create from 'components/dashboard/developer/Create';
import Manage from 'components/dashboard/developer/Manage';
import List from 'components/dashboard/developer/List';

export default class DeveloperDashboard extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    request
      .get('api/dashboard/user/account')
      .end((err, res) => !res.body.loggedIn && (location.hash = '#/login'));
  }

  render() {
    const view = (() => {
      if (!this.props.hash[3] || this.props.hash[3] == 'list')
        return <List />;
      else if (this.props.hash[3] == 'create')
        return <Create />;
      else
        return <Manage hash={this.props.hash} />;
    })();

    return <div className='dashboard-developer'>{view}</div>;
  }

}