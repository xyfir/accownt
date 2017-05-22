import PropTypes from 'prop-types';
import request from 'superagent';
import React from 'react';
import copy from 'copyr';

// react-md
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';

export default class RecoveryCode extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = { show: false, recovery: '', type: 'rstring' };
  }
  
  /**
   * Generate a new recovery code.
   */
  onGenerate() {
    const refKey = Object.keys(this.refs)[0];

    request
      .put('api/dashboard/user/security/recovery-code')
      .send({
        type: this.state.type, [refKey]: this.refs[refKey].getField().value
      })
      .end((err, res) => {
        if (err || res.body.error)
          this.props.alert(res.body.message);
        else
          this.setState({ recovery: res.body.recovery});
      })
  }

  /**
   * Download the recovery code and render it.
   */
  onShow() {
    request
      .get('api/dashboard/user/security/recovery-code')
      .end((err, res) => {
        if (!err) {
          res.body.show = true;
          this.setState(res.body);
        }
      });
  }
  
  render() {
    return (
      <Paper zDepth={2} className='recovery-code section'>
        <h3>Recovery Code</h3>
        <p>
          A recovery code allows you to bypass all of your other 2FA steps in the event that you need to access your account and cannot provide one or multiple of the required 2FA data.
          <br />
          Having a recovery code is optional and allows you to always have access to your account so long as you have the current recovery code saved <em>and</em> have access to your account email so you can retrieve the recovery link.
        </p>
        
        {this.state.show ? (
          <div className='flex'>
            <TextField
              id='textarea--recovery-code'
              rows={2}
              type='text'
              label='Current Recovery Code'
              value={this.state.recovery}
              className='md-cell'
            />

            <h4>Generate New Code</h4>

            <SelectField
              id='select--recovery-type'
              label='Generate Code Type'
              value={this.state.type}
              onChange={v => this.setState({ type: v })}
              menuItems={[
                { label: 'Custom', value: 'custom' },
                { label: 'Words and Numbers', value: 'wordsnumbers' },
                { label: 'Random String', value: 'rstring' }
              ]}
              className='md-cell'
            />

            {this.state.type == 'custom' ? (
              <TextField
                id='textarea--new-recovery-code'
                ref='recovery'
                rows={2}
                type='text'
                label='New Recovery Code'
                className='md-cell'
              />
            ) : this.state.type == 'wordsnumbers' ? (
              <TextField
                id='number--wordsnumbers-count'
                ref='count'
                min={10}
                max={500}
                type='number'
                label='Words / Numbers Count'
                className='md-cell'
              />
            ) : (
              <TextField
                id='number--string-length'
                ref='strLength'
                min={32}
                max={4096}
                type='number'
                label='String Length'
                className='md-cell'
              />
            )}

            <Button
              primary raised
              label='Generate'
              onClick={() => this.onGenerate()}
            />
          </div>
        ) : (
          <Button
            primary raised
            label='Show Code'
            onClick={() => this.onShow()}
          />
        )}
      </Paper>
    );
  }
  
}

RecoveryCode.propTypes = {
  alert: PropTypes.func.isRequired
};