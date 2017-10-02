import request from 'superagent';
import React from 'react';

// react-md
import TextField from 'react-md/lib/TextFields';
import ListItem from 'react-md/lib/Lists/ListItem';
import Button from 'react-md/lib/Buttons/Button';
import Dialog from 'react-md/lib/Dialogs';
import List from 'react-md/lib/Lists/List';

export default class AccessTokens extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = { tokens: [], services: [], selected: -1, loading: true };
  }
  
  /**
   * Download all services that are linked to the user's account and call 
   * _getTokens().
   */
  componentWillMount() {
    request
      .get('api/dashboard/user/services')
      .end((err, res) => {
        this.setState(res.body);
        this._getTokens();
      });
  }

  /**
   * Delete all access tokens.
   */
  onDeleteAll() {
    request
      .delete('api/dashboard/user/tokens')
      .send({ all: true })
      .end((err, res) => this._getTokens());
  }

  /**
   * Delete the selected token.
   */
  onDelete() {
    const token = this.state.tokens[this.state.selected];

    request
      .delete('api/dashboard/user/tokens')
      .send({
        service: token.service_id,
        token: token.token
      })
      .end((err, res) => {
        if (!err && !res.body.error) this._getTokens();
      });
  }

  /**
   * Updates the name for the selected token.
   */
  onUpdate() {
    const token = this.state.tokens[this.state.selected];
    
    request
      .put('api/dashboard/user/tokens')
      .send({
        service: token.service_id,
        token: token.token,
        name: this.refs.name.value
      })
      .end((err, res) => this._getTokens());
  }

  /**
   * Load all tokens, remove tokens for unlinked services, set loading to false 
   * and selected to -1.
   */
  _getTokens() {
    request
      .get('api/dashboard/user/tokens')
      .end((err, res) => {
        const tokens = res.body.tokens.filter(
          t => !!this.state.services.find(s => t.service_id == s.id)
        );

        this.setState({ tokens, loading: false, selected: -1 });
      });
  }
  
  render() {
    if (this.state.loading) return <div />;

    const selected = this.state.tokens[this.state.selected] || {};

    return (
      <div className='dashboard-body access-tokens'>
        <p>
          Access tokens are generated when you login to a service via Xyfir Accounts.
          <br />
          Access tokens allow previously authorized devices to access services that use Xyfir Accounts without having to login for each session.
          <br />
          It is recommended to delete any tokens you don't recognize or if one of your devices are stolen or compromised. Deleting a token only means that the device which has stored that token will have to login to the corresponding service before it can access your account.
        </p>

        <Button
          secondary raised
          onClick={() => this.onDeleteAll()}
          iconChildren='delete'
        >Delete All</Button>

        <List
          className='tokens md-paper md-paper--1 section'
        >{this.state.tokens.map((token, i) =>
          <ListItem
            threeLines
            key={token.token}
            onClick={() => this.setState({ selected: i })}
            primaryText={token.token.substr(1, 20) + '...'}
            secondaryText={
              this.state.services.find(s => s.id == token.service_id).name +
              '\n' +
              token.name
            }
          />
        )}</List>

        <Dialog
          id='selected-token'
          title={selected.name}
          onHide={() => this.setState({ selected: -1 })}
          visible={this.state.selected > -1}
        >
          <div className='selected-access-token flex'>
            <dl>
              <dt>Created</dt>
              <dd>{(new Date(selected.created)).toLocaleString()}</dd>

              <dt>Last Used</dt>
              <dd>{(new Date(selected.last_use)).toLocaleString()}</dd>

              <dt>Expires</dt>
              <dd>{(new Date(selected.expires)).toLocaleString()}</dd>
            </dl>

            <TextField
              id='text--name'
              ref='name'
              type='text'
              label='Token Name'
              className='md-cell'
              defaultValue={selected.name}
            />

            <Button
              primary raised
              label='Update'
              onClick={() => this.onUpdate()}
              iconChildren='edit'
            >Edit</Button>
            <Button
              secondary raised
              label='Delete'
              onClick={() => this.onDelete()}
              iconChildren='delete'
            >Delete</Button>
          </div>
        </Dialog>
      </div>
    );
  }
  
}