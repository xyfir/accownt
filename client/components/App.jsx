import { render } from 'react-dom';
import React from 'react';

// Components
import Dashboard from './containers/Dashboard';
import Register from './containers/Register';
import Login from './containers/Login';
import Home from './containers/Home';

// react-md
import Subheader from 'react-md/lib/Subheaders';
import ListItem from 'react-md/lib/Lists/ListItem';
import Toolbar from 'react-md/lib/Toolbars';
import Divider from 'react-md/lib/Dividers';
import Drawer from 'react-md/lib/Drawers';
import Button from 'react-md/lib/Buttons/Button';

class App extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      hash: location.hash.split('?')[0].split('/'), drawer: false
    };

    window.onhashchange = () =>
      this.setState({ hash: location.hash.split('?')[0].split('/') });
  }
  
  render() {
    const view = (() => {
      switch (this.state.hash[1]) {
        case 'login':
          return <Login hash={this.state.hash} />;

        case 'register':
          return <Register hash={this.state.hash} />;

        case 'dashboard':
          return <Dashboard hash={this.state.hash} />;

        default:
          return <Home hash={this.state.hash} />;
      }
    })();

    return (
      <div className='app'>
        <Toolbar
          colored fixed
          actions={[
            <Button
              icon
              key='home'
              onClick={() => location.hash = '#/'}
            >home</Button>
          ]}
          title='Xyfir Accounts'
          nav={
            <Button
              icon
              onClick={() => this.setState({ drawer: true })}
            >menu</Button>
          }
        />

        <Drawer
          onVisibilityToggle={
            v => this.setState({ drawer: v })
          }
          autoclose={true}
          navItems={[
            <Subheader primary primaryText='User Dashboard' />,
            <a href='#/dashboard/user/account'>
              <ListItem primaryText='Account' />
            </a>,
            <a href='#/dashboard/user/security'>
              <ListItem primaryText='Security' />
            </a>,
            <a href='#/dashboard/user/profiles'>
              <ListItem primaryText='Profiles' />
            </a>,
            <a href='#/dashboard/user/services'>
              <ListItem primaryText='Services' />
            </a>,
            <a href='#/dashboard/user/tokens'>
              <ListItem primaryText='Tokens' />
            </a>,
            <a href='#/dashboard/user/ads'>
              <ListItem primaryText='Ads' />
            </a>,
            
            <Divider />,

            <Subheader primary primaryText='Developer Dashboard' />,
            <a href='#/dashboard/developer/list'>
              <ListItem primaryText='View Services' />
            </a>,
            <a href='#/dashboard/developer/create'>
              <ListItem primaryText='Create Service' />
            </a>,

            <Divider />,

            <Subheader primary primaryText='Affiliate Dashboard' />,
            <a href='#/dashboard/affiliate/list'>
              <ListItem primaryText='View Campaigns' />
            </a>,
            <a href='#/dashboard/affiliate/create'>
              <ListItem primaryText='Create Campaign' />
            </a>
          ]}
          visible={this.state.drawer}
          header={
            <Toolbar
              colored
              nav={
                <Button
                  icon
                  onClick={() => this.setState({ drawer: false })}
                >arrow_back</Button>
              }
            />
          }
          type={Drawer.DrawerTypes.TEMPORARY}
        />

        <div className='main md-toolbar-relative'>{view}</div>
      </div>
    )
  }
  
}

render(<App />, document.querySelector('#content'));