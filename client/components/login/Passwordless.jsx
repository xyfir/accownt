import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';

// react-md
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';

// Modules
import loginWithAuthId from 'lib/account/login-with-auth-id';
import query from 'lib/url/parse-query-string';

// Constants
import { XACC } from 'constants/config';

export default class PasswordlessLogin extends React.Component {

  constructor(props) {
    super(props);

    this.state = { sent: false, email: query().email || '' };
  }

  /**
   * Sends the passwordless login link to the provided email.
   */
  onSend() {
    request
      .get('api/login/passwordless')
      .query({ email: this.state.email })
      .end((err, res) => {
        if (err || res.body.error)
          return swal('Error', res.body.message, 'error');

        this.setState({ sent: true });
        loginWithAuthId(res.body.userId, res.body.authId);
      });
  }

  render() {
    if (!this.state.sent) return (
      <div className='login-passwordless step-1'>
        <h2>Passwordless Login</h2>
        <p>
          Enter the email you use to login with. Emails that are only linked to a profile and not your actual account will not work.
        </p>

        <form className='md-paper md-paper--1 section flex'>
          <TextField
            id='email--email'
            type='email'
            label='Account Email'
            value={this.state.email}
            onChange={v => this.setState({ email: v })}
            className='md-cell'
          />

          <Button
            raised primary
            onClick={() => this.onSend()}
          >Next</Button>
        </form>
      </div>
    );
    else return (
      <div className='login-passwordless step-2'>
        <h2>Passwordless Login</h2>
        <p>
          A message was sent to your email that contains a passwordless login link.
        </p>
        <p>
          Clicking the link in the message will log you in here, and also wherever you clicked the link.
        </p>
      </div>
    );
  }

}