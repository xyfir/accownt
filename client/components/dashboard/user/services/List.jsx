import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';

// react-md
import ListItem from 'react-md/lib/Lists/ListItem';
import Dialog from 'react-md/lib/Dialogs';
import List from 'react-md/lib/Lists/List';

export default class ListLinkedServices extends React.Component {
  constructor(props) {
    super(props);

    this.state = { services: [], selected: 0 };
  }

  componentWillMount() {
    request
      .get('/api/dashboard/user/services')
      .end((err, res) => this.setState(res.body));
  }

  onUnlink() {
    swal({
      title: 'Are you sure?',
      text: `
        You will no longer be able to access your account with this service.
      `,
      icon: 'warning',
      button: 'Unlink'
    })
      .then(() =>
        request.delete('/api/dashboard/user/services/' + this.state.selected)
      )
      .then(res => location.reload());
  }

  render() {
    const selected = !this.state.selected
      ? { id: 0, address: '', name: '' }
      : this.state.services.find(s => s.id == this.state.selected);

    return (
      <div className="dashboard-body dashboard-services">
        <List className="linked-services section md-paper md-paper--1">
          {this.state.services.map(s => (
            <ListItem
              key={s.id}
              onClick={() => this.setState({ selected: s.id })}
              className="service"
              primaryText={s.name}
              secondaryText={s.description}
            />
          ))}
        </List>

        <Dialog
          id="selected-service"
          title={selected.name}
          onHide={() => this.setState({ selected: 0 })}
          visible={!!selected.id}
        >
          <List>
            <ListItem
              primaryText="Edit"
              onClick={() => (location.href += '/' + selected.id)}
            />
            <ListItem
              primaryText="Go to site"
              onClick={() => window.open(selected.address)}
            />
            <ListItem primaryText="Unlink" onClick={() => this.onUnlink()} />
          </List>
        </Dialog>
      </div>
    );
  }
}
