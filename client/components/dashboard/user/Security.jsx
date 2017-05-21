import request from 'superagent';
import React from 'react';
import copy from 'copyr';

// react-md
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';
import ListItem from 'react-md/lib/Lists/ListItem';
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';
import List from 'react-md/lib/Lists/List';

export default class UserSecurity extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      phone: '', codes: '', passwordless: 0,
      verifyingSms: false, loading: true
    };
  }
  
  componentWillMount() {
    request
      .get('api/dashboard/user/security')
      .end((err, res) => {
        res.body.loading = false;
        this.setState(res.body);
      });
  }
  
  onUpdatePhone() {
    if (this.state.verifyingSms) {
      request
        .put('api/dashboard/user/security/phone/verify')
        .send({
          phone: this.refs.phone.getField().value,
          code: this.refs.smsCode.getField().value
        })
        .end((err, res) => {
          this.props.alert(res.body.message);
          this.setState({ verifyingSms: false });
        })
    }
    else {
      const phone = this.refs.phone.getField().value;
      
      request
        .put('api/dashboard/user/security/phone')
        .send({ phone })
        .end((err, res) => {
          if (!err) {
            this.props.alert(res.body.message);

            if (phone && !res.body.error)
              this.setState({ verifyingSms: true });
          }
        });
    }
  }
  
  onGenerateCodes() {
    request
      .put('api/dashboard/user/security/codes')
      .send({
        type: this.refs.codeType.state.value,
        count: this.refs.codeCount.getField().value
      })
      .end((err, res) => {
        this.props.alert(res.body.message);
        this.setState({ codes: res.body.codes });
      })
  }

  onResetCodes() {
    this.refs.codeCount.getField().value = 0;
    this.onGenerateCodes();
  }
  
  onUpdatePasswordless() {
    request
      .put('api/dashboard/user/security/passwordless')
      .send({
        passwordless: this.refs.passwordless.state.value
      })
      .end((err, res) =>
        this.props.alert(res.body.message)
      );
  }

  onCopyCodes() {
    const codes = this.state.codes.split(',')
      .map((c, i) => `${i + 1}: ${c}`)
      .join(', ');
    copy(codes);

    this.props.alert('Codes copied to clipboard');
  }
  
  render() {
    if (this.state.loading) return <div />;

    return (
      <div className='dashboard-body dashboard-security'>
        <Paper zDepth={1} className='2fa section'>
          <h2>Two Factor Authentication (2FA)</h2>
          <p>
            2FA allows you to further secure your account by requiring you to provide more data after you successfully provide your login email and password.
            <br />
            Any 2FA steps will be required upon logging in and during account recovery if you forget your password.
          </p>
          
          <Paper zDepth={2} className='sms section flex'>
            <h3>SMS</h3>
            <p>
              Receive a code to your phone via SMS that must be entered on xyAccounts.
            </p>

            <TextField
              id='tel--phone'
              ref='phone'
              type='tel'
              label='Phone #'
              className='md-cell'
              defaultValue={this.state.phone || ''}
            />

            {this.state.verifyingSms ? (
              <TextField
                id='text--sms-code'
                ref='smsCode'
                type='text'
                label='Verification Code'
                className='md-cell'
              />
            ) : null}
            
            <Button
              raised primary
              label={this.state.verifyingSms ? 'Verify Code' : 'Update Phone'}
              onClick={() => this.onUpdatePhone()}
            />
          </Paper>

          <Paper zDepth={2} className='security-codes section flex'>
            <h3>Security Codes</h3>
            <p>
              A numbered list of 5-20 randomly generated words and/or numbers. A specific code from the list must be entered where 2FA is required.
            </p>
            
            {this.state.codes ? (
              <div>
                <List ordered>{
                  this.state.codes.split(',').map((code, i) =>
                    <ListItem
                      key={code}
                      primaryText={`${i + 1}. ${code}`}
                    />
                  )
                }</List>

                <Button
                  flat primary
                  label='Copy to clipboard'
                  onClick={() => this.onCopyCodes()}
                />
              </div>
            ) : null}
            
            <SelectField
              id='select--code-type'
              ref='codeType'
              label='Code Type'
              menuItems={[
                { label: 'Numbers', value: '1' },
                { label: 'Words', value: '2' },
                { label: 'Both', value: '3' }
              ]}
              className='md-cell'
            />
            
            <TextField
              id='number--code-count'
              min={5}
              max={20}
              ref='codeCount'
              type='number'
              label='Code Count'
              className='md-cell'
            />
            
            <Button
              primary raised
              label='Generate'
              onClick={() => this.onGenerateCodes()}
            />
            <Button
              secondary raised
              label='Reset'
              onClick={() => this.onResetCodes()}
            />
          </Paper>
          
          <br />
        </Paper>
        
        <Paper zDepth={1} className='passwordless-login section flex'>
          <h2>Passwordless Login</h2>
          <p>
            Login via a link or authorization code sent to your email or phone.
            <br />
            Your password and other security measures will not be used.
          </p>
          
          <SelectField
            id='select--passwordless'
            ref='passwordless'
            label='Passwordless Login'
            menuItems={[
              { label: 'Disabled', value: 0 },
              { label: 'Receive via SMS', value: 1 },
              { label: 'Receive via Email', value: 2 }
            ]}
            className='md-cell'
            defaultValue={this.state.passwordless}
          />
          
          <Button
            primary raised
            label='Update Passwordless'
            onClick={() => this.onUpdatePasswordless()}
          />
        </Paper>
      </div>
    );
  }
  
}