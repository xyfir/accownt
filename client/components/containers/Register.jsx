import React from "react";

// Components
import Button from "../forms/Button";

// Modules
import request from "../../lib/request";

// Constants
import { RECAPTCHA_KEY } from "../../constants/config";

export default class Register extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = { error: false, message: "" };

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

		const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
		let error = "";
		
		// Verify data
		if (!emailRegex.test(data.email))
			error = "Please enter a valid email.";
		else if (data.password != data.passwordr)
			error = "Passwords do not match.";
		
		if (error) {
			this.setState({ error: true, message: error });
		}
		else {
			// Attempt to register user
			request({
				url: "../api/register",
				method: "POST", data, success: (result) => {
					if (result.error) {
						this.setState(result);
					}
					else {
						this.setState({
							error: false, message: "Account created."
								+ " You will not be able to login until you verify your email."
						});
					}
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
								error: true, message: "Email is already linked to an account."
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
		return (
			<div className="register form-step-body">
				<span className={"message" + (this.state.error ? " error" : "")}>{
					this.state.message
				}</span>

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
				<span className="input-description">
					A password should contain letters, numbers, special characters and be over 12 characters long.
				</span>
				<input
					ref="password"
					type="password"
				/>
				<input
					ref="passwordr"
					type="password"
				/>

				<div className="recaptcha-wrapper">
					<div
						className="g-recaptcha"
						data-sitekey={RECAPTCHA_KEY}
					/>
				</div>

				<button onClick={() => this.onSubmit()} className="btn-primary">
					Create account
				</button>
			</div>
		);
	}

}