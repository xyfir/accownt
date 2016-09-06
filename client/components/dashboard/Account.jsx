import React from "react";

// Components
import Button from "../forms/Button";
import Alert from "../misc/Alert";

// Modules
import request from "../../lib/request";

export default class Account extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			error: false, message: "", email: "", recovered: false
		};

		this.onUpdatePassword = this.onUpdatePassword.bind(this);
	}
	
	componentWillMount() {
		request({
			url: "../api/dashboard/account",
			success: (result) => {
				if (result.loggedIn)
					this.setState(result);
				else
					location.hash = "/login";
			}
		});
	}
	
	onUpdatePassword() {
		const curPass = this.refs.cpassword.value + "";
		const newPass = this.refs.npassword.value;
		const conPass = this.refs.rpassword.value;
		
		if (newPass != conPass) {
			this.setState({error: true, message: "Passwords do not match."});
		}
		else if (newPass.length < 12) {
			this.setState({error: true, message: "Password needs to be at least 12 characters long."});
		}
		else {
			request({
				url: "../api/dashboard/account",
				method: "PUT",
				data: {
					currentPassword: curPass,
					newPassword: newPass
				},
				success: (result) => this.setState(result)
			});
		}
	}
	
	render() {
		let userAlert;
		
		if (this.state.error)
			userAlert = <Alert type="error" title="Error!">{this.state.message}</Alert>;
		else if (this.state.message)
			userAlert = <Alert type="success" title="Success!">{this.state.message}</Alert>;
		
		return (
			<div className="dashboard-body col-sm-12 col-md-8">
				{userAlert}
				
				<h3 style={{marginBottom:"0em"}}>{this.state.email}</h3>
				<a href="../api/login/logout" className="link-sm">Logout</a>
				
				<input
					type={this.state.recovered ? "hidden" : "password" }
					ref="cpassword"
					placeholder="Current Password"
				/>
				<input type="password" ref="npassword" placeholder="New Password" />
				<input type="password" ref="rpassword" placeholder="Confirm" />
				
				<Button onClick={this.onUpdatePassword}>Update Password</Button>
			</div>
		);
	}
	
}