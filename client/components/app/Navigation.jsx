import { ListItem, Toolbar, Drawer, Button, List, FontIcon } from 'react-md';
import request from 'superagent';
import React from 'react';

import { XYDOCUMENTATION_URL } from 'constants/config';

export default class AppNavigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      drawer: false,
      loggedIn: false
    };
  }

  onShowDrawer() {
    request
      .get('api/dashboard/user/account')
      .end((err, res) =>
        this.setState({ loggedIn: res.body.loggedIn, drawer: true })
      );
  }

  /** @return {JSX.Element[]} */
  _renderLoggedOutItems() {
    return [
      <a href="#/login">
        <ListItem
          primaryText="Login"
          leftIcon={<FontIcon>keyboard_arrow_right</FontIcon>}
        />
      </a>,
      <a href="#/register">
        <ListItem
          primaryText="Register"
          leftIcon={<FontIcon>create</FontIcon>}
        />
      </a>,
      <a href="#/login/recovery">
        <ListItem
          primaryText="Account Recovery"
          leftIcon={<FontIcon>help</FontIcon>}
        />
      </a>
    ];
  }

  /** @return {JSX.Element[]} */
  _renderLoggedInItems() {
    return [
      <ListItem
        defaultVisible={/^#\/dashboard\/user/.test(location.hash)}
        primaryText="User Dashboard"
        nestedItems={[
          <a href="#/dashboard/user/account">
            <ListItem primaryText="Account" />
          </a>,
          <a href="#/dashboard/user/security">
            <ListItem primaryText="Security" />
          </a>,
          <a href="#/dashboard/user/services">
            <ListItem primaryText="Services" />
          </a>,
          <a href="#/dashboard/user/tokens">
            <ListItem primaryText="Tokens" />
          </a>
        ]}
        leftIcon={<FontIcon>account_circle</FontIcon>}
      />,

      <ListItem
        defaultVisible={/^#\/dashboard\/developer/.test(location.hash)}
        primaryText="Developer Dashboard"
        nestedItems={[
          <a href="#/dashboard/developer/list">
            <ListItem primaryText="View Services" />
          </a>,
          <a href="#/dashboard/developer/create">
            <ListItem primaryText="Create Service" />
          </a>,
          <a
            target="_blank"
            href="https://xyfir.com/#/documentation/xyfir-accounts/integration"
          >
            <ListItem primaryText="Documentation" />
          </a>
        ]}
        leftIcon={<FontIcon>code</FontIcon>}
      />,

      <ListItem
        defaultVisible={/^#\/dashboard\/affiliate/.test(location.hash)}
        primaryText="Affiliate Dashboard"
        nestedItems={[
          <a href="#/dashboard/affiliate/list">
            <ListItem primaryText="View Campaigns" />
          </a>,
          <a href="#/dashboard/affiliate/create">
            <ListItem primaryText="Create Campaign" />
          </a>
        ]}
        leftIcon={<FontIcon>attach_money</FontIcon>}
      />,

      <a href="/api/login/logout">
        <ListItem leftIcon={<FontIcon>close</FontIcon>} primaryText="Logout" />
      </a>
    ];
  }

  render() {
    const { App } = this.props;

    const navItems = this.state.loggedIn
      ? this._renderLoggedInItems()
      : this._renderLoggedOutItems();
    navItems.push(
      <ListItem
        leftIcon={<FontIcon>info</FontIcon>}
        primaryText="Documentation"
        nestedItems={[
          <a href={XYDOCUMENTATION_URL + 'tos.md'} target="_blank">
            <ListItem
              leftIcon={<FontIcon>gavel</FontIcon>}
              primaryText="Terms of Service"
            />
          </a>,
          <a href={XYDOCUMENTATION_URL + 'privacy.md'} target="_blank">
            <ListItem
              leftIcon={<FontIcon>security</FontIcon>}
              primaryText="Privacy Policy"
            />
          </a>,
          <a href={XYDOCUMENTATION_URL + 'integration.md'} target="_blank">
            <ListItem
              leftIcon={<FontIcon>code</FontIcon>}
              primaryText="Integration"
            />
          </a>
        ]}
      />
    );

    return (
      <React.Fragment>
        <Toolbar
          colored
          fixed
          actions={[
            <Button
              icon
              key="home"
              onClick={() => (location.hash = '#/')}
              iconChildren="home"
            />
          ]}
          title="Xyfir Accounts"
          nav={
            <Button
              icon
              onClick={() => this.onShowDrawer()}
              iconChildren="menu"
            />
          }
        />

        <Drawer
          onVisibilityChange={v => this.setState({ drawer: v })}
          autoclose={true}
          navItems={navItems}
          visible={this.state.drawer}
          header={
            <Toolbar
              colored
              nav={
                <Button
                  icon
                  onClick={() => this.setState({ drawer: false })}
                  iconChildren="arrow_back"
                />
              }
            />
          }
          type={Drawer.DrawerTypes.TEMPORARY}
        />
      </React.Fragment>
    );
  }
}
