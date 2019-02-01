import { WithStyles, CssBaseline, Button } from '@material-ui/core';
import { NAME, APP_HOME_URL } from 'constants/config';
import { Unauthenticated } from 'components/Unauthenticated';
import { Authenticated } from 'components/Authenticated';
import { Accownt } from 'types/accownt';
import * as React from 'react';
import { theme } from 'constants/theme';
import { hot } from 'react-hot-loader';
import { api } from 'lib/api';
import {
  MuiThemeProvider,
  createStyles,
  withStyles
} from '@material-ui/core/styles';

const styles = createStyles({
  main: {
    flexDirection: 'column',
    fontFamily: 'Roboto',
    display: 'flex',
    height: '100vh'
  },
  div: {
    maxWidth: '20em',
    padding: '1em',
    margin: '0 auto'
  }
});

interface AppState {
  account?: Accownt.Account;
  loading: boolean;
}

class _App extends React.Component<WithStyles<typeof styles>, AppState> {
  state: AppState = { loading: true };

  componentDidMount() {
    api
      .get('/account')
      .then(res => this.setState({ account: res.data, loading: false }))
      .catch(err => this.setState({ loading: false }));
    if (location.search.startsWith('?error='))
      alert(decodeURIComponent(location.search.substr(7)));
  }

  render() {
    const { account, loading } = this.state;
    const { classes } = this.props;
    if (loading) return null;

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <main className={classes.main}>
          {account ? <Authenticated account={account} /> : <Unauthenticated />}
          <div className={classes.div}>
            <Button href={APP_HOME_URL} color="secondary">
              Back to {NAME}
            </Button>
          </div>
        </main>
      </MuiThemeProvider>
    );
  }
}

export const App = hot(module)(withStyles(styles)(_App));
