import request from 'superagent';
import React from 'react';
import copy from 'copyr';

// react-md
import Subheader from 'react-md/lib/Subheaders';
import TextField from 'react-md/lib/TextFields';
import ListItem from 'react-md/lib/Lists/ListItem';
import Button from 'react-md/lib/Buttons/Button';
import Dialog from 'react-md/lib/Dialogs';
import Paper from 'react-md/lib/Papers';
import List from 'react-md/lib/Lists/List';

export default class ViewService extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      selected: '',
      keys: [],
      id: 0,
      name: '',
      description: '',
      owner: 0,
      address: ''
    };
  }

  componentWillMount() {
    request
      .get('/api/dashboard/developer/services/' + this.props.id)
      .end((err, res) => {
        if (!err) {
          const data = res.body;
          data.loading = false;
          this.setState(data);
        }
      });
  }

  onGenerateKey() {
    request
      .post(`/api/dashboard/developer/services/${this.props.id}/key`)
      .end((err, res) => {
        if (!err)
          this.setState({ keys: this.state.keys.concat([res.body.key]) });
      });
  }

  onDelete() {
    const key = this.state.selected;

    request
      .delete(`/api/dashboard/developer/services/${this.props.id}/key`)
      .send({ key })
      .end((err, res) => {
        if (!err) {
          this.setState({
            keys: this.state.keys.filter(k => k != key),
            selected: ''
          });
        }
      });
  }

  onCopy() {
    copy(this.state.selected);
    this.setState({ selected: '' });
  }

  render() {
    if (this.state.loading) return <div />;

    const s = this.state;

    return (
      <div className="service-view">
        <Paper zDepth={1} className="section">
          <h2>
            {this.state.name} ({this.state.id})
          </h2>
          <p>{this.state.description}</p>
          <a href={this.state.address}>{this.state.address}</a>
        </Paper>

        <List className="service-keys md-paper md-paper--1 section">
          {this.state.keys.map(k => (
            <ListItem
              key={k}
              onClick={() => this.setState({ selected: k })}
              primaryText={k}
            />
          ))}
        </List>

        <Dialog
          id="selected-service"
          title={this.state.selected}
          onHide={() => this.setState({ selected: '' })}
          visible={!!this.state.selected}
        >
          <List>
            <ListItem
              primaryText="Copy to clipboard"
              onClick={() => this.onCopy()}
            />
            <ListItem primaryText="Delete" onClick={() => this.onDelete()} />
          </List>
        </Dialog>

        <Button raised primary onClick={() => this.onGenerateKey()}>
          Generate Key
        </Button>
      </div>
    );
  }
}
