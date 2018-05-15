import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';

// Components
import Form from 'components/dashboard/developer/CreateOrEditForm';

export default class EditService extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Update an existing service.
   * @param {object} data
   */
  onUpdate(data) {
    request
      .put('api/dashboard/developer/services/' + this.props.id)
      .send(data)
      .end((err, res) => {
        if (err || res.body.error) swal('Error', res.body.message, 'error');
        else location.hash = '#/dashboard/developer/' + this.props.id;
      });
  }

  render() {
    return (
      <div className="dashboard-body dashboard-create">
        <Form onSubmit={d => this.onUpdate(d)} loadDataFrom={this.props.id} />
      </div>
    );
  }
}
