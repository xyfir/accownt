import React from 'react';

// react-md
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';

export default class Home extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className='home'>
        <Paper zDepth={1} className='login-links section'>
          <Button
            primary raised
            label='Sign In'
            onClick={() => location.hash = '#/login'}
          />
          <Button
            secondary raised
            label='Register'
            onClick={() => location.hash = '#/register'}
          />
        </Paper>

        <Paper zDepth={1} className='dashboard-links section'>
          <h2>Dashboards</h2>

          <Button
            raised
            label='User'
            onClick={() => location.hash = '#/dashboard/user'}
          />
          <Button
            raised
            label='Affiliate'
            onClick={() => location.hash = '#/dashboard/affiliate'}
          />
          <Button
            raised
            label='Developer'
            onClick={() => location.hash = '#/dashboard/developer'}
          />
        </Paper>

        <Paper zDepth={1} className='for-users section'>
          <h2>For Users</h2>

          <div>
            <h3>Control Your Data</h3>
            <p>See and control exactly what information each service needs and will access when linking to your Xyfir Account.</p>
          </div>
          
          <div>
            <h3>Easy Login</h3>
            <p>A couple of clicks to authorize a login with a service is all that's needed if you're already logged into your Xyfir Account.</p>
          </div>

          <div>
            <h3>Profiles</h3>
            <p>Create multiple profiles with different information for use with linking to different services.</p>
          </div>
          
          <div>
            <h3>Ad Profile</h3>
            <p>Control what information is shared across the Xyfir Network and utilized to provide relevant ads for you.</p>
          </div>
          
          <div>
            <h3>One Account, Multiple Sites</h3>
            <p>Create one account and access the entire Xyfir Network. Also available are any third party sites or applications that allow login with Xyfir Accounts.</p>
          </div>
          
          <div>
            <h3>Manage Linked Services</h3>
            <p>Modify your data, see what's being accessed, and remove services that are linked to your Xyfir Account.</p>
          </div>
          
          <div>
            <h3>Security</h3>
            <p>We offer many optional features like 2-Factor-Authentication to keep your account secure.</p>
          </div>
          
          <div>
            <h3>Passwordless Login</h3>
            <p>Simply enable passwordless login, request an authorization link, and click the link sent to you via SMS or email and you're logged in!</p>
          </div>
        </Paper>
        
        <Paper zDepth={1} className='for-devs section'>
          <h2>For Developers</h2>

          <div>
            <h3>Simple Login</h3>
            <p>Simplify your login system and let us deal with account management, recovery, security, and more.</p>
          </div>
          
          <div>
            <h3>Simple API</h3>
            <p>Create a service, tell us what information your service requires or wants from users, and we'll return it to you upon login or registration.</p>
          </div>
          
          <a href='https://xyfir.com/#/documentation/xyfir-accounts/integration'>Integration Documentation</a>
        </Paper>
      </div>
    );
  }
  
}