import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';

// Components
import Form from 'components/dashboard/developer/CreateOrEditForm';

export default class CreateService extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Create a new service.
   * @param {object} data
   */
  onCreate(data) {
    request
      .post('api/dashboard/developer/services')
      .send(data)
      .end((err, res) => {
        if (err || res.body.error) swal('Error', res.body.message, 'error');
        else location.hash = '#/dashboard/developer';
      });
  }

  render() {
    return (
      <div className="dashboard-body dashboard-create">
        <Form onSubmit={d => this.onCreate(d)} />
      </div>
    );
  }
}
