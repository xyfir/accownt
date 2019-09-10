import { WithStyles, CssBaseline, Button } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import { Unauthenticated } from 'components/Unauthenticated';
import { Authenticated } from 'components/Authenticated';
import { ThemeProvider } from '@material-ui/styles';
import { Accownt } from 'types/accownt';
import React from 'react';
import { theme } from 'lib/theme';
import { hot } from 'react-hot-loader';
import { api } from 'lib/api';

declare global {
  namespace NodeJS {
    interface Process {
      enve: Accownt.Env.Web;
    }
  }
}

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
  }

  render() {
    const { account, loading } = this.state;
    const { classes } = this.props;
    if (loading) return null;

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={2}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <main className={classes.main}>
            {account ? (
              <Authenticated account={account} />
            ) : (
              <Unauthenticated />
            )}
            <div className={classes.div}>
              <Button
                href={
                  account
                    ? process.enve.APP_AUTH_URL.replace('%JWT%', '0')
                    : process.enve.APP_HOME_URL
                }
                color="secondary"
              >
                Back to {process.enve.NAME}
              </Button>
            </div>
          </main>
        </SnackbarProvider>
      </ThemeProvider>
    );
  }
}

export const App = hot(module)(withStyles(styles)(_App));
