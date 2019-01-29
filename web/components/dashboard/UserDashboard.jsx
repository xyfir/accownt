import request from 'superagent';
import React from 'react';

// Components
import AccessTokens from 'components/user/Tokens';
import Services from 'components/user/services/List';
import Security from 'components/user/Security';
import Account from 'components/user/Account';

export default class UserDashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    request
      .get('/api/user/account')
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
