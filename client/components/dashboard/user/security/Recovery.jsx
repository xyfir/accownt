import { TextField, Button } from 'react-md';
import request from 'superagent';
import React from 'react';

export default class RecoveryCode extends React.Component {
  constructor(props) {
    super(props);

    this.state = { show: false, recovery: '' };
  }

  /**
   * Generate a new recovery code.
   */
  onGenerate() {
    request
      .put('/api/dashboard/user/security/recovery-code')
      .end((err, res) => {
        if (err) this.props.alert(res.body.message);
        else this.setState({ recovery: res.body.recovery });
      });
  }

  /**
   * Download the recovery code and render it.
   */
  onShow() {
    request
      .get('/api/dashboard/user/security/recovery-code')
      .end((err, res) => {
        if (!err) {
          res.body.show = true;
          this.setState(res.body);
        }
      });
  }

  render() {
    return (
      <div className="recovery-code section">
        <h3>Recovery Code</h3>
        <p>
          A recovery code allows you to bypass all of your other 2FA steps in
          the event that you need to access your account and cannot provide one
          or multiple of the required 2FA data.
          <br />
          Having a recovery code is optional and allows you to always have
          access to your account so long as you have the current recovery code
          saved <em>and</em> have access to your account email so you can
          retrieve the recovery link.
        </p>

        {this.state.show ? (
          <div className="flex">
            <TextField
              id="textarea--recovery-code"
              rows={2}
              type="text"
              label="Current Recovery Code"
              value={this.state.recovery}
              className="md-cell"
            />

            <Button primary raised onClick={() => this.onGenerate()}>
              Generate New
            </Button>
          </div>
        ) : (
          <Button primary raised onClick={() => this.onShow()}>
            Show Code
          </Button>
        )}
      </div>
    );
  }
}
