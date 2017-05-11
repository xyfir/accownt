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
    let view;

    switch(this.props.hash[3]) {
      case 'security':
        view = <Security />; break;
      case 'profiles':
        view = <Profiles />; break;
      case 'services':
        view = <Services />; break;
      case 'tokens':
        view = <AccessTokens />; break;
      case 'ads':
        view = <Ads />; break;
      default:
        view = <Account />;
    }
    
    return <div className='dashboard-user'>{view}</div>;
  }
  
}