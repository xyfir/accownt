import request from 'superagent';
import React from 'react';

// react-md
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';

export default class UserAccount extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = { email: '', recovered: false };
  }
  
  componentWillMount() {
    request
      .get('api/dashboard/user/account')
      .end((err, res) => this.setState(res.body));
  }
  
  onUpdatePassword() {
    const curPass = this.refs.cpassword.getField().value;
    const newPass = this.refs.npassword.getField().value;
    const conPass = this.refs.rpassword.getField().value;
    
    if (newPass != conPass) {
      swal('Error', 'Passwords do not match.', 'error');
    }
    else {
      request
        .put('api/dashboard/user/account')
        .send({
          currentPassword: curPass,
          newPassword: newPass
        })
        .end((err, res) => {
          if (res.body.error)
            swal('Error', res.body.message, 'error');
          else
            swal('Success', res.body.message, 'success');
        })
    }
  }
  
  render() {
    return (
      <div className='dashboard-body user-account'>
        <Paper zDepth={1} className='section'>
          <h3 className='email'>{this.state.email}</h3>
          
          <Button
            raised
            label='Logout'
            onClick={() => location.href = 'api/login/logout'}
          />
        </Paper>
        
        <form
          className='change-password md-paper md-paper--1 section flex'
          style={{ display: this.state.google ? 'none' : '' }}
        >
          <h3>Change Password</h3>

          <TextField
            id='password--current'
            ref='cpassword'
            label='Current Password'
            style={{ display: this.state.recovered ? 'none' : 'initial' }}
            className='md-cell'
          />
          <TextField
            id='password--new'
            ref='npassword'
            type='password'
            label='New Password'
            className='md-cell'
          />
          <TextField
            id='password--confirm'
            ref='rpassword'
            type='password'
            label='Confirm Password'
            className='md-cell'
          />

          <Button
            raised primary
            label='Update Password'
            onClick={() => this.onUpdatePassword()}
          />
        </form>
      </div>
    );
  }
  
}