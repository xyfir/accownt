import PropTypes from 'prop-types';
import request from 'superagent';
import React from 'react';

// react-md
import TabsContainer from 'react-md/lib/Tabs/TabsContainer';
import Paper from 'react-md/lib/Papers';
import Tabs from 'react-md/lib/Tabs/Tabs';
import Tab from 'react-md/lib/Tabs/Tab';

// Components
import Recovery from 'components/dashboard/user/security/Recovery';
import AppOTP from 'components/dashboard/user/security/AppOTP';
import SMSOTP from 'components/dashboard/user/security/SMSOTP';
import Codes from 'components/dashboard/user/security/Codes';

export default class Set2FA extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = { tab: 0 };
  }
  
  render() {
    if (this.props.google) return <div />;

    return (
      <Paper zDepth={1} className='tfa section'>
        <h2>Two Factor Authentication (2FA)</h2>
        <p>
          2FA allows you to further secure your account by requiring you to provide more data after you successfully provide your login email and password.
          <br />
          Any 2FA steps will be required upon logging in and during account recovery if you forget your password.
        </p>
        
        <Paper zDepth={2} className='otp section flex'>
        <TabsContainer
          colored
          onTabChange={i => this.setState({ tab: i })}
          activeTabIndex={this.state.tab}
        >
          <Tabs tabId='tab'>
            <Tab label='App'>
              <AppOTP {...this.props} enabled={this.props.appOtp} />
            </Tab>

            <Tab label='SMS'>
              <SMSOTP {...this.props} phone={this.props.phone} />
            </Tab>
          </Tabs>
        </TabsContainer>
        </Paper>

        <Codes {...this.props} codes={this.props.codes} />

        <Recovery {...this.props} />
      </Paper>
    );
  }
  
}

Set2FA.propTypes = {
  google: PropTypes.bool.isRequired,
  alert: PropTypes.func.isRequired,
  codes: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  appOtp: PropTypes.bool.isRequired,
};