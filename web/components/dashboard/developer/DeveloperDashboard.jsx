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

  componentDidMount() {
    request
      .get('/api/dashboard/user/account')
      .end((err, res) => !res.body.loggedIn && (location.href = '/login'));
  }

  render() {
    const view = (() => {
      if (!this.props.path[3] || this.props.path[3] == 'list') return <List />;
      else if (this.props.path[3] == 'create') return <Create />;
      else return <Manage path={this.props.path} />;
    })();

    return <div className="dashboard-developer">{view}</div>;
  }
}
