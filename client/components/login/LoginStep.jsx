import React from "react";

// Components
import Button from "../forms/Button";
import Alert from "../misc/Alert";

// Modules
import request from "../../lib/request";

export default class LoginStep extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			error: false, message: ""
		};

		this.onPasswordless = this.onPasswordless.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onLogin = this.onLogin.bind(this);
	}

	onLogin() {
		const email = this.refs.email.value;
		const password = this.refs.password.value;
		
		request({
			url: "../api/login",
			method: "POST",
			data: { email, password },
			success: result => {
				if (result.error)
					this.setState(result);
				else
					this.props.next(result);
			}
		});
	}
	
	onKeyDown(e) {
		if (e.keyCode == 13)
			this.onLogin();
	}
	
	onPasswordless() {
		if (this.refs.email.value == "") {
			this.setState({
				error: true,
				message: "You must enter your email before attempting a passwordless login."
			});
			return;
		}
		
		request({
			url: "../api/login/passwordless/" + this.refs.email.value,
			success: result => this.setState(result)
		});
	}
	
	render() {
		const classn = this.state.error ? "input-error" : "";
		let userAlert;

		if (this.state.error)
			userAlert = <Alert type="error" title="Error!">{this.state.message}</Alert>;
		else if (this.state.message)
			userAlert = <Alert type="success" title="Success!">{this.state.message}</Alert>;
	
		return (
			<div className="form-step">
				<div className="form-step-header">
					<h2>Login</h2>
					<hr />
				</div>
			
				<div className="form-step-body">
					{userAlert}

					<input type="email" placeholder="Enter your email" ref="email" className={classn} />
					<input type="password" ref="password" placeholder="Password" onKeyDown={this.onKeydown} />
					
					<a href="#/register">Create Account </a> | 
					<a href="#/recover"> Account Recovery </a> | 
					<a onClick={this.onPasswordless}> Passwordless Login</a> 
				</div>
				
				<Button onClick={this.onLogin}>Login</Button>
			</div>
		);
	}

}