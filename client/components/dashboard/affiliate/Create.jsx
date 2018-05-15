import { TextField, List, ListItem, Button, Paper } from 'react-md';
import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';

export default class CreateAffiliateCampaign extends React.Component {
  constructor(props) {
    super(props);

    this.state = { promotions: [], selected: 0 };
  }

  componentWillMount() {
    request
      .get('/api/affiliate/promotions')
      .end((err, res) => !err && this.setState(res.body));
  }

  onSelectPromotion(id) {
    this.setState({ selected: id });
  }

  onCreate() {
    request
      .post('/api/dashboard/affiliate')
      .send({
        code: this.refs.code.value,
        promo: this.state.selected
      })
      .end((err, res) => {
        if (err || res.body.error) {
          swal('Error', res.body.message, 'error');
        } else {
          location.hash = '#/dashboard/affiliate/list';
          swal('Success', res.body.message, 'success');
        }
      });
  }

  render() {
    return (
      <div className="create-campaign">
        <List className="md-paper md-paper--1 section">
          {this.state.promotions.map(p => (
            <ListItem
              key={p.id}
              onClick={() => this.onSelectPromotion(p.id)}
              primaryText={
                this.state.selected == p.id ? `[[${p.name}]]` : p.name
              }
              secondaryText={p.description}
            />
          ))}
        </List>

        <Paper zDepth={1} component="form" className="form section flex">
          <TextField
            id="text--promo"
            ref="code"
            type="text"
            label="Promo Code"
            helpText={
              'A unique promotional code that will link this campaign to ' +
              'selected promotion. Capital letters and numbers only, limited ' +
              'to 4-10 characters.'
            }
            className="md-cell"
            placeholder="CODE10"
          />

          <Button raised primary onClick={() => this.onCreate()}>
            Create
          </Button>
        </Paper>
      </div>
    );
  }
}
