import { TextField, Button, Paper } from 'react-md';
import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';

export default class UserAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = { email: '', recovered: false, hasPassword: false };
  }

  componentDidMount() {
    request
      .get('/api/user/account')
      .end((err, res) => this.setState(res.body));
  }

  onUpdatePassword() {
    const curPass = this.refs.cpassword.value;
    const newPass = this.refs.npassword.value;
    const conPass = this.refs.rpassword.value;

    if (newPass != conPass) {
      swal('Error', 'Passwords do not match.', 'error');
    } else {
      request
        .put('/api/user/account')
        .send({
          currentPassword: curPass,
          newPassword: newPass
        })
        .end((err, res) => {
          if (err) swal('Error', res.body.message, 'error');
          else swal('Success', res.body.message, 'success');
        });
    }
  }

  render() {
    return (
      <div className="dashboard-body user-account">
        <h3 className="email">{this.state.email}</h3>

        <form className="change-password md-paper md-paper--1 section flex">
          <h3>Update Password</h3>

          <TextField
            id="password--current"
            ref="cpassword"
            type="password"
            label="Current Password"
            style={{
              display:
                this.state.recovered || !this.state.hasPassword
                  ? 'none'
                  : 'initial'
            }}
          />
          <TextField
            id="password--new"
            ref="npassword"
            type="password"
            label="New Password"
          />
          <TextField
            id="password--confirm"
            ref="rpassword"
            type="password"
            label="Confirm Password"
          />

          <Button raised primary onClick={() => this.onUpdatePassword()}>
            Update Password
          </Button>
        </form>
      </div>
    );
  }
}
