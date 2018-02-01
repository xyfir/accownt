import PropTypes from 'prop-types';
import request from 'superagent';
import React from 'react';

// react-md
import Paper from 'react-md/lib/Papers';

// Components
import Recovery from 'components/dashboard/user/security/Recovery';
import Codes from 'components/dashboard/user/security/Codes';
import OTP from 'components/dashboard/user/security/OTP';

export default class Set2FA extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Paper zDepth={1} className='tfa section'>
        <h2>Two Factor Authentication (2FA)</h2>
        <p>
          2FA allows you to further secure your account by requiring you to provide more data after you successfully provide your login email and password.
          <br />
          Any 2FA steps will be required upon logging in and during account recovery if you forget your password.
        </p>

        <OTP {...this.props} enabled={this.props.appOtp} />

        <Codes {...this.props} codes={this.props.codes} />

        <Recovery {...this.props} />
      </Paper>
    );
  }

}

Set2FA.propTypes = {
  alert: PropTypes.func.isRequired,
  codes: PropTypes.string.isRequired,
  appOtp: PropTypes.bool.isRequired,
};