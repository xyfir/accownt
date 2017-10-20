import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';

// react-md
import ListItem from 'react-md/lib/Lists/ListItem';
import Button from 'react-md/lib/Buttons/Button';
import Dialog from 'react-md/lib/Dialogs';
import Paper from 'react-md/lib/Papers';
import List from 'react-md/lib/Lists/List';

export default class ListAffiliateCampaigns extends React.Component {

  constructor(props) {
    super(props);

    this.state = { campaigns: [], selected: -1 };
  }

  componentWillMount() {
    request
      .get('/api/dashboard/affiliate')
      .end((err, res) => !err && this.setState(res.body));
  }

  /** @param {string} code */
  onDelete(code) {
    swal({
      title: 'Are you sure?',
      text: 'This action cannot be undone. All unpaid earnings will be lost.',
      icon: 'warning',
      button: 'Delete'
    })
    .then(() => request.delete('/api/dashboard/affiliate/' + code))
    .then(res => {
      if (res.body.error) {
        swal.close();
        swal('Error', 'Could not delete', 'error');
      }
      else {
        location.reload();
      }
    });
  }

  render() {
    const selected =
      this.state.campaigns[this.state.selected] ||
      { promo: { link: '' } };

    return (
      <div className='campaigns-list'>
        <p>
          Statistics are only for the current payment cycle.
          <br />
          Once the next payments are sent out these values will be reset.
        </p>

        <List className='md-paper md-paper--1 section'>{
          this.state.campaigns.map((c, i) =>
            <ListItem
              key={c.code}
              onClick={() => this.setState({ selected: i })}
              primaryText={`[${c.code}] ${c.promo.name}`}
              secondaryText={c.promo.description}
            />
          )
        }</List>

        <Dialog
          id='selected-affiliate-campaign'
          title={selected.promo.name}
          onHide={() => this.setState({ selected: -1 })}
          visible={this.state.selected > -1}
          aria-label='Selected Campaign'
        >
          <a
            href={selected.promo.link.replace('%CODE%', selected.code)}
            target='_blank'
            className='promo-link'
          >Link</a>

          <ul>
            <li>{selected.signups} Signups</li>
            <li>{selected.purchases} Purchases</li>
            <li>${selected.earnings} Earnings</li>
          </ul>

          <Button
            raised secondary
            onClick={() => this.onDelete(selected.code)}
            iconChildren='delete'
          >Delete</Button>
        </Dialog>
      </div>
    );
  }

}