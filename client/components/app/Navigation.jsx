import {
  Subheader, ListItem, Toolbar, Divider, Drawer, Button, List, FontIcon
} from 'react-md';
import React from 'react';

export default class AppNavigation extends React.Component {

  constructor(props) {
    super(props);

    this.state = { drawer: false };
  }

  render() {
    const {App} = this.props;

    return (
      <React.Fragment>
        <Toolbar
          colored fixed
          actions={[
            <Button
              icon
              key='home'
              onClick={() => location.hash = '#/'}
              iconChildren='home'
            />
          ]}
          title='Xyfir Accounts'
          nav={
            <Button
              icon
              onClick={() => this.setState({ drawer: true })}
              iconChildren='menu'
            />
          }
        />

        <Drawer
          onVisibilityChange={v => this.setState({ drawer: v })}
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
                  iconChildren='arrow_back'
                />
              }
            />
          }
          type={Drawer.DrawerTypes.TEMPORARY}
        />
      </React.Fragment>
    )
  }

}