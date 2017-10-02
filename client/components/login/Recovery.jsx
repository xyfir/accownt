import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';

// react-md
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';

export default class AccountRecovery extends React.Component {
  
  constructor(props) {
    super(props);

    this.state =  {
      email: '', auth: '', uid: 0
    };
  }
  
  /**
   * Send email to xyAccounts to check if it is valid and to send a recovery 
   * email if no 2FA steps are needed.
   */
  onNext() {
    request
      .post('api/recover')
      .send({ email: this.refs.email.value })
      .end((err, res) => {
        if (err || res.body.error)
          swal('Error', res.body.message, 'error');
        else if (res.body.message)
          swal('', res.body.message);
        else
          this.setState(res.body);
      });
  }
  
  /**
   * Send 2FA data.
   */
  onVerify() {
    request
      .post('api/recover/verify')
      .send({
        recovery: this.refs.recovery.value,
        phone: this.state.security.phone,
        email: this.state.email,
        auth: this.state.auth,
        uid: this.state.uid,
        code: this.state.security.code
          ? this.refs.code.value : 0,
        codeNum: this.state.security.code
          ? this.state.security.codeNumber : 0,
        otpCode: this.state.security.otp
          ? this.refs.otpCode.value : 0,
        smsCode: this.state.security.phone
          ? this.refs.smsCode.value : 0
      })
      .end((err, res) => {
        if (err || res.body.error)
          swal('Error', res.body.message, 'error');
        else
          swal('', res.body.message);
      });
  }
  
  render() {
    if (this.state.security) {
      return (
        <div className='login-recovery 2fa'>
          <h2>Security</h2>
          <p>
            Your account has extra security measures enabled.
            <br />
            You must enter the correct information before receiving an account recovery email. 
          </p>
        
          <form className='md-paper md-paper--1 section flex'>
            {this.state.security.phone ? (
              <TextField
                id='text--sms-code'
                ref='smsCode'
                type='text'
                label='SMS Verification Code'
                className='md-cell'
              />
            ) : null}
            
            {this.state.security.code ? (
              <TextField
                id='text--security-code'
                ref='code'
                type='text'
                label={
                  `Security Code #${this.state.security.codeNumber + 1}`
                }
                className='md-cell'
              />
            ) : null}

            {this.state.security.otp ? (
              <TextField
                id='text--otp-code'
                ref='otpCode'
                type='text'
                label='App Verification Code'
                className='md-cell'
              />
            ) : null}

            <TextField
              id='textarea--recovery-code'
              ref='recovery'
              rows={2}
              type='text'
              label='Recovery Code'
              helpText='Providing a recovery code will bypass 2FA steps'
              className='md-cell'
            />

            <Button
              raised primary
              onClick={() => this.onVerify()}
            >Recover</Button>
          </form>
        </div>
      );
    }
    else {
      return (
        <div className='login-recovery'>
          <h2>Account Recovery</h2>
          <p>
            Enter the email you use to login with. Emails that are only linked to a profile and not your actual account will not work.
          </p>
        
          <form className='md-paper md-paper--1 section flex'>
            <TextField
              id='email'
              ref='email'
              type='email'
              label='Email'
              className='md-cell'
            />
            
            <Button
              raised primary
              onClick={() => this.onNext()}
            >Next</Button>
          </form>
        </div>
      );
    }
  }
  
}