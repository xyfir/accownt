import React from "react";

// Components
import PasswordStep from "../register/PasswordStep";
import ProgressBar from "../register/ProgressBar";
import EmailStep from "../register/EmailStep";
import FinalStep from "../register/FinalStep";

export default class Register extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			step: 1, user: { email: "", password: "" }
		};

		this.onNextStep = this.onNextStep.bind(this);
		this.onPrevStep = this.onPrevStep.bind(this);
	}
	
	onNextStep() {
		if (this.state.step == 1) {
			this.setState({ user: {
				email: document.querySelector("#email").value,
				password: this.state.user.password
			}});
		}
		else if (this.state.step == 2) {
			this.setState({ user: {
				password: document.querySelector("#password").value,
				email: this.state.user.email
			}});
		}
	
		this.setState({step: this.state.step + 1});
	}
	
	onPrevStep() {
		this.setState({step: this.state.step - 1});
	}
	
	render() {
		let comp;
		
		switch (this.state.step) {
			case 1:
				comp = <EmailStep nextStep={this.onNextStep} />;
				break;
			case 2:
				comp = <PasswordStep nextStep={this.onNextStep} prevStep={this.onPrevStep} />;
				break;
			case 3:
				comp = <FinalStep prevStep={this.onPrevStep} user={user} />;
		}
		
		return (
			<div>
				{comp}
				<hr />
				<ProgressBar completed={(this.state.step / 3) * 100} />
			</div>
		);
	}

}