import React from 'react';
import request from 'superagent';

// Components
import Button from 'components/forms/Button';

export default class LinkService extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      linked: false, tab: 'profile', id: this.props.hash[2]
    };

    this._createSession = this._createSession.bind(this);
    this._isDisabled = this._isDisabled.bind(this);
  }
  
  componentWillMount() {
    request
      .get('../api/service/' + this.state.id)
      .end((err, res) => {
        if (err || res.body.error) {
          if (res.body.message == 'Not logged in')
            location.hash = "#/login";
        }
        else {
          if (!res.body.profiles.length)
            res.body.tab = 'custom';
          
          this.setState(res.body);
        }
      });
  }

  onChangeTab(tab) {
    this.setState({ tab });
  }
  
  onLink(e) {
    e && e.preventDefault();

    let data = {};

    if (this.state.tab == 'profile') {
      data = {
        profile: this.refs.profile.value,
        required: this.refs.profile_allow_required.checked,
        optional: this.refs.profile_allow_optional.checked
      };
    }
    else {
      data = {
        email: this.refs.email.value,
        fname: this.refs.fname.value,
        lname: this.refs.lname.value,
        gender: this.refs.gender.value,
        phone: this.refs.phone.value,
        birthdate: this.refs.birthdate.value,
        address: this.refs.address.value,
        zip: this.refs.zip.value,
        region: this.refs.region.value,
        country: this.refs.country.value
      };
    }
  
    request
      .post(`../api/service/${this.state.id}/link`)
      .send(data)
      .end((err, res) => {
        if (err || res.body.error) {
          swal('Error', res.body.message, 'error');
        }
        else {
          this.setState({ linked: true });
          this._createSession();
        }
      });
  }
  
  _createSession() {
    request
      .post(`../api/service/${this.state.id}/session`)
      .end((err, res) => {
        const data = res.body || {};

        // Redirect user to service's login
        location.href = `${data.address}?auth=${data.auth}&xid=${data.xid}`;
      })
  }

  _isDisabled(key) {
    return !this.state.service.requested.required[key]
      && !this.state.service.requested.optional[key];
  }
  
  render() {
    if (this.state.linked || !this.state.service) {
      return <div />;
    }
    else {
      const s = this.state.service;
      
      return (
        <div className='link-service service-form-view'>
          <h2 className='service-name'>{s.name}</h2>
          <p className='service-description'>{s.description}</p>

          <section className='service-info'>
            <div className='required'>
              <span className='title'>Required Information</span>
              {Object.keys(s.requested.required).map(key => {
                return (
                  <dl>
                    <dt>{key}</dt>
                    <dd>{s.requested.required[key]}</dd>
                  </dl>
                );
              })}
            </div>
            
            <div className='optional'>
              <span className='title'>Optional Information</span>
              {Object.keys(s.requested.optional).length ? (
                Object.keys(s.requested.optional).map(key => {
                  return (
                    <dl>
                      <dt>{key}</dt>
                      <dd>{s.requested.optional[key]}</dd>
                    </dl>
                  );
                })
              ) : (
                <dl>None</dl>
              )}
            </div>
          </section>

          <section className='link-service'>
            <nav className='nav-bar'>
              <a onClick={() => this.onChangeTab('profile')}>
                Load Data From Profile
              </a>
              <a onClick={() => this.onChangeTab('custom')}>
                Set Custom Data
              </a>
            </nav>

            {this.state.tab == 'profile' ? (
              <form
                className='profile'
                onSubmit={(e) => this.onLink(e)}
              >
                <p>
                  Choose a profile and {s.name} will automatically access information you allow from the profile.
                  
                  {!this.state.profiles.length ? (
                    <strong>
                      <br />
                      You don't have any profiles to link!
                    </strong>
                  ) : (
                    <span />
                  )}

                  <br />

                  <a href={
                    '#/dashboard/user/profiles/create?rdr='
                    + encodeURIComponent(location.hash)
                  }>Create New Profile</a>
                </p>
                
                <select
                  ref='profile'
                  className='profile-selector'
                  defaultValue='0'
                >
                  <option value='0'>
                    Select a profile
                  </option>
                  
                  {this.state.profiles.map(profile => {
                    return (
                      <option value={profile.profile_id}>{
                        profile.name
                      }</option>
                    );
                  })}
                </select>
                
                <div>
                  <input
                    type='checkbox'
                    ref='profile_allow_required'
                    defaultChecked={true}
                  />Allow Access to Required Data
                  <input
                    type='checkbox'
                    ref='profile_allow_optional'
                  />Allow Access to Optional Data
                </div>

                <Button>Link Service</Button>
              </form>
            ) : this.state.tab == 'custom' ? (
              <form
                className='custom'
                onSubmit={(e) => this.onLink(e)}
              >
                <p>
                  Set data that only this service will be able to access.
                </p>
              
                <label>Email</label>
                <input
                  type='email'
                  ref='email'
                  disabled={this._isDisabled('email')}
                /> 
                
                <br />
                
                <label>First Name</label>
                <input
                  type='text'
                  ref='fname'
                  disabled={this._isDisabled('fname')}
                />
                
                <label>Last Name</label>
                <input
                  type='text'
                  ref='lname'
                  disabled={this._isDisabled('lname')}
                />
                
                <label>Gender</label>
                <select
                  ref='gender'
                  disabled={this._isDisabled('gender')}
                >
                  <option value='0'>-</option>
                  <option value='1'>Male</option>
                  <option value='2'>Female</option>
                  <option value='3'>Other</option>
                </select>
                
                <label>Phone #</label>
                <input
                  type='tel'
                  ref='phone'
                  disabled={this._isDisabled('phone')}
                />
                
                <label>Birthdate</label>
                <input
                  type='date'
                  ref='birthdate'
                  disabled={this._isDisabled('birthdate')}
                />
                
                <br />
                
                <label>Address</label>
                <input
                  type='text'
                  ref='address'
                  disabled={this._isDisabled('address')}
                />
                
                <label>Zip Code</label>
                <input
                  type='number'
                  ref='zip'
                  disabled={this._isDisabled('zip')}
                />
                
                <label>State/Province/Region Code</label>
                <input
                  type='text'
                  ref='region'
                  disabled={this._isDisabled('region')}
                />
                
                <label>Country Code</label>
                <input
                  type='text'
                  ref='country'
                  disabled={this._isDisabled('country')}
                />

                <Button>Link Service</Button>
              </form>
            ) : (
              <div />
            )}
          </section>
        </div>
      );
    }
  }
  
}