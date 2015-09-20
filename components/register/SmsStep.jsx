var Button = require("../forms/Button.jsx");

module.exports = React.createClass({

	getInitialState: function() {
		return {message: ""};
	},

	sendSMS: function() {
		var phone = React.findDOMNode(this.refs.phone).value;
		
		// Send initial code to phone to ensure
		// that user has access to number
		ajax({
			url: "api/sms/number/" + phone,
			dataType: "text",
			success: function(result) {
				this.setState({message: result});
			}.bind(this)
		});
	},

	nextStep: function() {
		var phone = React.findDOMNode(this.refs.phone).value;
		var vcode = React.findDOMNode(this.refs.code).value;
		
		if (phone && vcode) {
			// If both number and verfication code are set
			ajax({
				url: "api/sms/number/" + phone + "/" + vcode,
				success: function(result) {
					this.props.save({phone: phone});
					this.props.nextStep();
				}.bind(this),
			});
		}
		else {
			// User is skipping step
			this.props.nextStep();
		}
	},
	
	next: function(e) {
		if (e.keyCode == 13)
		 this.nextStep();
	},
	
	render: function() {
		return (
			<div className="form-step">
				<div className="form-step-header">
					<h2>SMS Verification</h2>
					<p>
						A security code will be sent to your phone upon login and account recovery for you to enter.
						<br />
						<b>Note:</b> You will not be able to sign in without the code.
						<br />
						<small>(optional, click 'Next' to skip)</small>
					</p>
					<hr />
				</div>
			
				<div className="form-step-body">
					<p>{this.state.message}</p>
					<input type="text" ref="phone" placeholder="Phone" />
					
					<Button onClick={this.sendSMS}>Send Code</Button>
					
					<input type="text" ref="code" placeholder="Code" onKeyDown={this.next} />
				</div>
				
				<Button onClick={this.props.prevStep}>Back</Button>
				<Button onClick={this.nextStep}>Next</Button>
			</div>
		);
	}
});