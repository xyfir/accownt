import { TextField, Button, Paper } from 'react-md';
import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';

export default class CreateOrEditServiceForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { lf: {}, loading: true };
  }

  /**
   * Load data from existing service for editing.
   */
  componentDidMount() {
    if (this.props.loadDataFrom) {
      request
        .get('/api/dashboard/developer/services/' + this.props.loadDataFrom)
        .end(
          (err, res) => !err && this.setState({ lf: res.body, loading: false })
        );
    } else {
      this.setState({ loading: false });
    }
  }

  /**
   * Validate the provided data and pass it to `this.props.onSubmit()`.
   */
  onSubmit() {
    const data = {
      name: this.refs.name.value,
      urlMain: this.refs.urlMain.value,
      urlLogin: this.refs.urlLogin.value,
      urlUnlink: this.refs.urlUnlink.value,
      description: this.refs.description.value
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
    } catch (err) {
      return swal('Error', err, 'error');
    }

    this.props.onSubmit(data);
  }

  render() {
    const lf = this.state.lf;
    if (this.state.loading) return null;

    return (
      <form className="service" onSubmit={e => this.onSubmit(e)}>
        <Paper zDepth={1} className="section flex">
          <h3>Service Info</h3>
          <p>
            Information that users will see when linking your service to their
            Xyfir Account.
          </p>

          <TextField
            id="text--name"
            ref="name"
            type="text"
            label="Service Name"
            defaultValue={lf.name || ''}
          />

          <TextField
            id="text--description"
            ref="description"
            rows={2}
            type="text"
            label="Service Description"
            defaultValue={lf.description || ''}
          />

          <TextField
            id="text--url_main"
            ref="urlMain"
            type="text"
            label="Website"
            helpText="The URL of the main page for your service"
            defaultValue={lf.url_main || 'https://yoursite.com/'}
          />
        </Paper>

        <Paper zDepth={1} className="api-routes section flex">
          <h3>API Routes</h3>
          <p>
            These are addresses to your site that will accept data from
            xyAccounts.
            <br />
            Only the login route is required. See the integration docs for more
            information.
          </p>

          <TextField
            id="text--url_login"
            ref="urlLogin"
            type="text"
            label="Login"
            helpText="Where the user is redirected after login"
            defaultValue={lf.url_login || ''}
          />

          <TextField
            id="text--url_unlink"
            ref="urlUnlink"
            type="text"
            label="Unlink"
            helpText="Called when a linked user unlinks your service"
            defaultValue={lf.url_unlink || ''}
          />
        </Paper>

        <Button raised primary onClick={e => this.onSubmit(e)}>
          Submit
        </Button>
      </form>
    );
  }
}
