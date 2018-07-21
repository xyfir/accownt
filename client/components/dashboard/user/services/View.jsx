import {
  SelectField,
  DatePicker,
  Subheader,
  TextField,
  Checkbox,
  List,
  ListItem,
  Button,
  Paper
} from 'react-md';
import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';
import crd from 'country-region-data';

const Conditional = ({ show, children }) => (
  <div style={{ display: show ? 'initial' : 'none' }}>{children}</div>
);

export default class ViewLinkedService extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: +location.pathname.split('/')[4],
      country: ''
    };
  }

  componentWillMount() {
    request
      .get('/api/dashboard/user/services/' + this.state.id)
      .end((err, res) => this.setState({ service: res.body.service }));
  }

  /**
   * Updates the data provided to a linked service.
   * @param {Event} [e]
   */
  onUpdate(e) {
    e && e.preventDefault();

    const data = {
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
      .put('/api/dashboard/user/services/' + this.state.id)
      .send(data)
      .end((err, res) => {
        if (err) swal('Error', res.body.message, 'error');
        else swal('Success', res.body.message, 'success');
      });
  }

  /**
   * Check if a data field should be disabled because the service does not
   * request it.
   * @param {string} key
   * @returns {boolean}
   */
  _isDisabled(key) {
    return (
      !this.state.service.info.requested.required[key] &&
      !this.state.service.info.requested.optional[key]
    );
  }

  render() {
    if (!this.state.service) return null;

    const form = {
        email: '',
        fname: '',
        lname: '',
        phone: '',
        birthdate: '',
        address: '',
        zip: '',
        region: '',
        country: '',
        gender: 0
      },
      s = this.state.service;
    Object.assign(form, s.info.provided);

    return (
      <div className="update-linked-service">
        <h2 className="service-name">{s.name}</h2>
        <p className="service-description">{s.description}</p>

        <List className="requested-info section md-paper md-paper--2">
          <Subheader primary primaryText="Required Information" />

          {Object.keys(s.info.requested.required).map(key => (
            <ListItem
              key={key}
              primaryText={key}
              secondaryText={s.info.requested.required[key]}
            />
          ))}

          <Subheader primaryText="Optional Information" />

          {Object.keys(s.info.requested.optional).length ? (
            Object.keys(s.info.requested.optional).map(key => (
              <ListItem
                key={key}
                primaryText={key}
                secondaryText={s.info.requested.optional[key]}
              />
            ))
          ) : (
            <ListItem
              key="none"
              primaryText="None"
              secondaryText="This service does not request any optional info"
            />
          )}
        </List>

        <Paper zDepth={2} className="link-service section">
          <form className="custom" onSubmit={e => this.onUpdate(e)}>
            <p>Set data that only this service will be able to access.</p>

            <Conditional show={!this._isDisabled('email')}>
              <TextField
                id="email--email"
                ref="email"
                type="email"
                label="Email"
                defaultValue={form.email}
              />
            </Conditional>

            <Conditional show={!this._isDisabled('fname')}>
              <TextField
                id="text--fname"
                ref="fname"
                type="text"
                label="First Name"
                defaultValue={form.fname}
              />
            </Conditional>

            <Conditional show={!this._isDisabled('lname')}>
              <TextField
                id="text--lname"
                ref="lname"
                type="text"
                label="Last Name"
                defaultValue={form.lname}
              />
            </Conditional>

            <Conditional show={!this._isDisabled('gender')}>
              <SelectField
                fullWidth
                id="select-gender"
                ref="gender"
                label="Gender"
                menuItems={[
                  { label: '-', value: 0 },
                  { label: 'Male', value: 1 },
                  { label: 'Female', value: 2 },
                  { label: 'Other', value: 3 }
                ]}
                defaultValue={form.gender}
              />
            </Conditional>

            <Conditional show={!this._isDisabled('phone')}>
              <TextField
                id="tel--phone"
                ref="phone"
                type="tel"
                label="Phone #"
                defaultValue={form.phone}
              />
            </Conditional>

            <Conditional show={!this._isDisabled('birthdate')}>
              <DatePicker
                id="date--birthdate"
                ref="birthdate"
                label="Birthdate"
                defaultValue={form.birthdate}
              />
            </Conditional>

            <Conditional show={!this._isDisabled('country')}>
              <SelectField
                fullWidth
                id="select-country"
                label="Country"
                value={this.state.country}
                onChange={v => this.setState({ country: v })}
                menuItems={crd}
                itemLabel="countryName"
                itemValue="countryShortCode"
                defaultValue={form.country}
              />
            </Conditional>

            <Conditional show={!this._isDisabled('region')}>
              <SelectField
                fullWidth
                id="select-region"
                ref="region"
                label="State/Province/Region"
                menuItems={
                  (
                    crd.find(c => c.countryShortCode == this.state.country) || {
                      regions: []
                    }
                  ).regions
                }
                itemLabel="name"
                itemValue="shortCode"
                defaultValue={form.region}
              />
            </Conditional>

            <Conditional show={!this._isDisabled('address')}>
              <TextField
                id="text--address"
                ref="address"
                type="text"
                label="Address"
                defaultValue={form.address}
              />
            </Conditional>

            <Conditional show={!this._isDisabled('zip')}>
              <TextField
                id="text--zip"
                ref="zip"
                type="text"
                label="Zip Code"
                defaultValue={form.zip}
              />
            </Conditional>

            <Button raised primary onClick={e => this.onUpdate()}>
              Update
            </Button>
          </form>
        </Paper>
      </div>
    );
  }
}
