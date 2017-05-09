import request from 'superagent';
import React from 'react';

// Components
import SmsVerify from 'components/login/SmsVerifyStep';
import RandCode from 'components/login/RandomCodeStep';
import Button from 'components/forms/Button';
import Alert from 'components/misc/Alert';

export default class AccountRecovery extends React.Component {
  
  constructor(props) {
    super(props);

    this.state =  {
      error: false, message: '', email: '',
      auth: '', uid: 0
    };
  }
  
  onNext() {
    request
      .post('../api/recover')
      .send({ email: this.refs.email.value })
      .end((err, res) => this.setState(res.body));
  }
  
  onVerify() {
    const data = {
      phone: this.state.security.phone,
      email: this.state.email,
      auth: this.state.auth,
      uid: this.state.uid,
      code: this.state.security.code
        ? document.querySelector('#code').value : 0,
      codeNum: this.state.security.code
        ? this.state.security.codeNumber : 0,
      smsCode: this.state.security.phone
        ? document.querySelector('#smsCode').value : 0
    };
  
    request
      .post('../api/recover/verify')
      .send(data)
      .end((err, res) => this.setState(res.body));
  }
  
  render() {
    let userAlert;

    if (this.state.error)
      userAlert = <Alert type='error' title='Error!'>{this.state.message}</Alert>;
    else if (this.state.message)
      userAlert = <Alert type='success' title='Success!'>{this.state.message}</Alert>;
    
    if (this.state.security) {
      // Load security steps
      let sms, code, steps = 0;
    
      if (this.state.security.phone) {
        sms = <SmsVerify />;
        steps++;
      }
      if (this.state.security.code) {
        code = <RandCode codeNum={this.state.security.codeNumber + 1} />;
        steps++;
      }
      
      return (
        <div className='form-step old'>
          <section className='form-step-header'>
            <h2>Security</h2>
            <p>
              Your account has extra security measures enabled.
              <br />
              You must enter the correct information before receiving an account recovery email. 
            </p>
          </section>
        
          <section className='form-step-body'>
            {userAlert}
            {sms}
            {code}
          </section>
          
          <Button onClick={() => this.onVerify()}>
            Recover Account
          </Button>
        </div>
      );
    }
    else {
      return (
        <div className='form-step old'>
          <section className='form-step-header'>
            <h2>Account Recovery</h2>
            <p>
              Enter the email you use to login with. Emails only linked to a profile will not work.
            </p>
          </section>
        
          <section className='form-step-body'>
            {userAlert}
            
            <input
              type='email'
              placeholder='Enter your email'
              ref='email'
            />
            
            <Button onClick={() => this.onNext()}>Next</Button>
          </section>
        </div>
      );
    }
  }
  
}