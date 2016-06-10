import React from "react";

// Components
import Button from "../forms/Button";

export default class PasswordStep extends React.Component {

	constructor(props) {
		super(props);

		this.state = { error: false, message: "" };

		this.onNextStep = this.onNextStep.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
	}

	onNextStep() {
		const password  = document.querySelector("#password").value;
		const repeat = document.querySelector("#passwordr").value;
		
		if (password != repeat) {
			this.setState({error: true, message: "Passwords do not match."});
		}
		else if (password.length < 12) {
			this.setState({error: true, message: "Password needs to be at least 12 characters long."});
		}
		else {
			this.setState({error: false, message: ""})
			this.props.nextStep();
		}
	}
	
	onKeyDown(e) {
		if (e.keyCode == 13) this.onNextStep();
	}
	
	render() {
		return (
			<div className="form-step">
				<div className="form-step-header">
					<h2>Password</h2>
					<p>A password should contain letters, numbers, special characters and be over 12 characters long.</p>
					<hr />
				</div>
			
				<div className="form-step-body">
					<p className="input-error">{this.state.message}</p>
					<input type="password" id="password" className={this.state.error ? "input-error" : ""} placeholder="Password" />
					<input type="password" id="passwordr" className={this.state.error ? "input-error" : ""} placeholder="Confirm" onKeyDown={this.onKeyDown} />
				</div>
				
				<Button onClick={this.props.prevStep}>Back</Button>
				<Button onClick={this.onNextStep}>Next</Button>
			</div>
		);
	}

}