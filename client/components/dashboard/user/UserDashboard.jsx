import request from 'superagent';
import React from 'react';

// Components
import AccessTokens from 'components/dashboard/user/Tokens';
import Services from 'components/dashboard/user/services/Index';
import Security from 'components/dashboard/user/Security';
import Account from 'components/dashboard/user/Account';

export default class UserDashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    request
      .get('/api/dashboard/user/account')
      .end((err, res) => !res.body.loggedIn && (location.href = '/login'));
  }

  render() {
    const view = (() => {
      switch (this.props.path[3]) {
        case 'security':
          return <Security {...this.props} />;
        case 'services':
          return <Services {...this.props} />;
        case 'tokens':
          return <AccessTokens {...this.props} />;
        default:
          return <Account {...this.props} />;
      }
    })();

    return <div className="dashboard-user">{view}</div>;
  }
}
