var EmailStep = require('./register/EmailStep.jsx');
var PasswordStep = require('./register/PasswordStep.jsx');
var SmsStep = require('./register/SmsStep.jsx');
var FinalStep = require('./register/FinalStep.jsx');

var ProgressBar = require('./forms/ProgressBar.jsx');

var Register = React.createClass({
	
	getInitialState: function() {
		return {
			step: 1,
			email: "",
			password: "",
			phone: "",
			data: {}
		}
	},
	
	nextStep: function() {
		this.setState({step: this.state.step + 1});
	},
	
	prevStep: function() {
		this.setState({step: this.state.step - 1});
	},
	
	save: function(data) {
		this.setState(data);
		
		this.setState({
			data: {
				email: this.state.email,
				password: this.state.password,
				phone: this.state.phone
			}
		});
	},
	
	render: function() {
		var comp;
		
		switch (this.state.step) {
			case 1:
				comp = <EmailStep nextStep={this.nextStep} save={this.save} />;
				break;
			case 2:
				comp = <PasswordStep nextStep={this.nextStep} prevStep={this.prevStep} save={this.save} />;
				break;
			case 3:
				comp = <SmsStep nextStep={this.nextStep} prevStep={this.prevStep} save={this.save} />;
				break;
			case 4:
				comp = <FinalStep prevStep={this.prevStep} data={this.state.data} />;
		}
		
		return (
			<div>
				{comp}
				<hr />
				<ProgressBar completed={(this.state.step / 4) * 100} />
			</div>
		);
	}
});

React.render(<Register />, $("#content"));