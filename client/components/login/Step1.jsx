import { TextField, Button } from 'react-md';
import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';

// Constants
import { GOOGLE_CLIENT_ID } from 'constants/config';

// Modules
import query from 'lib/url/parse-query-string';

export default class LoginStep1 extends React.Component {

  constructor(props) {
    super(props);

    const q = query();

    this.state = {
      loginAttempts: 0, email: q.email || '', google: false,
      service: q.serviceName
        ? { name: q.serviceName, url: q.serviceUrl }
        : null
    };
  }

  componentDidUpdate() {
    if (!this.state.google) return;

    gapi.load('auth2', () => {
      const auth2 = gapi.auth2.init({
        client_id: GOOGLE_CLIENT_ID,
        cookiepolicy: 'single_host_origin'
      });

      auth2.attachClickHandler(
        document.querySelector('.google-login'), {},
        this._googleLogin, this._googleLoginFailure
      );
    });
  }

  /** @param {string} route */
  onLoginLink(route) {
    location.hash = `#/${route}?email=${this.state.email}`;
  }

  _googleLogin(user) {
    request
      .post('api/login/google')
      .send({
        idToken: user.getAuthResponse().id_token
      })
      .end((err, res) => {
        if (err || res.body.error)
          swal('Error', res.body.message, 'error');
        else
          location.replace(res.body.redirect || '#/dashboard/user/account');
      });
  }

  _googleLoginFailure(data) {
    console.warn('Google Login', data);
  }

  /**
   * Attempt to login using the email and password. Move data over to Step2 if
   * any 2FA is needed.
   */
  onLogin() {
    request
      .post('api/login')
      .send({
        email: this.state.email,
        password: this.refs.password.value
      })
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
          location.hash = '#/login/verify';
        }
        // User is logged in
        else {
          location.replace(b.redirect || '#/dashboard/user/account');
        }
      });
  }

  render() {
    const {loginAttempts, service, email} = this.state;

    return (
      <div className='login-1'>
        <h2>Login</h2>

        {loginAttempts >= 5 ? (
          <span className='login-attempts'>
            You have hit the incorrect login attempt limit.
            <br />
            Please wait 15 minutes from the last attempt before trying again. Entering the correct email/password will not unlock your account until the time limit expires.
          </span>
        ) : loginAttempts > 0 ? (
          <span className='login-attempts'>
            {5 - loginAttempts} login attempt(s) remaining.
          </span>
        ) : null}

        {service ? (
          <span className='service-login'>
            Login to <a href={service.url}>{service.name}</a> using Xyfir Accounts:
          </span>
        ) : null}

        <form className='md-paper md-paper--1 section flex'>
          <TextField
            floating
            id='email'
            type='email'
            label='Email'
            value={email}
            onChange={v => this.setState({ email: v })}
            className='md-cell'
          />

          <TextField
            floating
            id='password'
            ref='password'
            type='password'
            label='Password'
            className='md-cell'
          />

          <div>
            <Button
              raised primary
              onClick={() => this.onLogin()}
            >Xyfir Login</Button>

            {this.state.google ? (
              <React.Fragment>
                <p>
                  Support for Google Sign-In is being removed soon. If you already have a Xyfir Account that was created via Google Sign-In, you can use the button below. Please check your emails for more information on converting your account before Google Sign-In is removed completely and you lose access to your account.
                </p>

                <Button
                  raised
                  ref='google'
                  className='google-login'
                >Google Login</Button>
              </React.Fragment>
            ) : !window.cordova ? (
              <Button
                raised
                onClick={() => this.setState({ google: true })}
              >Google Login</Button>
            ) : null}
          </div>
        </form>

        <nav className='login-links'>
          <a onClick={() => this.onLoginLink('register')}>
            Create Account
          </a>
          <a onClick={() => this.onLoginLink('login/recovery')}>
            Account Recovery
          </a>
          <a onClick={() => this.onLoginLink('login/passwordless')}>
            Passwordless Login
          </a>
        </nav>
      </div>
    );
  }

}