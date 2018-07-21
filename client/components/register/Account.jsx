import { TextField, Button, Paper } from 'react-md';
import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';

// Constants
import { RECAPTCHA_KEY } from 'constants/config';

// Modules
import loginWithAuthId from 'lib/account/login-with-auth-id';
import query from 'lib/url/parse-query-string';

export default class RegisterAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      emailTaken: false,
      creating: false,
      created: false,
      email: query().email || ''
    };

    // Load reCAPTCHA lib
    const element = document.createElement('script');
    element.src = 'https://www.google.com/recaptcha/api.js';
    element.type = 'text/javascript';
    document.head.appendChild(element);
  }

  onCreate() {
    if (this.state.emailTaken || this.state.creating) return;

    this.setState({ creating: true });

    // Attempt to register user
    request
      .post('/api/register')
      .send({
        email: this.state.email,
        password: this._password.value,
        recaptcha: grecaptcha.getResponse()
      })
      .end((err, res) => {
        this.setState({ creating: false });

        if (err) return swal('Error', res.body.message, 'error');

        this.setState({ created: true });
        loginWithAuthId(res.body.userId, res.body.authId);
      });
  }

  /**
   * Set email state and check if email is already linked to an account.
   * @param {string} email
   */
  onSetEmail(email) {
    this.setState({ email });

    clearTimeout(this.checkEmailTimeout);

    if (email) {
      // Check if email is available
      this.checkEmailTimeout = setTimeout(
        () =>
          request
            .get('/api/register/email')
            .query({ email })
            .end((err, res) => this.setState({ emailTaken: res.body.exists })),
        200
      );
    }
  }

  render() {
    const { creating, created, email, emailTaken } = this.state;

    return created ? (
      <div className="register account-created">
        <p>
          Account created successfully. A verification link has been sent to
          your email.
        </p>
        <p>
          You will not be able to login until you verify your email. Attempting
          to login to an unverified account will cause a new verification email
          to be sent.
        </p>

        <Button
          raised
          primary
          onClick={() => (location.hash = '#/login?email=' + email)}
        >
          Continue
        </Button>
      </div>
    ) : (
      <form className="register">
        {emailTaken ? (
          <span className="email-taken">
            An account with that email already exists.{' '}
            <a href={'#/login?email=' + email}>Login?</a>
          </span>
        ) : null}

        <Paper zDepth={1} className="section flex">
          <TextField
            floating
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={v => this.onSetEmail(v)}
            helpText="Used to login, receive alerts, and recover your account"
            className="md-cell"
          />

          <TextField
            floating
            id="password"
            ref={i => (this._password = i)}
            type="password"
            label="Password"
            helpText="Leave blank to use login links sent to your email"
            className="md-cell"
            placeholder="(optional)"
          />

          <div className="recaptcha-wrapper">
            <div className="g-recaptcha" data-sitekey={RECAPTCHA_KEY} />
          </div>

          <div className="buttons">
            <Button
              raised
              primary
              onClick={() => this.onCreate()}
              disabled={creating}
            >
              Submit
            </Button>
          </div>
        </Paper>
      </form>
    );
  }
}
