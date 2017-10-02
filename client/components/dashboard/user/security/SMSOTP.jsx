import PropTypes from 'prop-types';
import request from 'superagent';
import React from 'react';

// react-md
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';

export default class SetSMSOTP extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = { verifying: false };
  }
  
  onUpdate() {
    if (this.state.verifying) {
      request
        .put('api/dashboard/user/security/phone/verify')
        .send({
          phone: this.refs.phone.value,
          code: this.refs.smsCode.value
        })
        .end((err, res) => {
          this.props.alert(res.body.message);
          this.setState({ verifying: false });
        })
    }
    else {
      const phone = this.refs.phone.value;
      
      request
        .put('api/dashboard/user/security/phone')
        .send({ phone })
        .end((err, res) => {
          if (!err) {
            this.props.alert(res.body.message);

            if (phone && !res.body.error)
              this.setState({ verifying: true });
          }
        });
    }
  }
  
  render() {
    return (
      <div className='sms-otp section flex'>
        <p>
          Receive a code to your phone via SMS that must be entered on xyAccounts.
          <br />
          Will remove app verification from account if enabled.
        </p>

        <TextField
          id='tel--phone'
          ref='phone'
          type='tel'
          label='Phone #'
          className='md-cell'
          defaultValue={this.props.phone || ''}
        />

        {this.state.verifying ? (
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
          onClick={() => this.onUpdate()}
        >{
          this.state.verifying ? 'Verify Code' : 'Update Phone'
        }</Button>
      </div>
    );
  }
  
}

SetSMSOTP.propTypes = {
  alert: PropTypes.func.isRequired,
  phone: PropTypes.string.isRequired
};