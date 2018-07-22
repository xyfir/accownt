import { TextField, FontIcon, Button } from 'react-md';
import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';

// Modules
import loginWithAuthId from 'lib/account/login-with-auth-id';
import query from 'lib/url/parse-query-string';

export default class LoginStep1 extends React.Component {
  constructor(props) {
    super(props);

    const q = query();

    this.state = {
      loginAttempts: 0,
      passwordless: false,
      service: q.serviceName
        ? { name: q.serviceName, url: q.serviceUrl }
        : null,
      email: q.email || ''
    };
  }

  /** @param {string} route */
  onLoginLink(route) {
    location.href = `/${route}?email=${this.state.email}`;
  }

  /**
   * Attempt to login using the email and password. Move data over to Step2 if
   * any 2FA is needed.
   */
  onLogin() {
    const password = this._password.value;
    const { email } = this.state;

    if (!email) {
      return swal('Error', 'Missing email', 'error');
    }
    // Login with email and password
    else if (password) {
      request
        .post('/api/login')
        .send({ email, password })
        .end((err, res) => {
          const b = (res || { body: {} }).body;

          // Error with request or xyAccounts or invalid login data
          if (err || b.error) {
            this.setState({ loginAttempts: b.loginAttempts || 0 });
            swal('Error', b.message, 'error');
          }
          // Two factor authentication of some sort required
          else if (b.security) {
            this.props.save({ tfa: b });
            location.href = '/login/verify';
          }
          // User is logged in
          else {
            location.replace(b.redirect || '/dashboard/user/account');
          }
        });
    }
    // Request passwordless login link
    else {
      request
        .get('/api/login/passwordless')
        .query({ email })
        .end((err, res) => {
          if (err) return swal('Error', res.body.message, 'error');

          this.setState({ passwordless: true });
          loginWithAuthId(res.body.userId, res.body.authId);
        });
    }
  }

  render() {
    const { loginAttempts, passwordless, service, email } = this.state;

    return passwordless ? (
      <div className="login-passwordless">
        <h2>Passwordless Login</h2>
        <p>
          A message was sent to your email that contains a passwordless login
          link.
        </p>
        <p>
          Clicking the link in the message will log you in here, and also
          wherever you clicked the link.
        </p>

        <Button flat onClick={() => this.setState({ passwordless: false })}>
          Back to Login
        </Button>
      </div>
    ) : (
      <div className="login-1">
        {loginAttempts >= 5 ? (
          <span className="login-attempts">
            You have hit the incorrect login attempt limit.
            <br />
            Please wait 15 minutes from the last attempt before trying again.
            Entering the correct email and password will not unlock your account
            until the time limit expires.
          </span>
        ) : loginAttempts > 0 ? (
          <span className="login-attempts">
            {5 - loginAttempts} login attempt(s) remaining.
          </span>
        ) : null}

        {service ? (
          <span className="service-login">
            Login to <a href={service.url}>{service.name}</a> using Xyfir
            Accounts:
          </span>
        ) : null}

        <form className="md-paper md-paper--1 section flex">
          <TextField
            floating
            id="email"
            type="email"
            label="Email"
            value={email}
            leftIcon={<FontIcon>mail</FontIcon>}
            onChange={v => this.setState({ email: v })}
            onKeyDown={e => (e.key == 'Enter' ? this.onLogin() : null)}
          />

          <TextField
            floating
            id="password"
            ref={i => (this._password = i)}
            type="password"
            label="Password"
            helpText="Leave blank to send a login link to your email"
            leftIcon={<FontIcon>lock</FontIcon>}
            onKeyDown={e => (e.key == 'Enter' ? this.onLogin() : null)}
            placeholder="(optional)"
          />

          <div>
            <Button raised primary onClick={() => this.onLogin()}>
              Login
            </Button>
          </div>
        </form>

        <nav className="login-links">
          <Button
            flat
            onClick={() => this.onLoginLink('register')}
            iconChildren="create"
          >
            Register Account
          </Button>
          <Button
            flat
            onClick={() => this.onLoginLink('login/recovery')}
            iconChildren="help"
          >
            Forgot Password?
          </Button>
        </nav>
      </div>
    );
  }
}
