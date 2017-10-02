import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';
import b from 'based-blob';

// Components
import Button from 'components/forms/Button';

export default class Profile extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = { view: 'list', profile: {} };
  }
  
  /**
   * Load the profile's full data.
   */
  componentWillMount() {
    request
      .get('../api/dashboard/user/profiles/' + this.props.id)
      .end((err, res) =>
        !err && this.setState({ profile: res.body.profile })
      );
  }
  
  /**
   * Switch between 'list' and 'full' views.
   */
  onToggleView() {
    this.setState({ view: this.state.view == 'list' ? 'full' : 'list' });
  }
  
  /**
   * Delete the profile if the user accepts confirmation prompt.
   */
  onDeleteProfile() {
    swal({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      button: 'Delete'
    }, () =>
      request
        .delete('../api/dashboard/user/profiles/' + this.props.id)
        .end((err, res) => {
          if (err || res.body.error) {
            setTimeout(
              () => swal('Error', err || res.body.message, 'error'), 1000
            );
          }
          else {
            location.reload();
          }
        })
    );
  }

  /**
   * Converts image to a base64 url data string and saves the string to 
   * `this.refs.picture.src`.
   * @param {Event} e
   */
  onUploadPicture(e) {
    b.toBase64(e.target.files[0]).then(
      b64 => this.refs.picture.src = b64
    );
  }
  
  /**
   * Sends the form's values and reloads the page regardless of response.
   * @param {Event} e 
   */
  onUpdateProfile(e) {
    e && e.preventDefault();

    request
      .put('../api/dashboard/user/profiles/' + this.props.id)
      .send({
        name: this.refs.name.value,
        email: this.refs.email.value,
        fname: this.refs.fname.value,
        lname: this.refs.lname.value,
        gender: this.refs.gender.value,
        phone: this.refs.phone.value,
        birthdate: this.refs.birthdate.value,
        address: this.refs.address.value,
        zip: this.refs.zip.value,
        region: this.refs.region.value,
        country: this.refs.country.value,
        picture: this.refs.picture.src
      })
      .end((err, res) => location.reload());
  }
  
  render() {
    if (this.state.view == 'list') {
      return (
        <div className='profile-list-view'>
          <h2>{this.state.profile.name}</h2>
          <Button type='secondary' onClick={() => this.onToggleView()}>
            <span className='icon-edit' />Edit
          </Button>
          <Button type='danger' onClick={() => this.onDeleteProfile()}>
            <span className='icon-delete' />Delete
          </Button>
        </div>
      );
    }
    else {
      const p = this.state.profile;
    
      return (
        <form
          className='profile-form-view'
          onSubmit={e => this.onUpdateProfile(e)}
        >
          <a
            className='icon-close'
            onClick={() => this.onToggleView()}
            title='Close Form'
          />

          <h2 className='profile-name'>{p.name}</h2>
        
          <label>Profile Name</label>
          <input type='text' ref='name' defaultValue={p.name} />
          
          <label>Email</label>
          <input type='email' ref='email' defaultValue={p.email} />
          
          <br />
          
          <label>First Name</label>
          <input type='text' ref='fname' defaultValue={p.fname} />
          
          <label>Last Name</label>
          <input type='text' ref='lname' defaultValue={p.lname} />
          
          <label>Gender</label>
          <select ref='gender' defaultValue={p.gender}>
            <option value='0'>-</option>
            <option value='1'>Male</option>
            <option value='2'>Female</option>
            <option value='3'>Other</option>
          </select>
          
          <label>Phone #</label>
          <input type='tel' ref='phone' defaultValue={p.phone} />
          
          <label>Birthdate</label>
          <input type='date' ref='birthdate' defaultValue={p.birthdate} />
          
          <br />
          
          <label>Address</label>
          <input type='text' ref='address' defaultValue={p.address} />
          
          <label>Zip Code</label>
          <input type='number' ref='zip' defaultValue={p.zip} />
          
          <label>State/Province/Region Code</label>
          <input type='text' ref='region' defaultValue={p.region} />
          
          <label>Country Code</label>
          <input type='text' ref='country' defaultValue={p.country} />

          <div className='picture'>
            <label>Profile Picture</label>
            <input type='file' onChange={e => this.onUploadPicture(e)} />

            <img src={p.picture} ref='picture' />
          </div>

          <br />
          
          <button className='btn-primary'>Update Profile</button>
        </form>
      );
    }
  }
  
}