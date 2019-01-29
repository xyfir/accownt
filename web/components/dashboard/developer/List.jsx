import request from 'superagent';
import React from 'react';

// react-md
import ListItem from 'react-md/lib/Lists/ListItem';
import List from 'react-md/lib/Lists/List';

export default class ListServices extends React.Component {
  constructor(props) {
    super(props);

    this.state = { services: [] };
  }

  componentDidMount() {
    request
      .get('/api/dashboard/developer/services')
      .end((err, res) => !err && this.setState(res.body));
  }

  render() {
    return (
      <List className="services md-paper md-paper--1 section">
        {this.state.services.map(s => (
          <a href={'/dashboard/developer/' + s.id}>
            <ListItem key={s.id} primaryText={s.name} />
          </a>
        ))}
      </List>
    );
  }
}
