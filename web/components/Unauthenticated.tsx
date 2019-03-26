import { withSnackbar, withSnackbarProps } from 'notistack';
import * as React from 'react';
import { api } from 'lib/api';
import {
  FormControlLabel,
  createStyles,
  withStyles,
  WithStyles,
  TextField,
  Checkbox,
  Button,
  Paper
} from '@material-ui/core';

interface UnauthenticatedState {
  passwordless: boolean;
  registered: boolean;
  available: boolean;
  create: boolean;
  email: string;
  pass: string;
  otp: string;
}

const styles = createStyles({
  form: {
    maxWidth: '21em',
    padding: '1em',
    margin: 'auto'
  },
  password: {
    marginTop: 0
  },
  button: {
    marginTop: '1em'
  }
});

export class _Unauthenticated extends React.Component<
  withSnackbarProps & WithStyles<typeof styles>,
  UnauthenticatedState
> {
  timeout: NodeJS.Timeout;

  state: UnauthenticatedState = {
    passwordless: false,
    registered: false,
    available: true,
    create: false,
    email: '',
    pass: '',
    otp: ''
  };

  componentDidMount() {
    if (location.search.startsWith('?error='))
      this.props.enqueueSnackbar(decodeURIComponent(location.search.substr(7)));
  }

  onChangeEmail(email: string) {
    clearTimeout(this.timeout);
    this.setState({ email });

    if (this.state.create) {
      this.timeout = setTimeout(
        () =>
          api
            .post('/register/check-email', { email })
            .then(res => this.setState(res.data))
            .catch(err => 1),
        1000
      );
    }
  }

  componentDidUpdate(prevProps, prevState: UnauthenticatedState) {
    // Load reCAPTCHA lib after switching from login to register mode
    if (!prevState.create && this.state.create && process.enve.RECAPTCHA_KEY) {
      const element = document.createElement('script');
      element.src = 'https://www.google.com/recaptcha/api.js';
      document.head.appendChild(element);
      this.onChangeEmail(this.state.email);
    }
  }

  onChangeCreate() {
    const { create } = this.state;
    if (create) this.setState({ create: false, available: true });
    else this.setState({ create: true, otp: '' });
  }

  onRegister() {
    const { email, pass } = this.state;
    const recaptcha = process.enve.RECAPTCHA_KEY
      ? window['grecaptcha'].getResponse()
      : undefined;
    api
      .post('/register', { email, pass, recaptcha })
      .then(res => this.setState({ registered: true }))
      .catch(err =>
        this.props.enqueueSnackbar(`Error! ${err.response.data.error}`)
      );
  }

  onLogin() {
    const { email, pass, otp } = this.state;
    pass
      ? api
          .post('/login', { email, pass, otp: otp || undefined })
          .then(
            res =>
              (location.href = process.enve.APP_AUTH_URL.replace(
                '%JWT%',
                res.data.jwt
              ))
          )
          .catch(err =>
            this.props.enqueueSnackbar(`Error! ${err.response.data.error}`)
          )
      : api
          .post('/login/passwordless', { email })
          .then(() => this.setState({ passwordless: true }))
          .catch(err =>
            this.props.enqueueSnackbar(`Error! ${err.response.data.error}`)
          );
  }

  render() {
    const { classes } = this.props;
    const {
      passwordless,
      registered,
      available,
      create,
      email,
      pass,
      otp
    } = this.state;
    return (
      // @ts-ignore
      <Paper component="form" className={classes.form}>
        {registered ? (
          <p>
            A verification email has been sent. Resubmit the form to send
            another.
          </p>
        ) : passwordless ? (
          <p>
            A passwordless login email has been sent. Resubmit the form to send
            another.
          </p>
        ) : null}

        <TextField
          fullWidth
          id="email"
          type="email"
          value={email}
          error={create && !available}
          margin="normal"
          onChange={e => this.onChangeEmail(e.target.value)}
          helperText={
            create && !available ? 'That email is already in use' : null
          }
          placeholder="email@example.com"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={create}
              onChange={e => this.setState({ create: e.target.checked })}
            />
          }
          label="Create new account"
        />

        <TextField
          fullWidth
          id="pass"
          type="password"
          value={pass}
          margin="normal"
          onChange={e => this.setState({ pass: e.target.value })}
          className={classes.password}
          helperText="Leave blank to login via a passwordless login link sent to your email"
        />

        {create ? (
          <div
            className="g-recaptcha"
            data-sitekey={process.enve.RECAPTCHA_KEY}
          />
        ) : null}

        {!create && !!pass ? (
          <TextField
            fullWidth
            id="otp"
            label="2FA Code"
            value={otp}
            margin="normal"
            onChange={e => this.setState({ otp: e.target.value })}
            helperText="An optional 2FA code if your account has it enabled"
          />
        ) : null}

        <Button
          color="primary"
          variant="contained"
          onClick={() => (create ? this.onRegister() : this.onLogin())}
          disabled={!/.+@.+\..+/.test(email) || (create && !available)}
          className={classes.button}
        >
          {create ? 'Register' : 'Login'}
        </Button>
      </Paper>
    );
  }
}

export const Unauthenticated = withStyles(styles)(
  withSnackbar(_Unauthenticated)
);
