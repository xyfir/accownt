import PropTypes from 'prop-types';
import request from 'superagent';
import React from 'react';
import copy from 'copyr';

// react-md
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';
import ListItem from 'react-md/lib/Lists/ListItem';
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';
import List from 'react-md/lib/Lists/List';

export default class SetSecurityCodes extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = { codes: this.props.codes.split(',') };
  }
  
  onGenerate() {
    request
      .put('api/dashboard/user/security/codes')
      .send({
        type: this.refs.codeType.state.value,
        count: this.refs.codeCount.getField().value
      })
      .end((err, res) => {
        this.props.alert(res.body.message);
        this.setState({ codes: res.body.codes.split(',') });
      })
  }

  onReset() {
    this.refs.codeCount.getField().value = 0;
    this.onGenerate();
  }

  onCopy() {
    copy(
      this.state.codes
        .map((c, i) => `${i + 1}: ${c}`)
        .join(', ')
    );

    this.props.alert('Codes copied to clipboard');
  }
  
  render() {
    return (
      <Paper zDepth={2} className='security-codes section flex'>
        <h3>Security Codes</h3>
        <p>
          A numbered list of 5-20 randomly generated words and/or numbers. A specific code from the list must be entered where 2FA is required.
        </p>
        
        {this.state.codes.length >= 5 ? (
          <div>
            <List ordered>{
              this.state.codes.map((code, i) =>
                <ListItem
                  key={code}
                  primaryText={`${i + 1}. ${code}`}
                />
              )
            }</List>

            <Button
              flat primary
              label='Copy to clipboard'
              onClick={() => this.onCopy()}
            />
          </div>
        ) : null}
        
        <SelectField
          id='select--code-type'
          ref='codeType'
          label='Code Type'
          menuItems={[
            { label: 'Numbers', value: '1' },
            { label: 'Words', value: '2' },
            { label: 'Both', value: '3' }
          ]}
          className='md-cell'
        />
        
        <TextField
          id='number--code-count'
          min={5}
          max={20}
          ref='codeCount'
          type='number'
          label='Code Count'
          className='md-cell'
        />
        
        <Button
          primary raised
          label='Generate'
          onClick={() => this.onGenerate()}
        />
        <Button
          secondary raised
          label='Reset'
          onClick={() => this.onReset()}
        />
      </Paper>
    );
  }
  
}

SetSecurityCodes.propTypes = {
  alert: PropTypes.func.isRequired,
  codes: PropTypes.string.isRequired
};