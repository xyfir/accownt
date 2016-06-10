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
				if (data.error && data.message.indexOf("already linked") > -1) {
					this.createSession();
				}
				else {
					// User hasn't linked service yet
					location.hash = "/register/" + this.state.service;
				}
			}
		});
	}
	
	_createSession() {
		request({
			url: "../api/service/session/" + this.state.service,
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