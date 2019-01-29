import request from 'superagent';
import React from 'react';

// Modules
import query from 'lib/url/parse-query-string';

export default class RegisterService extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      linked: false,
      id: location.pathname.split('/')[3]
    };

    this._createSession = this._createSession.bind(this);
  }

  componentDidMount() {
    request.get('/api/service/' + this.state.id).end((err, res) => {
      if (err) {
        if (!res.body.service) {
          location.href = '/';
        } else if (res.body.message == 'Not logged in') {
          location.replace(
            '/login?serviceName=' +
              encodeURIComponent(res.body.service.name) +
              '&serviceUrl=' +
              encodeURIComponent(res.body.service.url) +
              '&email=' +
              encodeURIComponent(query().email || '')
          );
        } else if (res.body.message.indexOf('already linked')) {
          this._createSession();
        }
      } else {
        request.post(`/api/service/${this.state.id}/link`).end((err, res) => {
          // Fallback to form
          if (err) this.setState(res.body);
          else this._createSession();
        });
      }
    });
  }

  /**
   * Link the user's account to the service.
   */

  /**
   * Creates a session linked to the user and service. Redirect the user to
   * the service's login route.
   */
  _createSession() {
    request
      .post(`/api/service/${this.state.id}/session`)
      .end((err, res) => !err && location.replace(res.body.redirect));
  }

  render() {
    return null;
  }
}
