import { TextField, FontIcon, Button } from 'react-md';
import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';

// Modules
import query from 'lib/url/parse-query-string';

export default class LoginStep1 extends React.Component {

  constructor(props) {
    super(props);

    const q = query();

    this.state = {
      loginAttempts: 0, email: q.email || '',
      service: q.serviceName
        ? { name: q.serviceName, url: q.serviceUrl }
        : null
    };
  }

  /** @param {string} route */
  onLoginLink(route) {
    location.hash = `#/${route}?email=${this.state.email}`;
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
        {loginAttempts >= 5 ? (
          <span className='login-attempts'>
            You have hit the incorrect login attempt limit.
            <br />
            Please wait 15 minutes from the last attempt before trying again. Entering the correct email and password will not unlock your account until the time limit expires.
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
            leftIcon={<FontIcon>mail</FontIcon>}
            onChange={v => this.setState({ email: v })}
            className='md-cell'
          />

          <TextField
            floating
            id='password'
            ref='password'
            type='password'
            label='Password'
            leftIcon={<FontIcon>lock</FontIcon>}
            className='md-cell'
          />

          <div>
            <Button
              raised primary
              onClick={() => this.onLogin()}
            >Login</Button>
          </div>
        </form>

        <nav className='login-links'>
          <Button
            flat
            onClick={() => this.onLoginLink('register')}
            iconChildren='create'
          >Create New Account</Button>
          <Button
            flat
            onClick={() => this.onLoginLink('login/recovery')}
            iconChildren='help'
          >Account Recovery</Button>
          <Button
            flat
            onClick={() => this.onLoginLink('login/passwordless')}
            iconChildren='lock_open'
          >Passwordless Login</Button>
        </nav>
      </div>
    );
  }

}