import request from 'superagent';
import React from 'react';

// Components
import AccessTokens from 'components/dashboard/user/Tokens';
import Profiles from 'components/dashboard/user/profiles/Index';
import Services from 'components/dashboard/user/services/Index';
import Security from 'components/dashboard/user/Security';
import Account from 'components/dashboard/user/Account';
import Ads from 'components/dashboard/user/Ads';

export default class UserDashboard extends React.Component {
  
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    request
      .get('api/dashboard/user/account')
      .end((err, res) => !res.body.loggedIn && (location.hash = '/login'));
  }
  
  render() {
    const view = (() => {
      switch(this.props.hash[3]) {
        case 'security':
          return <Security {...this.props} />;
        case 'profiles':
          return <Profiles {...this.props} />;
        case 'services':
          return <Services {...this.props} />;
        case 'tokens':
          return <AccessTokens {...this.props} />;
        case 'ads':
          return <Ads {...this.props} />;
        default:
          return <Account {...this.props} />;
      }
    })();
    
    return <div className='dashboard-user'>{view}</div>;
  }
  
}