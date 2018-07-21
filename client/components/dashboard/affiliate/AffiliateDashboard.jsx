import request from 'superagent';
import React from 'react';

// Components
import Create from 'components/dashboard/affiliate/Create';
import List from 'components/dashboard/affiliate/List';

export default class AffiliateDashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    request.get('/api/dashboard/user/account').end((err, res) => {
      if (err || !res.body.loggedIn) location.href = '/login';
      else if (!res.body.affiliate) location.href = '/dashboard/user';
    });
  }

  render() {
    return (
      <div className="dashboard-affiliate">
        {this.props.path[3] == 'create' ? <Create /> : <List />}
      </div>
    );
  }
}
