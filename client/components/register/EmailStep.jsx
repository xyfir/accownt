import React from "react";

// Components
import Button from "../forms/Button";

// Modules
import request from "../../lib/request";

export default class EmailStep extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			error: false, message: ""
		};

		this.onNextStep = this.onNextStep.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
	}

	onNextStep() {
		const email = document.querySelector("#email").value;
		
		// Check if email is valid
		const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
		
		if (!regex.test(email)) {
			this.setState({error: true, message: "Please enter a valid email."});
			return;
		}

		// Check if email is available
		request({
			url: "api/register/email/" + email,
			dataType: "text",
			success: result => {
				if (result == 1) {
					this.setState({error: true, message: "Email is already linked to an account."});
				}
				else {
					this.setState({error: false, message: ""});
					this.props.nextStep();
				}
			}
		});
	}
	
	onKeyDown(e) {
		if (e.keyCode == 13) this.onKeyDownStep();
	}
	
	render() {
		let inputClass = "";
		
		if (this.state.error) inputClass = "input-error";
	
		return (
			<div className="form-step">
				<div className="form-step-header">
					<h2>Email</h2>
					<p>
						Your email will be used to login to your account, receive notifications, and for account recovery.
					</p>
					<hr />
				</div>
			
				<div className="form-step-body">
					<p className="input-error">{this.state.message}</p>
					<input
						type="email"
						placeholder="Enter your email"
						id="email"
						className={inputClass}
						onKeyDown={this.onKeyDown}
					/>
				</div>
				
				<Button onClick={this.onKeyDownStep}>Next</Button>
			</div>
		);
	}

}