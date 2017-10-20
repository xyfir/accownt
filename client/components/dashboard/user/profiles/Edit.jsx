import {
  FileInput, SelectField, DatePicker, TextField, Button, Paper
} from 'react-md';
import request from 'superagent';
import React from 'react';
import b from 'based-blob';

export default class EditProfile extends React.Component {

  constructor(props) {
    super(props);

    this.state = { id: +location.hash.split('/')[4] };
  }

  /**
   * Load the profile's full data.
   */
  componentWillMount() {
    request
      .get('/api/dashboard/user/profiles/' + this.state.id)
      .end((err, res) =>
        !err && this.setState(res.body.profile)
      );
  }

  /**
   * Converts image to a base64 url data string and saves the string to 
   * `this.refs.picture.src`.
   * @param {File} file
   */
  onUploadPicture(file) {
    b.toBase64(file).then(b64 => this.refs.picture.src = b64);
  }

  /**
   * Sends the form's values and reloads the page regardless of response.
   */
  onUpdate() {
    request
      .put('/api/dashboard/user/profiles/' + this.state.id)
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
        country: this.refs.country.value,
        picture: this.refs.picture.src
      })
      .end((err, res) => location.reload());
  }

  render() {
    const p = this.state;

    if (!p.name) return null;
  
    return (
      <Paper
        zDepth={1}
        component='form'
        className='edit-profile section flex'
      >
        <TextField
          id='text--name'
          ref='name'
          type='text'
          label='Profile Name'
          helpText='The name of this profile'
          className='md-cell'
          defaultValue={p.name}
        />

        <TextField
          id='email--email'
          ref='email'
          type='email'
          label='Email'
          className='md-cell'
          defaultValue={p.email}
        />

        <br />

        <TextField
          id='text--fname'
          ref='fname'
          type='text'
          label='First Name'
          className='md-cell'
          defaultValue={p.fname}
        />

        <TextField
          id='text--lname'
          ref='lname'
          type='text'
          label='Last Name'
          className='md-cell'
          defaultValue={p.lname}
        />

        <SelectField
          id='select--gender'
          ref='gender'
          label='Gender'
          menuItems={[
            { label: 'Male', value: 1 },
            { label: 'Female', value: 2 },
            { label: 'Other', value: 3 }
          ]}
          className='md-cell'
          defaultValue={p.gender}
        />

        <TextField
          id='phone--phone'
          ref='phone'
          type='tel'
          label='Phone'
          className='md-cell'
          defaultValue={p.phone}
        />

        <DatePicker
          id='date--birthdate'
          ref='birthdate'
          label='Birthdate'
          className='md-cell'
          defaultValue={p.birthdate}
        />

        <br />

        <TextField
          id='text--address'
          ref='address'
          type='text'
          label='Address'
          className='md-cell'
          defaultValue={p.address}
        />

        <TextField
          id='text--zip'
          ref='zip'
          type='text'
          label='Zip Code'
          className='md-cell'
          defaultValue={p.zip}
        />

        <TextField
          id='text--region'
          ref='region'
          type='text'
          label='State/Province/Region Code'
          className='md-cell'
          defaultValue={p.region}
        />

        <TextField
          id='text--country'
          ref='country'
          type='text'
          label='Country Code'
          className='md-cell'
          defaultValue={p.country}
        />

        <FileInput
          flat secondary
          id='file--picture'
          accept='image/*'
          onChange={f => this.onUploadPicture(f)}
        />

        <img src={p.picture} ref='picture' />

        <br />

        <Button
          raised primary
          onClick={() => this.onUpdate()}
        >Update</Button>
      </Paper>
    );
  }

}