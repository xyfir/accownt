import React from "react";

// Components
import Button from "components/forms/Button";

// Modules
import request from "lib/request";

// Constants
import { RECAPTCHA_KEY } from "constants/config";

export default class Register extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = { error: false, message: "", created: false };

		// Load reCAPTCHA lib
        let element = document.createElement("script");
        element.src = "https://www.google.com/recaptcha/api.js";
        element.type = "text/javascript";
        document.body.appendChild(element);
	}

	onSubmit() {
		const data = {
			email: this.refs.email.value,
			password: this.refs.password.value,
			passwordr: this.refs.passwordr.value,
			recaptcha: grecaptcha.getResponse()
		};
		
		if (data.password != data.passwordr) {
			this.setState({ error: true, message: "Passwords do not match." });
		}
		else {
			// Attempt to register user
			request({
				url: "../api/register",
				method: "POST", data, success: (result) => {
					if (result.error)
						this.setState(result);
					else
						this.setState({ created: true });
				}
			});
		}
	}

	onCheckEmail() {
		clearTimeout(this.checkEmailTimeout);

		if (this.refs.email.value.length) {
			// Check if email is available
			this.checkEmailTimeout = setTimeout(() => {
				request({
					url: "../api/register/email/" + this.refs.email.value,
					dataType: "text", success: (result) => {
						if (result == 1) {
							this.setState({
								error: true,
								message: "Email is already linked to an account."
							});
						}
						else {
							this.setState({ error: false, message: "" });
						}
					}
				});
			}, 200);
		}
	}
	
	render() {
		if (this.state.created) {
			return (
				<div className="register account-created">
					<section className="info">
						<span>
							Account created successfully. A verification link has been sent to your email.
							<br />
							You will not be able to login until you verify your email.
						</span>
					</section>

					<section className="controls">
						<Button type="primary" onClick={
							() => location.hash = "#/login"
						}>Continue to Login</Button>
					</section>
				</div>
			)
		}

		return (
			<div className="register form-step-body">
				<span className={this.state.error ? "error" : ""}>{
					this.state.message
				}</span>

				<section className="fields">
					<label>Email</label>
					<span className="input-description">
						Your email will be used to login to your account, receive notifications, and for account recovery.
					</span>
					<input
						ref="email"
						type="email"
						onChange={() => this.onCheckEmail()}
						placeholder="user@email.com"
					/>

					<label>Password</label>
					<input
						ref="password"
						type="password"
					/>
					<input
						ref="passwordr"
						type="password"
					/>
				</section>

				<section className="recaptcha-wrapper">
					<div
						className="g-recaptcha"
						data-sitekey={RECAPTCHA_KEY}
					/>
				</section>

				<section className="controls">
					<button onClick={() => this.onSubmit()} className="btn-primary">
						Create account
					</button>
				</section>
			</div>
		);
	}

}