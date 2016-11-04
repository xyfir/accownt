import React from "react";
import { render } from "react-dom";

// Components
import AccountRecovery from "./containers/AccountRecovery";
import DynamicStyles from "./misc/DynamicStyles";
import LoginService from "./containers/LoginService";
import LinkService from "./containers/LinkService";
import Dashboard from "./containers/Dashboard";
import Register from "./containers/Register";
import Login from "./containers/Login";

class App extends React.Component {
	
    constructor(props) {
        super(props);

        this.state = {
            hash: location.hash.split('/')
        };

        window.onhashchange = () => {
            this.setState({ hash: location.hash.split('/') });
        };
    }
	
	render() {
        let view;

		switch (this.state.hash[1]) {
            case "recover":
                view = <AccountRecovery hash={this.state.hash} />; break;
            
            case "login":
                if (this.state.hash[2] === undefined)
                    view = <Login hash={this.state.hash} />;
                else
                    view = <LoginService hash={this.state.hash} />;
                break;

            case "register":
                if (this.state.hash[2] === undefined)
                    view = <Register hash={this.state.hash} />;
                else
                    view = <LinkService hash={this.state.hash} />;
                break;

            case "dashboard":
                view = <Dashboard hash={this.state.hash} />; break;

            default:
                location.href = "../";
        }

        return (
            <div className="app">
                {view}
                <DynamicStyles />
            </div>
        )
	}
	
}

render(<App />, document.querySelector("#content"));