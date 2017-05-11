import PropTypes from 'prop-types';
import request from 'superagent';
import React from 'react';

// react-md
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import SelectField from 'react-md/lib/SelectFields';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TextField from 'react-md/lib/TextFields';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import TableRow from 'react-md/lib/DataTables/TableRow';
import ListItem from 'react-md/lib/Lists/ListItem';
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';
import List from 'react-md/lib/Lists/List';

export default class CreateOrEditServiceForm extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = { lf: {}, loading: true };

    this.fields = [
      { name: 'First Name', ref: 'fname' },
      { name: 'Last Name', ref: 'lname' },
      { name: 'Address', ref: 'address' },
      { name: 'ZIP Code', ref: 'zip' },
      { name: 'Country', ref: 'country' },
      { name: 'Region', ref: 'region' },
      { name: 'Email', ref: 'email' },
      { name: 'Phone #', ref: 'phone' },
      { name: 'Gender', ref: 'gender' },
      { name: 'Birthdate', ref: 'birthdate' }
    ];

    this.fields = this.fields.map(f =>
      Object.assign(f, { usedFor: '', optional: false, required: false })
    );
  }
  
  /**
   * Load data from existing service for editing.
   */
  componentDidMount() {
    if (this.props.loadDataFrom) {
      request
        .get('api/dashboard/developer/services/' + this.props.loadDataFrom)
        .end((err, res) =>
          !err && this.setState({ lf: res.body, loading: false })
        );
    }
    else {
      this.setState({ loading: false });
    }
  }

  /**
   * Validate the provided data and pass it to `this.props.onSubmit()`.
   */
  onSubmit() {
    const data = {
      info: {},
      name: this.refs.name.getField().value,
      urlMain: this.refs.urlMain.getField().value,
      urlLogin: this.refs.urlLogin.getField().value,
      urlUpdate: this.refs.urlUpdate.getField().value,
      urlUnlink: this.refs.urlUnlink.getField().value,
      description: this.refs.description.getField().value
    };

    try {
      // Validate service info
      if (!data.name.match(/^[\w\d\s-]{3,25}$/))
        throw 'Invalid name. Letters/numbers/spaces/3-25 characters allowed';
      else if (!data.urlMain.match(/^https:\/\//))
        throw 'Invalid website url. Must start with https://';
      else if (!data.urlLogin.match(/^https:\/\//))
        throw 'Invalid login url. Must start with https://';
      else if (!data.description.match(/^.{3,150}$/))
        throw 'Invalid description. 3-150 characters allowed.';
      
      // Validate fields that service requests
      this.fields.forEach(field => {
        const usedFor = this.refs['uf-' + field.ref].getField().value;
        const req = window['cb--required--' + field.ref].checked;
        const opt = window['cb--optional--' + field.ref].checked;

        // Service is requesting field
        if (req || opt) {
          if (!/^[\w\d\s-\/]{3,25}$/.test(usedFor)) {
            throw `Invalid 'Used For' description for '${
              field.name
            }'. Letters/numbers/spaces/3-25 characters allowed`;
          }
          else if (req && opt) {
            throw `Requested user field '${
              field.name
            }' cannot be both required and optional.`;
          }
          else {
            data.info[field.ref] = {
              required: req, optional: opt, value: usedFor
            };
          }
        }
      });
    }
    catch (err) {
      swal('Error', err, 'error');
      return;
    }
  
    data.info = JSON.stringify(data.info);
    this.props.onSubmit(data);
  }

  render() {
    const lf = this.state.lf;
    
    // Set usedFor/optional/required values if loadDataFrom
    if (typeof lf.info == 'string' && lf.info != '') {
      lf.info = JSON.parse(lf.info);

      for (let i = 0; i < 2; i++) {
        const type = i == 0 ? 'required' : 'optional';

        Object.keys(lf.info[type]).forEach(key => {
          const index = this.fields.findIndex(f => f.ref == key);

          this.fields[index][type] = true;
          this.fields[index].usedFor = lf.info[type][key];
        });
      }
    }
  
    if (this.state.loading) return <div />;
  
    return (
      <form className='service' onSubmit={e => this.onSubmit(e)}>
        <Paper zDepth={1} className='section flex'>
          <h3>Service Info</h3>
          <p>
            Information that users will see when linking your service to their Xyfir Account.
          </p>
          
          <TextField
            id='text--name'
            ref='name'
            type='text'
            label='Service Name'
            className='md-cell'
            defaultValue={lf.name || ''}
          />
          
          <TextField
            id='text--description'
            ref='description'
            rows={2}
            type='text'
            label='Service Description'
            className='md-cell'
            defaultValue={lf.description || ''}
          />

          <TextField
            id='text--url_main'
            ref='urlMain'
            type='text'
            label='Website'
            helpText='The URL of the main page for your service'
            className='md-cell'
            defaultValue={lf.url_main || 'https://yoursite.com/'}
          />
        </Paper>

        <Paper zDepth={1} className='api-routes section flex'>
          <h3>API Routes</h3>
          <p>
            These are addresses to your site that will accept data from xyAccounts.
            <br />
            Only the login route is required. See the integration docs for more information.
          </p>

          <TextField
            id='text--url_login'
            ref='urlLogin'
            type='text'
            label='Login'
            helpText='Where the user is redirected after login'
            className='md-cell'
            defaultValue={lf.url_login || ''}
          />

          <TextField
            id='text--url_update'
            ref='urlUpdate'
            type='text'
            label='Update'
            helpText='Called when a linked user updates their data'
            className='md-cell'
            defaultValue={lf.url_update || ''}
          />

          <TextField
            id='text--url_unlink'
            ref='urlUnlink'
            type='text'
            label='Unlink'
            helpText='Called when a linked user unlinks your service'
            className='md-cell'
            defaultValue={lf.url_unlink || ''}
          />
        </Paper>
        
        <Paper zDepth={1} className='requested-info section'>
          <h3>Requested Information</h3>
          <p>
            This is the information your services wants or needs from a user's account.
            <br />
            'Used For' should shortly summarize <em>why</em> your service wants or needs that field from the user.
          </p>

          <DataTable plain>
            <TableHeader>
            <TableRow>
              <TableColumn>Required/Optional</TableColumn>
              <TableColumn>Used For</TableColumn>
            </TableRow>
            </TableHeader>
            
            <TableBody>{
              this.fields.map(field =>
                <TableRow key={field.ref}>
                  <TableColumn>
                    <Checkbox
                      inline
                      id={'cb--required--' + field.ref}
                      ref={'req-' + field.ref}
                      label='Required'
                      defaultChecked={field.required}
                    />
                    <Checkbox
                      inline
                      id={'cb--optional--' + field.ref}
                      ref={'opt-' + field.ref}
                      label='Optional'
                      defaultChecked={field.optional}
                    />
                  </TableColumn>

                  <TableColumn>
                    <TextField
                      id={'text--used_for--' + field.ref}
                      ref={'uf-' + field.ref}
                      type='text'
                      label={field.name}
                      defaultValue={field.usedFor}
                    />
                  </TableColumn>
                </TableRow>
              )
            }</TableBody>
          </DataTable>
        </Paper>
      
        <Button
          raised primary
          label='Submit'
          onClick={e => this.onSubmit(e)}
        />
      </form>
    );
  }

}

CreateOrEditServiceForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loadDataFrom: PropTypes.number
}