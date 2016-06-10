import React from "react";

// Components
import Button from "../forms/Button";
import Alert from "../misc/Alert";

// Modules
import request from "../../lib/request";

export default class FinalStep extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			error: false, message: ""
		};
	}
	
	componentWillMount() {
		// Attempts to register user
		request({
			url: "../api/register/",
			method: "POST",
			data: this.props.user,
			success: (result) => {
				if (result.error) this.setState(result);
			}
		});
	}
	
	renderError() {
		return (
			<div className="form-step">
				<Alert type="error" title="Error">{this.state.message}</Alert>
				
				<Button onClick={this.props.prevStep}>Back</Button>
			</div>
		);
	}
	
	renderSuccess() {
		return (
			<div className="form-step">
				<Alert type="success" title="Account Created">
					You have successfully registered an account. 
					You will not be able to login until you verify your email.
				</Alert>
				
				<a className="link-lg" href="login">Login</a>
			</div>
		);
	}
	
	render() {
		if (this.state.error)
			return this.renderError();
		else
			return this.renderSuccess();
	}

}