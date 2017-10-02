import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';
import crd from 'country-region-data';

// react-md
import TabsContainer from 'react-md/lib/Tabs/TabsContainer';
import SelectField from 'react-md/lib/SelectFields';
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';
import Subheader from 'react-md/lib/Subheaders';
import TextField from 'react-md/lib/TextFields';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import ListItem from 'react-md/lib/Lists/ListItem';
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';
import List from 'react-md/lib/Lists/List';
import Tabs from 'react-md/lib/Tabs/Tabs';
import Tab from 'react-md/lib/Tabs/Tab';

const Conditional = ({show, children}) =>
  <div style={{ display: show ? 'initial' : 'none' }}>{children}</div>;

export default class RegisterService extends React.Component {
  
  constructor(props) {
    super(props);

    const hash = location.hash.split('?')[0].split('/');

    this.state = {
      linked: false, tab: 0, country: '',
      // #/register/:id OR #/register/service/:id
      id: hash[2] == 'service' ? hash[3] : hash[2]
    };

    this._createSession = this._createSession.bind(this);
    this._isDisabled = this._isDisabled.bind(this);
  }
  
  componentWillMount() {
    request
      .get('api/service/' + this.state.id)
      .end((err, res) => {
        if (err || res.body.error) {
          if (res.body.message == 'Not logged in')
            location.hash = "#/login";
        }
        else {
          if (!res.body.profiles.length) res.body.tab = 1;
          
          this.setState(res.body);
        }
      });
  }
  
  /**
   * Link the user's account to the service.
   * @param {Event} [e]
   */
  onLink(e) {
    e && e.preventDefault();

    const data = this.state.tab == 0 ? {
      profile: this.refs.profile.state.value,
      required: window['checkbox-required'].checked,
      optional: window['checkbox-optional'].checked
    } : {
      zip: this.refs.zip.value,
      email: this.refs.email.value,
      fname: this.refs.fname.value,
      lname: this.refs.lname.value,
      phone: this.refs.phone.value,
      region: this.refs.region.state.value,
      gender: this.refs.gender.state.value,
      country: this.state.country,
      address: this.refs.address.value,
      birthdate: this.refs.birthdate.state.value
    };
  
    request
      .post(`api/service/${this.state.id}/link`)
      .send(data)
      .end((err, res) => {
        if (err || res.body.error)
          swal('Error', res.body.message, 'error');
        else
          this.setState({ linked: true }, () => this._createSession());
      });
  }
  
  /**
   * Creates a session linked to the user and service. Redirect the user to 
   * the service's login route.
   */
  _createSession() {
    request
      .post(`api/service/${this.state.id}/session`)
      .end((err, res) =>
        !err && location.replace(res.body.redirect)
      );
  }

  /**
   * Check if a data field should be disabled because the service does not 
   * request it.
   * @param {string} key
   * @returns {boolean}
   */
  _isDisabled(key) {
    return !this.state.service.requested.required[key] &&
      !this.state.service.requested.optional[key];
  }
  
  render() {
    if (this.state.linked || !this.state.service) return <div />;
    
    const s = this.state.service;
    
    return (
      <div className='link-service'>
        <h2 className='service-name'>{s.name}</h2>
        <p className='service-description'>{s.description}</p>

        <List className='requested-info section md-paper md-paper--2'>
          <Subheader primary primaryText='Required Information' />

          {Object.keys(s.requested.required).map(key =>
            <ListItem
              key={key}
              primaryText={key}
              secondaryText={s.requested.required[key]}
            />
          )}

          <Subheader primaryText='Optional Information' />

          {Object.keys(s.requested.optional).length ? (
            Object.keys(s.requested.optional).map(key =>
              <ListItem
                key={key}
                primaryText={key}
                secondaryText={s.requested.optional[key]}
              />
            )
          ) : (
            <ListItem
              key='none'
              primaryText='None'
              secondaryText='This service does not request any optional info'
            />
          )}
        </List>

        <Paper zDepth={2} className='link-service section'>
        <TabsContainer
          colored
          onTabChange={i => this.setState({ tab: i })}
          activeTabIndex={this.state.tab}
        >
          <Tabs tabId='tab'>
            <Tab label='Profile'>
            <form className='profile' onSubmit={e => this.onLink(e)}>
              <p>
                Choose a profile and {s.name} will automatically access information you allow from the profile.
                
                {!this.state.profiles.length ? (
                  <strong>
                    <br />
                    You don't have any profiles to link!
                  </strong>
                ) : null}
              </p>

              <a href={
                '#/dashboard/user/profiles/create?rdr='
                + encodeURIComponent(location.hash)
              }>Create New Profile</a>

              <br />
              
              <SelectField
                id='select-profile'
                ref='profile'
                label='Profile'
                menuItems={this.state.profiles}
                itemLabel='name'
                itemValue='profile_id'
                className='md-cell'
              />
              
              <div>
                <Checkbox
                  inline
                  id='checkbox-required'
                  ref='required'
                  name='checkbox-required'
                  label='Allow Access to Required Data'
                  defaultChecked={true}
                />
                <Checkbox
                  inline
                  id='checkbox-optional'
                  ref='optional'
                  name='checkbox-optional'
                  label='Allow Access to Optional Data'
                />
              </div>

              <Button
                raised primary
                onClick={e => this.onLink()}
              >Link Service</Button>
            </form>
            </Tab>

            <Tab label='Custom Data'>
            <form className='custom' onSubmit={e => this.onLink(e)}>
              <p>
                Set data that only this service will be able to access.
              </p>
            
              <Conditional show={!this._isDisabled('email')}>
                <TextField
                  id='email--email'
                  ref='email'
                  type='email'
                  label='Email'
                />
              </Conditional>
              
              <Conditional show={!this._isDisabled('fname')}>
                <TextField
                  id='text--fname'
                  ref='fname'
                  type='text'
                  label='First Name'
                />
              </Conditional>
              
              <Conditional show={!this._isDisabled('lname')}>
                <TextField
                  id='text--lname'
                  ref='lname'
                  type='text'
                  label='Last Name'
                />
              </Conditional>
              
              <Conditional show={!this._isDisabled('gender')}>
                <SelectField
                  fullWidth
                  id='select-gender'
                  ref='gender'
                  label='Gender'
                  menuItems={[
                    { label: '-', value: 0 },
                    { label: 'Male', value: 1 },
                    { label: 'Female', value: 2 },
                    { label: 'Other', value: 3 }
                  ]}
                />
              </Conditional>
              
              <Conditional show={!this._isDisabled('phone')}>
                <TextField
                  id='tel--phone'
                  ref='phone'
                  type='tel'
                  label='Phone #'
                />
              </Conditional>
              
              <Conditional show={!this._isDisabled('birthdate')}>
                <DatePicker
                  id='date--birthdate'
                  ref='birthdate'
                  label='Birthdate'
                />
              </Conditional>

              <Conditional show={!this._isDisabled('country')}>
                <SelectField
                  fullWidth
                  id='select-country'
                  label='Country'
                  value={this.state.country}
                  onChange={v => this.setState({ country: v })}
                  menuItems={crd}
                  itemLabel='countryName'
                  itemValue='countryShortCode'
                />
              </Conditional>
              
              <Conditional show={!this._isDisabled('region')}>
                <SelectField
                  fullWidth
                  id='select-region'
                  ref='region'
                  label='State/Province/Region'
                  menuItems={
                    (crd.find(c => c.countryShortCode == this.state.country) ||
                    { regions: [] }).regions
                  }
                  itemLabel='name'
                  itemValue='shortCode'
                />
              </Conditional>
              
              <Conditional show={!this._isDisabled('address')}>
                <TextField
                  id='text--address'
                  ref='address'
                  type='text'
                  label='Address'
                />
              </Conditional>
              
              <Conditional show={!this._isDisabled('zip')}>
                <TextField
                  id='text--zip'
                  ref='zip'
                  type='text'
                  label='Zip Code'
                />
              </Conditional>

              <Button
                raised primary
                onClick={e => this.onLink()}
              >Link Service</Button>
            </form>
            </Tab>
          </Tabs>
        </TabsContainer>
        </Paper>
      </div>
    );
  }
  
}