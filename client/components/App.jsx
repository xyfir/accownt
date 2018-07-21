import { render } from 'react-dom';
import React from 'react';

// Constants
import { XACC } from 'constants/config';

// Components
import Navigation from 'components/app/Navigation';
import Dashboard from 'components/containers/Dashboard';
import Register from 'components/containers/Register';
import Login from 'components/containers/Login';
import Alert from 'components/app/Alert';
import Home from 'components/containers/Home';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      path: location.pathname.split('/')
    };

    document.addEventListener('click', e => {
      const el =
        e.target.nodeName == 'A'
          ? e.target
          : e.path
            ? e.path.find(el => el.nodeName == 'A')
            : null;

      if (!el) return;
      if (el.href.indexOf(XACC) != 0) return;
      if (e.ctrlKey || e.target.target == '_blank') return window.open(el.href);

      e.preventDefault();

      history.pushState({}, '', el.href);
      this.setState({ path: el.pathname.split('/') });
    });

    window.addEventListener('popstate', e =>
      this.setState({
        path: location.pathname.split('/')
      })
    );

    this._alert = this._alert.bind(this);
  }

  _alert(message) {
    this._Alert._alert(message);
  }

  render() {
    const view = (() => {
      const props = {
        App: this,
        path: this.state.path,
        alert: this._alert
      };

      switch (this.state.path[1]) {
        case 'dashboard':
          return <Dashboard {...props} />;
        case 'register':
          return <Register {...props} />;
        case 'login':
          return <Login {...props} />;
        default:
          return <Home {...props} />;
      }
    })();

    return (
      <div className="app">
        <Navigation App={this} />

        <div className="main md-toolbar-relative">{view}</div>

        <Alert ref={i => (this._Alert = i)} />
      </div>
    );
  }
}

render(<App />, document.getElementById('content'));
