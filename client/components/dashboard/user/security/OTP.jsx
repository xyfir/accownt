import { TextField, Button } from 'react-md';
import PropTypes from 'prop-types';
import request from 'superagent';
import React from 'react';

export default class ConfigureOTP extends React.Component {
  constructor(props) {
    super(props);

    this.state = { enabled: this.props.enabled, qr: '' };
  }

  /**
   * Disable app OTP 2FA.
   */
  onDisable() {
    request
      .put('/api/dashboard/user/security/otp')
      .send({ remove: true })
      .end((err, res) => {
        if (!err) this.setState({ enabled: false });
        this.props.alert(res.body.message);
      });
  }

  /**
   * Enable app OTP 2FA.
   */
  onEnable() {
    request.put('/api/dashboard/user/security/otp').end((err, res) => {
      if (err) this.props.alert(res.body.message);
      else this.setState(res.body);
    });
  }

  /**
   * Verify token and finish enabling app OTP 2FA.
   */
  onVerify() {
    request
      .put('/api/dashboard/user/security/otp')
      .send({
        token: this.refs.code.value
      })
      .end((err, res) => {
        if (err) this.props.alert(res.body.message);
        else location.reload();
      });
  }

  render() {
    return (
      <div className="app-otp section flex">
        <h3>One-Time Password</h3>
        <p>
          A One-Time Password that will be provided via apps like Authy, Google
          Authenticator, etc.
        </p>

        {this.state.enabled ? (
          <Button secondary raised onClick={() => this.onDisable()}>
            Disable
          </Button>
        ) : this.state.qr ? (
          <div className="verify-app-otp flex">
            <p>
              Scan the following QR code into your app (Authy, Google
              Authenticator, etc) and enter the 6 digit code it generates.
            </p>

            <img src={this.state.qr} />

            <TextField
              id="text--app-otp-code"
              ref="code"
              type="text"
              label="Code"
            />

            <Button primary raised onClick={() => this.onVerify()}>
              Verify
            </Button>
          </div>
        ) : (
          <Button primary raised onClick={() => this.onEnable()}>
            Enable
          </Button>
        )}
      </div>
    );
  }
}

ConfigureOTP.propTypes = {
  alert: PropTypes.func.isRequired,
  enabled: PropTypes.bool.isRequired
};
