import request from 'superagent';
import React from 'react';

// Components
import Button from 'components/forms/Button';

export default class Account extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = { email: '', recovered: false };
  }
  
  componentWillMount() {
    request
      .get('../api/dashboard/user/account')
      .end((err, res) => this.setState(res.body));
  }
  
  onUpdatePassword(e) {
    e.preventDefault();

    const curPass = this.refs.cpassword.value;
    const newPass = this.refs.npassword.value;
    const conPass = this.refs.rpassword.value;
    
    if (newPass != conPass) {
      swal('Error', 'Passwords do not match.', 'error');
    }
    else {
      request
        .put('../api/dashboard/user/account')
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
      <div className='dashboard-body dashboard-account old'>
        <section className='main'>
          <h3>{this.state.email}</h3>
          <a href='../api/login/logout' className='link-sm'>
            Logout
          </a>
        </section>
        
        <section className='change-password'>
          <form onSubmit={(e) => this.onUpdatePassword(e)}>
            <input
              type={this.state.recovered ? 'hidden' : 'password' }
              ref='cpassword'
              placeholder='Current Password'
            />
            <input
              type='password'
              ref='npassword'
              placeholder='New Password'
            />
            <input
              type='password'
              ref='rpassword'
              placeholder='Confirm'
            />

            <Button>Update Password</Button>
          </form>
        </section>
      </div>
    );
  }
  
}