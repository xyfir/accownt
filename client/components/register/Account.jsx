import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';

// Constants
import { RECAPTCHA_KEY } from 'constants/config';

// react-md
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';

export default class RegisterAccount extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = { created: false, emailTaken: false };

		// Load reCAPTCHA lib
		const element = document.createElement('script');
		element.src = 'https://www.google.com/recaptcha/api.js';
		element.type = 'text/javascript';
		document.head.appendChild(element);
	}

	onCreate() {
		const data = {
			email: this.refs.email.getField().value,
			password: this.refs.password.getField().value,
			passwordr: this.refs.passwordr.getField().value,
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
            swal('Error', res.body.message, 'error');
					else
						this.setState({ created: true });
        });
		}
	}

	onCheckEmail() {
		clearTimeout(this.checkEmailTimeout);

    const email = this.refs.email.getField().value;

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
		if (this.state.created) {
			return (
				<div className='register account-created'>
          <span>
            Account created successfully. A verification link has been sent to your email.
            <br />
            You will not be able to login until you verify your email.
            <br />
          </span>

          <Button
            raised primary
            label='Continue to Login'
            onClick={() => location.hash = '#/login'}
          />
				</div>
			)
		}

		return (
			<form className='register'>
        {this.state.emailTaken ? (
          <span className='email-taken'>
            An account with that email already exists. <a href='#/login'>Login?</a>
          </span>
        ) : null}

				<Paper zDepth={1} className='section flex'>
          <TextField
            id='email'
            ref='email'
            type='email'
            label='Email'
            onChange={() => this.onCheckEmail()}
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
              label='Create Account'
              onClick={() => this.onCreate()}
            />

            <Button
              raised
              ref='google'
              label='Google Login'
              onClick={() => location.hash = '#/login?google=1'}
            />
          </div>
				</Paper>
			</form>
		);
	}

}