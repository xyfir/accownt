import { Accownt } from 'types/accownt';
import * as React from 'react';
import { api } from 'lib/api';
import {
  createStyles,
  Typography,
  withStyles,
  WithStyles,
  TextField,
  Button,
  Paper
} from '@material-ui/core';
import { ACCOWNT_API_URL } from 'constants/config';

const styles = createStyles({
  button: {
    marginRight: '0.5em',
    marginTop: '1em'
  },
  form: {
    maxWidth: '21em',
    padding: '1em',
    margin: '0.5em auto'
  },
  h4: {
    textAlign: 'center',
    margin: '0.5em 0'
  }
});

interface AuthenticatedProps extends WithStyles<typeof styles> {
  account: Accownt.Account;
}

interface AuthenticatedState {
  secret?: string;
  pass: string;
  url?: string;
}

export class _Authenticated extends React.Component<
  AuthenticatedProps,
  AuthenticatedState
> {
  state: AuthenticatedState = {
    pass: ''
  };

  constructor(props) {
    super(props);
  }

  onSetPassword(pass: string | null) {
    api
      .put('/account/password', { pass })
      .then(() => location.reload())
      .catch(() => location.reload());
  }

  onSetTOTP(enabled: boolean) {
    api
      .put('/account/totp', { enabled })
      .then(res =>
        !res.data.url ? location.reload() : this.setState(res.data)
      )
      .catch(err => alert(`Error! ${err.response.error}`));
  }

  render() {
    const { secret, pass, url } = this.state;
    const { account, classes } = this.props;
    return (
      <div>
        <Typography variant="h4" className={classes.h4}>
          {account.email}
          <Button color="secondary" href={`${ACCOWNT_API_URL}/login/logout`}>
            Logout
          </Button>
        </Typography>

        <Paper
          // @ts-ignore
          component="form"
          className={classes.form}
        >
          <Typography variant="h5">Password</Typography>

          <TextField
            fullWidth
            id="new-password"
            type="password"
            value={pass}
            margin="normal"
            onChange={e => this.setState({ pass: e.target.value })}
            placeholder={
              account.hasPassword ? 'Change Password' : 'Set Password'
            }
          />

          <Button
            color="primary"
            variant="contained"
            onClick={() => this.onSetPassword(pass)}
            disabled={!pass}
            className={classes.button}
          >
            {account.hasPassword ? 'Update' : 'Set'}
          </Button>

          {account.hasPassword ? (
            <Button
              color="secondary"
              variant="contained"
              onClick={() => this.onSetPassword(null)}
              className={classes.button}
            >
              Remove
            </Button>
          ) : null}
        </Paper>

        <Paper
          // @ts-ignore
          component="form"
          className={classes.form}
        >
          <Typography variant="h5">Two-Factor Authentication (2FA)</Typography>

          {secret && url ? (
            <div>
              <img src={url} />
              <p>
                Scan the above QR Code into your preferred 2FA app (Authy,
                Google Authenticator, etc), or manually enter in the secret
                below.
              </p>
              <TextField
                id="totp-secret"
                value={secret}
                margin="normal"
                fullWidth
              />
            </div>
          ) : null}

          <Button
            color="primary"
            variant="contained"
            onClick={() => this.onSetTOTP(true)}
            className={classes.button}
          >
            {account.hasTOTP || !!secret ? 'Regenerate' : 'Enable'}
          </Button>

          {account.hasTOTP ? (
            <Button
              color="secondary"
              variant="contained"
              onClick={() => this.onSetTOTP(false)}
              className={classes.button}
            >
              Disable
            </Button>
          ) : null}
        </Paper>
      </div>
    );
  }
}

export const Authenticated = withStyles(styles)(_Authenticated);
