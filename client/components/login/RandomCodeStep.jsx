import React from 'react';

export default class RandomCodeStep extends React.Component {
  
  render() {
    return (
      <div className='security-code'>
        <label>Security Code #{this.props.codeNum}</label>
        <input type='text' id='code' />
      </div>
    );
  }

}