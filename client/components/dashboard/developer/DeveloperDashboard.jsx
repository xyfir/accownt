import request from 'superagent';
import React from 'react';

// Components
import Create from './Create';
import Manage from './Manage';
import List from './List';

export default class DeveloperDashboard extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    request
      .get('../api/dashboard/user/account')
      .end((err, res) => !res.body.loggedIn && (location.hash = '/login'));
  }

  render() {
    let view;

    if (!this.props.hash[3] || this.props.hash[3] == 'list')
      view = <List />;
    else if (this.props.hash[3] == 'create')
      view = <Create />;
    else
      view = <Manage hash={this.props.hash} />;

    return <div className='dashboard-developer old'>{view}</div>;
  }

}