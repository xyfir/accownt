import { render } from 'react-dom';
import React from 'react';

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
      hash: location.hash.split('?')[0].split('/')
    };

    window.onhashchange = () => this.setState({
      hash: location.hash.split('?')[0].split('/')
    });

    this._alert = this._alert.bind(this);
  }

  _alert(message) {
    this._Alert._alert(message);
  }

  render() {
    const view = (() => {
      const props = {
        App: this,
        hash: this.state.hash, alert: this._alert
      };

      switch (this.state.hash[1]) {
        case 'dashboard': return <Dashboard {...props} />
        case 'register': return <Register {...props} />
        case 'login': return <Login {...props} />
        default: return <Home {...props} />
      }
    })();

    return (
      <div className='app'>
        <Navigation App={this} />

        <div className='main md-toolbar-relative'>{view}</div>

        <Alert ref={i => this._Alert = i} />
      </div>
    )
  }

}

render(<App />, document.getElementById('content'));