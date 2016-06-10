import React from "react";
import { render } from "react-dom";

// Components
import AccountRecovery from "./containers/AccountRecovery";
import LoginService from "./containers/LoginService";
import LinkService from "./containers/LinkService";
import Dashboard from "./containers/Dashboard";
import Register from "./containers/Register";
import Service from "./containers/Service";
import Login from "./containers/Login";

class App extends React.Component {
	
    constructor(props) {
        super(props);

        this.state = {
            hash: location.hash.split('/')
        };

        window.onhashchange = function() {
            this.setState({ hash: location.hash.split('/') });
        };
    }
	
	render() {
		switch (this.state.hash[1]) {
            case "recover":
                return <AccountRecovery hash={this.state.hash} />;
            
            case "login":
                if (this.state.hash[2] === undefined)
                    return <Login hash={this.state.hash} />;
                else
                    return <LoginService hash={this.state.hash} />;

            case "register":
                if (this.state.hash[2] === undefined)
                    return <Register hash={this.state.hash} />;
                else
                    return <LinkService hash={this.state.hash} />;

            case "dashboard":
                return <Dashboard hash={this.state.hash} />;
            
            case "service":
                return <Service hash={this.state.hash} />;
        }
	}
	
}

render(<App />, document.querySelector("#content"));