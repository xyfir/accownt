import React from "react";

// Components
import Button from "../forms/Button";
import Alert from "../misc/Alert";

// Modules
import request from "../../lib/request";

export default class Security extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			error: false, message: "", phone: "", whitelist: "",
			codes: "", passwordless: 0, verifyingSms: false
		};

		this.onUpdatePasswordless = this.onUpdatePasswordless.bind(this);
		this.onUpdateWhitelist = this.onUpdateWhitelist.bind(this);
		this.onChangeWhitelist = this.onChangeWhitelist.bind(this);
		this.onGenerateCodes = this.onGenerateCodes.bind(this);
		this.onUpdatePhone = this.onUpdatePhone.bind(this);
	}
	
	componentWillMount() {
		request({
			url: "../api/dashboard/security",
			success: (result) => {
				// Grab and set security data 
				this.setState(result);
			}
		});
	}
	
	onUpdatePhone() {
		if (this.state.verifyingSms) {
			request({
				url: "../api/dashboard/security/phone/verify",
				method: "PUT",
				data: {
					phone: this.refs.phone.value,
					code: this.refs.smsCode.value
				},
				success: (result) => {
					this.setState(result);
					this.setState({verifyingSms: false});
				}
			});
		}
		else {
			let phone = this.refs.phone.value;
			phone = phone ? phone : 0;
			
			request({
				url: "../api/dashboard/security/phone",
				method: "PUT", data: { phone },
				success: (result) => { return; }
			});
			
			if (phone != 0)
				this.setState({verifyingSms: true});
		}
	}
	
	onGenerateCodes() {
		request({
			url: "../api/dashboard/security/codes",
			method: "PUT",
			data: {
				type: this.refs.codeType.value,
				count: this.refs.codeCount.value
			},
			success: (result) => this.setState(result)
		});
	}
	
	onChangeWhitelist() {
		this.setState({
			whitelist: this.refs.whitelist.replace("\n", ",")
		});
	}
	
	onUpdateWhitelist() {
		request({
			url: "../api/dashboard/security/whitelist",
			method: "PUT",
			data: {
				whitelist: this.refs.whitelist.value.replace("\n", ",")
			},
			success: (result) => this.setState(result)
		});
	}
	
	onUpdatePasswordless() {
		request({
			url: "../api/dashboard/security/passwordless",
			method: "PUT",
			data: {
				passwordless: this.refs.passwordless.value
			},
			success: (result) => this.setState(result)
		});
	}
	
	render() {
		let userAlert;
		
		if (this.state.error)
			userAlert = <Alert type="error" title="Error!">{this.state.message}</Alert>;
		else if (this.state.message)
			userAlert = <Alert type="success" title="Success!">{this.state.message}</Alert>;
		
		return (
			<div className="dashboard-body dashboard-security">
				{userAlert}
				
				<section className="2fa">
					<h2>Two Factor Authentication</h2>
					<p>
						Upon login and account recovery we will send a code to your phone via SMS.
					</p>
					
					<label>Phone #</label>
					<input
						ref="phone"
						type="tel"
						defaultValue={this.state.phone > 0 ? this.state.phone : ""}
					/>
					
					{this.state.verifyingSms ? (
						<div>
							<label>Verification Code</label>
							<input type="text" ref="smsCode" />
						</div>
					) : (
						<span />
					)}
					
					<Button onClick={this.onUpdatePhone}>
						{this.state.verifyingSms ? "Verify Code" : "Update Phone"}
					</Button>
				</section>
				
				<section className="security-codes">
					<h2>Security Codes</h2>
					<p>
						A numbered list of 5-20 randomly generated words and/or numbers. On login and account recovery a specific code must be entered.
					</p>
					
					<ol>{
						this.state.codes.split(",").map(code => {
							return <li>{code}</li>;
						})
					}</ol>
					
					<label>Code Type</label>
					<select ref="codeType">
						<option value="1">Numbers</option>
						<option value="2">Words</option>
						<option value="3">Both</option>
					</select>
					
					<label>How Many?</label>
					<input
						type="number"
						ref="codeCount"
						max="20"
						min="5"
					/>
					
					<Button onClick={this.onGenerateCodes}>Generate Codes</Button>
				</section>
				
				<section className="ip-whitelist">
					<h2>IP Whitelist</h2>
					<p>
						Only allow logins from a list of whitelisted IP addresses.
						<br />
						<small>Each address should be separated by a new line.</small>
					</p>
					
					<textarea
						value={this.state.whitelist.replace(",", "\n")}
						onChange={this.onChangeWhitelist}
						ref="whitelist"
					/>
					
					<Button onClick={this.onUpdateWhitelist}>Update Whitelist</Button>
				</section>
				
				<section className="passwordless-login">
					<h2>Passwordless Login</h2>
					<p>Login via a link sent to your email or phone.</p>
					
					<select ref="passwordless">
						<option value="0">Disabled</option>
						<option value="1">Receive via SMS</option>
						<option value="2">Receive via Email</option>
						<option value="3">Receive via Both</option>
					</select>
					
					<Button onClick={this.onUpdatePasswordless}>Update</Button>
				</section>
			</div>
		);
	}
	
}