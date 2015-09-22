var EmailStep = require('./register/EmailStep.jsx');
var PasswordStep = require('./register/PasswordStep.jsx');
var FinalStep = require('./register/FinalStep.jsx');
var ProgressBar = require('./forms/ProgressBar.jsx');

var user = {};

var Register = React.createClass({
	
	getInitialState: function() {
		return {
			step: 1
		}
	},
	
	nextStep: function() {
		if (this.state.step == 1)
			user.email = $("#email").value;
		if (this.state.step == 2)
			user.password = $("#password").value;
	
		this.setState({step: this.state.step + 1});
	},
	
	prevStep: function() {
		this.setState({step: this.state.step - 1});
	},
	
	render: function() {
		var comp;
		
		switch (this.state.step) {
			case 1:
				comp = <EmailStep nextStep={this.nextStep} />;
				break;
			case 2:
				comp = <PasswordStep nextStep={this.nextStep} prevStep={this.prevStep} />;
				break;
			case 3:
				comp = <FinalStep prevStep={this.prevStep} user={user} />;
		}
		
		return (
			<div>
				{comp}
				<hr />
				<ProgressBar completed={(this.state.step / 3) * 100} />
			</div>
		);
	}
});

React.render(<Register />, $("#content"));