import { withSnackbar, WithSnackbarProps } from 'notistack';
import { Accownt } from 'types/accownt';
import React from 'react';
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

const styles = createStyles({
  deleteAlert: {
    margin: 0
  },
  controls: {
    textAlign: 'center'
  },
  button: {
    marginRight: '0.5em',
    marginTop: '1em'
  },
  form: {
    padding: '1em',
    margin: '0.5em auto',
    width: '24em'
  },
  div: {
    margin: 'auto'
  },
  h4: {
    textAlign: 'center',
    margin: '0.5em 0'
  }
});

interface AuthenticatedProps
  extends WithStyles<typeof styles>,
    WithSnackbarProps {
  account: Accownt.Account;
}

interface AuthenticatedState {
  deleteConfirmation: string;
  deleting: boolean;
  secret?: string;
  pass: string;
  url?: string;
}

export class _Authenticated extends React.Component<
  AuthenticatedProps,
  AuthenticatedState
> {
  state: AuthenticatedState = {
    deleteConfirmation: '',
    deleting: false,
    pass: ''
  };

  componentDidMount() {
    if (location.search.startsWith('?error='))
      this.props.enqueueSnackbar(decodeURIComponent(location.search.substr(7)));
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
      .catch(err => this.props.enqueueSnackbar(`Error! ${err.response.error}`));
  }

  onDelete() {
    // Finish deletion
    if (this.state.deleting) {
      api
        .delete('/account')
        .then(res => location.assign(res.data.url))
        .catch(err =>
          this.props.enqueueSnackbar(`Error! ${err.response.error}`)
        );
    }
    // Start deletion
    else {
      this.setState({ deleting: true });
    }
  }

  render() {
    const { deleteConfirmation, deleting, secret, pass, url } = this.state;
    const { account, classes } = this.props;
    return (
      <div className={classes.div}>
        <Typography variant="h4" className={classes.h4}>
          {account.email}
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
            label="Password"
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

        <div className={classes.controls}>
          {process.enve.CAN_DELETE ? (
            <React.Fragment>
              {deleting ? (
                <div>
                  <p className={classes.deleteAlert}>
                    Are you sure you want to delete your account? This cannot be
                    undone. Type <code>YES</code> in the field below to confirm.
                  </p>
                  <TextField
                    id="delete-confirm"
                    value={deleteConfirmation}
                    label="Confirmation"
                    margin="normal"
                    onChange={e =>
                      this.setState({ deleteConfirmation: e.target.value })
                    }
                    fullWidth
                    placeholder="YES"
                  />
                </div>
              ) : null}

              <Button
                disabled={deleting && deleteConfirmation != 'YES'}
                onClick={() => this.onDelete()}
                variant="text"
                color={
                  deleting && deleteConfirmation == 'YES'
                    ? 'primary'
                    : 'default'
                }
                size="small"
              >
                Delete
              </Button>
            </React.Fragment>
          ) : null}

          <Button
            variant="text"
            href={`${process.enve.ACCOWNT_API_URL}/login/logout`}
            size="small"
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }
}

export const Authenticated = withStyles(styles)(withSnackbar(_Authenticated));
