import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';

// Constants
import { RECAPTCHA_KEY } from 'constants/config';

// react-md
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';

// Modules
import loginWithAuthId from 'lib/account/login-with-auth-id';
import query from 'lib/url/parse-hash-query';

export default class RegisterAccount extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
      created: false, emailTaken: false, email: query().email || ''
    };

		// Load reCAPTCHA lib
		const element = document.createElement('script');
		element.src = 'https://www.google.com/recaptcha/api.js';
		element.type = 'text/javascript';
		document.head.appendChild(element);
	}

	onCreate() {
    if (this.state.emailTaken) return;

		const data = {
			email: this.state.email,
			password: this.refs.password.value,
			passwordr: this.refs.passwordr.value,
			recaptcha: grecaptcha.getResponse()
		};
		
		if (data.password != data.passwordr) {
      swal('Error', 'Passwords do not match.', 'error');
		}
		else {
			// Attempt to register user
      request
        .post('api/register')
        .send(data)
        .end((err, res) => {
          if (err || res.body.error)
            return swal('Error', res.body.message, 'error');

          this.setState({ created: true });
          loginWithAuthId(res.body.userId, res.body.authId);
        });
		}
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
			this.checkEmailTimeout = setTimeout(() =>
        request
          .get('api/register/email')
          .query({ email })
          .end((err, res) =>
            this.setState({ emailTaken: res.body.exists })
          )
			, 200);
		}
  }
	
	render() {
    if (this.state.created) return (
      <div className='register account-created'>
        <p>
          Account created successfully. A verification link has been sent to your email.
        </p>
        <p>
          You will not be able to login until you verify your email. Attempting to login to an unverified account will cause a new verification email to be sent.
        </p>

        <Button
          raised primary
          onClick={() =>
            location.hash = '#/login?email=' + this.state.email
          }
        >Continue</Button>
      </div>
    )
    else return (
			<form className='register'>
        {this.state.emailTaken ? (
          <span className='email-taken'>
            An account with that email already exists. <a href={'#/login?email=' + this.state.email}>Login?</a>
          </span>
        ) : null}

				<Paper zDepth={1} className='section flex'>
          <TextField
            id='email'
            type='email'
            label='Email'
            value={this.state.email}
            onChange={v => this.onSetEmail(v)}
            helpText={
              'Used to login to your account, receive notifications, and for \
              account recovery.'
            }
            className='md-cell'
          />

          <TextField
            id='password--pass'
            ref='password'
            type='password'
            label='Password'
            className='md-cell'
          />

					<TextField
            id='password--conf'
            ref='passwordr'
            type='password'
            label='Confirm Password'
            className='md-cell'
          />

          <div className='recaptcha-wrapper'>
            <div
              className='g-recaptcha'
              data-sitekey={RECAPTCHA_KEY}
            />
          </div>

          <div className='buttons'>
            <Button
              raised primary
              onClick={() => this.onCreate()}
            >Create Account</Button>

            <Button
              raised
              ref='google'
              onClick={() => location.hash = '#/login?google=1'}
            >Google Login</Button>
          </div>
				</Paper>
			</form>
		);
	}

}