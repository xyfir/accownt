import request from 'superagent';
import React from 'react';

// Components
import Profile from './Profile';
import Button from 'components/forms/Button';

export default class ProfileList extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = { profiles: [] };
  }
  
  componentWillMount() {
    request
      .get('../api/dashboard/user/profiles')
      .end((err, res) => !err && this.setState(res.body));
  }
  
  render() {
    return (
      <div className='dashboard-body dashboard-profiles'>
        <section className='info'>
          <p>
            Profiles allow you to easily give services linked to your Xyfir Account access to required or optional information.
            <br />
            When linking a service to your Xyfir Account you will be able to choose a profile to for the service to access.
          </p>
        </section>
      
        <section className='profiles'>
          <div className='profile-list'>{
            this.state.profiles.map(profile =>
              <Profile
                id={profile.profile_id}
                key={profile.profile_id}
                name={profile.name}
              />
            )
          }</div>
        </section>

        <section className='create-profile'>
          <button
            className='btn-primary'
            onClick={() => location.hash += '/create'}
          >Create Profile</button>
        </section>
      </div>
    );
  }
  
}