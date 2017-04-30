import React from "react";

// Components
import Alert from "../misc/Alert";

// Modules
import request from "../../lib/request";

export default class LoginService extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			error: false, message: "",
			service: this.props.hash[2]
		};

		this._createSession = this._createSession.bind(this);
	}
	
	componentWillMount() {
		request({
			url: "../api/service/" + this.state.service,
			success: data => {
				// User is not logged in
				// After login user will be redirect back here
				if (data.error && data.message == "Not logged in")
					location.hash = "/login";
				// Create session
				else if (data.error && data.message.indexOf("already linked") > -1)
					this._createSession();
				// User hasn't linked service yet
				else
					location.hash = "/register/" + this.state.service;
			}
		});
	}
	
	_createSession() {
		request({
			url: `../api/service/${this.state.service}/session`,
			method: "POST",
			success: data => {
				this.setState({
					error: false, message: "Logged in successfully."
				});
				
				// Redirect user to service's login
				location.href = data.address + "?auth=" + data.auth + "&xid=" + data.xid;
			}
		});
	}
	
	render() {
		if (this.state.message)
			return <Alert type="success" title="Success!">{this.state.message}</Alert>;
		else
			return <div />;
	}
	
}