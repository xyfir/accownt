import PropTypes from 'prop-types';
import request from 'superagent';
import React from 'react';

// react-md
import SelectField from 'react-md/lib/SelectFields';
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';

export default class SetPasswordless extends React.Component {
  constructor(props) {
    super(props);
  }

  onUpdate() {
    request
      .put('/api/dashboard/user/security/passwordless')
      .send({
        passwordless: this.refs.passwordless.state.value
      })
      .end((err, res) => this.props.alert(res.body.message));
  }

  render() {
    return (
      <Paper zDepth={1} className="passwordless-login section flex">
        <h2>Passwordless Login</h2>
        <p>
          Login via a link or authorization code sent to your email.
          <br />
          Your password and other security measures will not be used.
        </p>

        <SelectField
          id="select--passwordless"
          ref="passwordless"
          label="Passwordless Login"
          menuItems={[
            { label: 'Disabled', value: 0 },
            { label: 'Receive via Email', value: 2 }
          ]}
          className="md-cell"
          defaultValue={this.props.passwordless}
        />

        <Button primary raised onClick={() => this.onUpdate()}>
          Update Passwordless
        </Button>
      </Paper>
    );
  }
}

SetPasswordless.propTypes = {
  alert: PropTypes.func.isRequired,
  passwordless: PropTypes.number.isRequired
};
