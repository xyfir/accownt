import request from 'superagent';
import React from 'react';

// Components
import Button from 'components/forms/Button';

export default class Security extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      phone: '', codes: '', passwordless: 0,
      verifyingSms: false, loading: true
    };
  }
  
  componentWillMount() {
    request
      .get('../api/dashboard/user/security')
      .end((err, res) => {
        res.body.loading = false;
        this.setState(res.body);
      });
  }
  
  onUpdatePhone() {
    if (this.state.verifyingSms) {
      request
        .put('../api/dashboard/user/security/phone/verify')
        .send({
          phone: this.refs.phone.value,
          code: this.refs.smsCode.value
        })
        .end((err, res) => {
          this._alert(res.body.error, res.body.message);
          this.setState({ verifyingSms: false });
        })
    }
    else {
      let phone = this.refs.phone.value;
      phone = phone ? phone : 0;
      
      request
        .put('../api/dashboard/user/security/phone')
        .send({ phone })
        .end((err, res) => 1)
      
      if (phone != 0)
        this.setState({ verifyingSms: true });
    }
  }
  
  onGenerateCodes() {
    request
      .put('../api/dashboard/user/security/codes')
      .send({
        type: this.refs.codeType.value,
        count: this.refs.codeCount.value
      })
      .end((err, res) => {
        this._alert(res.body.error, res.body.message);
        this.setState({ codes: res.body.codes });
      })
  }

  onResetCodes() {
    this.refs.codeCount.value = 0;
    this.onGenerateCodes();
  }
  
  onUpdatePasswordless() {
    request
      .put('../api/dashboard/user/security/passwordless')
      .send({
        passwordless: this.refs.passwordless.value
      })
      .end((err, res) => {
        this._alert(res.body.error, res.body.message);
      });
  }

  _alert(error, message) {
    if (error)
      swal('Error', message, 'error');
    else
      swal('Success', message, 'success');
  }
  
  render() {
    if (this.state.loading) return <div />;

    return (
      <div className='dashboard-body dashboard-security'>
        <section className='2fa'>
          <h2>Two Factor Authentication</h2>
          <p>
            Upon login and account recovery we will send a code to your phone via SMS.
          </p>
          
          <label>Phone #</label>
          <input
            ref='phone'
            type='tel'
            defaultValue={+this.state.phone || ''}
          />
          
          {this.state.verifyingSms ? (
            <div>
              <label>Verification Code</label>
              <input type='text' ref='smsCode' />
            </div>
          ) : (
            <span />
          )}
          
          <Button onClick={() => this.onUpdatePhone()}>
            {this.state.verifyingSms ? 'Verify Code' : 'Update Phone'}
          </Button>
        </section>
        
        <section className='security-codes'>
          <h2>Security Codes</h2>
          <p>
            A numbered list of 5-20 randomly generated words and/or numbers. On login and account recovery a specific code must be entered.
          </p>
          
          {this.state.codes ? (
            <ol>{
              this.state.codes.split(',').map(code =>
                <li key={code}>{code}</li>
              )
            }</ol>
          ) : (
            <span />
          )}
          
          <label>Code Type</label>
          <select ref='codeType'>
            <option value='1'>Numbers</option>
            <option value='2'>Words</option>
            <option value='3'>Both</option>
          </select>
          
          <label>How Many?</label>
          <input
            type='number'
            ref='codeCount'
            max='20'
            min='5'
          />
          
          <Button onClick={() => this.onGenerateCodes()}>
            Generate Codes
          </Button>
          <Button type='danger' onClick={() => this.onResetCodes()}>
            Reset Codes
          </Button>
        </section>
        
        <section className='passwordless-login'>
          <h2>Passwordless Login</h2>
          <p>
            Login via a link or authorization code sent to your email or phone.
            <br />
            Your password and other security measures will not be used.
          </p>
          
          <select
            ref='passwordless'
            defaultValue={this.state.passwordless}
          >
            <option value='0'>Disabled</option>
            <option value='1'>Receive via SMS</option>
            <option value='2'>Receive via Email</option>
          </select>
          
          <Button onClick={() => this.onUpdatePasswordless()}>
            Update
          </Button>
        </section>
      </div>
    );
  }
  
}