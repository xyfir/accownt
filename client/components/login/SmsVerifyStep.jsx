import React from 'react';

export default class SmsVerificationStep extends React.Component {

  render() {
    return (
      <div className='sms-code'>
        <label>SMS Verification Code</label>
        <input type='number' id='smsCode' />
      </div>
    );
  }

}