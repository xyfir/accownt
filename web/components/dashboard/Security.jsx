import request from 'superagent';
import React from 'react';

// Components
import Passwordless from 'components/user/security/Passwordless';
import TFA from 'components/user/security/2FA';

export default class UserSecurity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordless: 0,
      appOtp: false,
      loading: true
    };
  }

  componentDidMount() {
    request.get('/api/user/security').end((err, res) => {
      res.body.loading = false;
      this.setState(res.body);
    });
  }

  render() {
    if (this.state.loading) return <div />;

    return (
      <div className="dashboard-body security">
        <TFA {...this.props} {...this.state} />
        <Passwordless {...this.props} {...this.state} />
      </div>
    );
  }
}
