import {
  SelectField, DatePicker, TextField, Button, Paper
} from 'react-md';
import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';

// Modules
import parseQuery from 'lib/url/parse-query-string';

export default class CreateProfile extends React.Component {

  constructor(props) {
    super(props);
  }

  onCreate() {
    request
      .post('/api/dashboard/user/profiles')
      .send({
        name: this.refs.name.value,
        email: this.refs.email.value,
        fname: this.refs.fname.value,
        lname: this.refs.lname.value,
        gender: this.refs.gender.value,
        phone: this.refs.phone.value,
        birthdate: this.refs.birthdate.state.value,
        address: this.refs.address.value,
        zip: this.refs.zip.value,
        region: this.refs.region.value,
        country: this.refs.country.value
      })
      .end((err, res) => {
        if (err || res.body.error) {
          swal('Error', res.body.message, 'error');
        }
        else {
          const q = parseQuery();

          location.hash = q.rdr || '#/dashboard/user/profiles';
          swal('Success', res.body.message, 'success');
        }
      });
  }

  render() {
    return (
      <Paper
        zDepth={1}
        component='form'
        className='create-profile section flex'
      >
        <p>All fields other than profile name are optional.</p>

        <TextField
          id='text--name'
          ref='name'
          type='text'
          label='Profile Name'
          helpText='The name of this profile'
          className='md-cell'
        />

        <TextField
          id='email--email'
          ref='email'
          type='email'
          label='Email'
          className='md-cell'
        />

        <br />

        <TextField
          id='text--fname'
          ref='fname'
          type='text'
          label='First Name'
          className='md-cell'
        />

        <TextField
          id='text--lname'
          ref='lname'
          type='text'
          label='Last Name'
          className='md-cell'
        />

        <SelectField
          id='select--gender'
          ref='gender'
          label='Gender'
          menuItems={[
            { label: 'Male', value: '1' },
            { label: 'Female', value: '2' },
            { label: 'Other', value: '3' }
          ]}
          className='md-cell'
        />

        <TextField
          id='phone--phone'
          ref='phone'
          type='tel'
          label='Phone'
          className='md-cell'
        />

        <DatePicker
          id='date--birthdate'
          ref='birthdate'
          label='Birthdate'
          className='md-cell'
        />

        <br />

        <TextField
          id='text--address'
          ref='address'
          type='text'
          label='Address'
          className='md-cell'
        />

        <TextField
          id='text--zip'
          ref='zip'
          type='text'
          label='Zip Code'
          className='md-cell'
        />

        <TextField
          id='text--region'
          ref='region'
          type='text'
          label='State/Province/Region Code'
          className='md-cell'
        />

        <TextField
          id='text--country'
          ref='country'
          type='text'
          label='Country Code'
          className='md-cell'
        />

        <br />

        <Button
          raised primary
          onClick={() => this.onCreate()}
        >Create</Button>
      </Paper>
    );
  }

}