import React from "react";

// Components
import SmsVerify from "../login/SmsVerifyStep";
import RandCode from "../login/RandomCodeStep";
import Button from "../forms/Button";
import Alert from "../misc/Alert";

// Modules
import request from "../../lib/request";

export default class AccountRecovery extends React.Component {
	
	constructor(props) {
		super(props);

		this.state =  {
			error: false, message: "", email: "",
			auth: "", uid: 0
		};

		this.onVerify = this.onVerify.bind(this);
		this.onNext = this.onNext.bind(this);
	}
	
	onNext() {
		request({
			url: "../api/recover",
			method: "POST",
			data: {email: this.refs.email.value},
			success: result => {
				if (result.error)
					this.setState(result);
				else
					this.setState(result); // {error:false, message:email sent} || {error:false,security:{},...}
			}
		});
	}
	
	onVerify() {
		const data = {
			phone: this.state.security.phone,
			email: this.state.email,
			auth: this.state.auth,
			uid: this.state.uid,
			code: this.state.security.code ? document.querySelector("#code").value : 0,
			codeNum: this.state.security.code ? this.state.security.codeNumber : 0,
			smsCode: this.state.security.phone ? document.querySelector("#smsCode").value : 0
		};
	
		request({
			url: "../api/recover/verify",
			method: "POST", data,
			success: result => this.setState(result)
		});
	}
	
	render() {
		let userAlert;

		if (this.state.error)
			userAlert = <Alert type="error" title="Error!">{this.state.message}</Alert>;
		else if (this.state.message)
			userAlert = <Alert type="success" title="Success!">{this.state.message}</Alert>;
		
		if (this.state.security) {
			// Load security steps
			let sms, code, steps = 0;
		
			if (this.state.security.phone) {
				sms = <SmsVerify />;
				steps++;
			}
			if (this.state.security.code) {
				code = <RandCode codeNum={this.state.security.codeNumber + 1} />;
				steps++;
			}
			
			return (
				<div className="form-step">
					<div className="form-step-header">
						<h2>Security</h2>
						<p>
							Your account has extra security measures enabled. 
							You must enter the correct information before receiving an account recovery email. 
						</p>
						<hr />
					</div>
				
					<div className="form-step-body">
						{userAlert}
						{sms}
						{steps > 1 ? <hr /> : ""}
						{code}
					</div>
					
					<Button onClick={this.onVerify}>Recover Account</Button>
				</div>
			);
		}
		else {
			return (
				<div className="form-step">
					<div className="form-step-header">
						<h2>Account Recovery</h2>
						<p>
							Enter the email you use to login with. Emails only linked to a profile will not work.
						</p>
						<hr />
					</div>
				
					<div className="form-step-body">
						{userAlert}
						<input type="email" placeholder="Enter your email" ref="email" />
					</div>
					
					<Button onClick={this.onNext}>Next</Button>
				</div>
			);
		}
	}
	
}