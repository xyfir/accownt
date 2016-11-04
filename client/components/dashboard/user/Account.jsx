import React from "react";

// Components
import Button from "components/forms/Button";

// Modules
import request from "lib/request";

export default class Account extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = { email: "", recovered: false };

		this.onUpdatePassword = this.onUpdatePassword.bind(this);
	}
	
	componentWillMount() {
		request({
			url: "../api/dashboard/user/account",
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
			swal("Error", "Passwords do not match.", "error");
		}
		else if (newPass.length < 12) {
			swal(
				"Error",
				"Password needs to be at least 12 characters long.",
				"error"
			);
		}
		else {
			request({
				url: "../api/dashboard/user/account",
				method: "PUT",
				data: {
					currentPassword: curPass,
					newPassword: newPass
				},
				success: (result) => {
					if (result.error)
						swal("Error", this.state.message, "error");
					else if (this.state.message)
						swal("Success", this.state.message, "success");
				}
			});
		}
	}
	
	render() {
		return (
			<div className="dashboard-body dashboard-account">
				<h3>{this.state.email}</h3>
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