import { Paper } from 'react-md';
import PropTypes from 'prop-types';
import React from 'react';

// Components
import Recovery from 'components/user/security/Recovery';
import OTP from 'components/user/security/OTP';

export default class Set2FA extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Paper zDepth={1} className="tfa section">
        <h2>Two Factor Authentication (2FA)</h2>
        <p>
          2FA allows you to further secure your account by requiring you to
          provide more data after you successfully provide your login email and
          password.
          <br />
          Any 2FA steps will be required upon logging in and during account
          recovery if you forget your password.
        </p>

        <OTP {...this.props} enabled={this.props.appOtp} />

        <Recovery {...this.props} />
      </Paper>
    );
  }
}

Set2FA.propTypes = {
  alert: PropTypes.func.isRequired,
  appOtp: PropTypes.bool.isRequired
};
