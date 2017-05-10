import request from 'superagent';
import React from 'react';

// react-md
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';

export default class DeleteService extends React.Component {
  
  constructor(props) {
    super(props);
  }

  onConfirm() {
    request
      .delete('api/dashboard/developer/services/' + this.props.id)
      .end((err, res) =>
        !err && !res.body.error && (location.hash = '#/dashboard/developer')
      )
  }

  render() {
    return(
      <Paper zDepth={1} className='delete-service section'>
        <h2>Are you sure?</h2>
        <p>
          All users will be unlinked from your service. This action cannot be undone.
        </p>
        
        <Button
          primary raised
          label='Delete Service'
          onClick={() => this.onConfirm()}
        >delete</Button>
      </Paper>
    );
  }

}