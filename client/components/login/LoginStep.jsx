import React from "react";

// Components
import Button from "components/forms/Button";
import Alert from "components/misc/Alert";

// Modules
import request from "lib/request";

export default class LoginStep extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			error: false, message: "", loginAttempts: 0,
			passwordless: false
		};

		this.onPasswordlessLogin = this.onPasswordlessLogin.bind(this);
		this.onPasswordless = this.onPasswordless.bind(this);
		this.onLogin = this.onLogin.bind(this);
	}

	onLogin(e) {
		e.preventDefault();
		
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
	
	onPasswordless() {
		if (this.refs.email.value == "") {
			this.setState({
				error: true,
				message: "You must enter your email before attempting "
					+ "a passwordless login."
			}); return;
		}
		
		request({
			url: "../api/login/passwordless/" + this.refs.email.value,
			success: result => this.setState(result)
		});
	}

	onPasswordlessLogin(e) {
		e.preventDefault();

		if (this.refs.passwordless.value) {
			const code = this.refs.passwordless.value.split('_');

			location.href = "https://accounts.xyfir.com/api/login/passwordless/"
				+ code[0] + "/" + code[1];
		}
	}
	
	render() {
		let userAlert;

		if (this.state.error)
			userAlert = <Alert type="error" title="Error!">{this.state.message}</Alert>;
		else if (this.state.message)
			userAlert = <Alert type="success" title="Success!">{this.state.message}</Alert>;
	
		if (this.state.passwordless) {
			return (
				<div className="form-step passwordless old">
					<section className="form-step-header">
						<h2>Passwordless Login</h2>
						<p>
							A message was sent to your {
								this.state.passwordless == 1 ? "phone" : "email"
							} that contains a passwordless login link and an authorization code.
							<br />
							Click the link to bypass this step or copy and paste the authorization code below.
						</p>
					</section>
					
					<section className="form-step-body">
						<form onSubmit={this.onPasswordlessLogin}>
							<label>Authorization Code</label>
							<input type="text" ref="passwordless" />

							<Button>Login</Button>
						</form>
					</section>
				</div>
			)
		}
		else {
			return (
				<div className="form-step old">
					<section className="form-step-header">
						<h2>Login</h2>
						<span className="login-attempts">{
							this.state.loginAttempts > 0 ? (
								this.state.loginAttempts >= 5 ? (
									"You have hit the incorrect login attempt limit. "
										+ "Please wait 15 minutes."
								) : (
									(5 - this.state.loginAttempts)
									+ " login attempt(s) remaining."
								)
							) : ""
						}</span>
					</section>
					
					<section className="form-step-body">
						{userAlert}

						<form onSubmit={this.onLogin}>
							<label>Email</label>
							<input type="email" ref="email" />

							<label>Password</label>
							<input type="password" ref="password" />

							<Button>Login</Button>
						</form>
						
						<nav className="login-links">
							<a href="#/register">Create Account</a>
							<a href="#/recover">Account Recovery</a>
							<a onClick={this.onPasswordless}>Passwordless Login</a>
						</nav>
					</section>
				</div>
			);
		}
	}

}