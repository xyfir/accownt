import { TextField, Button, Paper } from 'react-md';
import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';

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
    const curPass = this.refs.cpassword.value;
    const newPass = this.refs.npassword.value;
    const conPass = this.refs.rpassword.value;

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
            onClick={() => location.href = 'api/login/logout'}
          >Logout</Button>
        </Paper>

        <form className='change-password md-paper md-paper--1 section flex'>
          <h3>Update Password</h3>
          {this.state.google ? (
            <p>
              Your account was created via Google Sign-In and does not have a password set. On February 1st, Xyfir Accounts will no longer support Google Sign-In, meaning if you have not set a password by that date, your account will no longer be accessible. Once you set a password you will no longer be able to login via Google Sign-In and instead must use your email address and the password you set here.
            </p>
          ) : null}

          <TextField
            id='password--current'
            ref='cpassword'
            type='password'
            label='Current Password'
            style={{
              display: this.state.recovered || this.state.google
                ? 'none' : 'initial'
            }}
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
            onClick={() => this.onUpdatePassword()}
          >Update Password</Button>
        </form>
      </div>
    );
  }

}