import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';

// react-md
import ListItem from 'react-md/lib/Lists/ListItem';
import FontIcon from 'react-md/lib/FontIcons';
import Button from 'react-md/lib/Buttons/Button';
import Dialog from 'react-md/lib/Dialogs';
import List from 'react-md/lib/Lists/List';

export default class ProfileList extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = { profiles: [], selected: -1 };
  }

  onDelete() {
    const {id} = this.state.profiles[this.state.selected];

    swal({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      button: 'Delete'
    })
    .then(() => request.delete('/api/dashboard/user/profiles/' + id))
    .then(res => {
      if (res.body.error) {
        swal.close();
        swal('Error', res.body.message, 'error');
      }
      else {
        location.reload();
      }
    });
  }
  
  componentWillMount() {
    request
      .get('/api/dashboard/user/profiles')
      .end((err, res) => !err && this.setState(res.body));
  }
  
  render() {
    const selected = this.state.profiles[this.state.selected] || {};

    return (
      <div className='dashboard-body dashboard-profiles'>
        <p>
          Profiles allow you to easily give services linked to your Xyfir Account access to required or optional information.
        </p>
        <p>
          When linking a service to your Xyfir Account you will be able to choose a profile to for the service to access.
        </p>

        <List className='section md-paper md-paper--1'>{
          this.state.profiles.map((p, i) =>
            <ListItem
              key={p.id}
              onClick={() => this.setState({ selected: i })}
              primaryText={p.name}
            />
          )
        }</List>

        <Dialog
          id='selected-profile'
          title={selected.name}
          onHide={() => this.setState({ selected: 0 })}
          visible={!!selected.id}
          aria-label='Selected profile'
        >
          <List>
            <ListItem
              primaryText='Edit'
              leftIcon={<FontIcon>edit</FontIcon>}
              onClick={() => location.hash += '/' + selected.id}
            />
            <ListItem
              primaryText='Delete'
              leftIcon={<FontIcon>delete</FontIcon>}
              onClick={() => this.onDelete()}
            />
          </List>
        </Dialog>

        <Button
          floating fixed primary
          tooltipPosition='left'
          fixedPosition='br'
          tooltipLabel='Create profile'
          iconChildren='add'
          onClick={() => location.hash += '/create'}
        />
      </div>
    );
  }
  
}