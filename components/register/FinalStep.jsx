var Button = require("../forms/Button.jsx");
var Alert = require("../misc/Alert.jsx");

module.exports = React.createClass({

	getInitialState: function() {
		return {error: false, message: ""}
	},
	
	// Attempts to register user
	// Server response sets component state
	componentWillMount: function() {
		ajax({
			url: "api/register/",
			method: "POST",
			data: this.props.user,
			dataType: "json",
			success: function(result) {
				if (result.error) this.setState(result);
			}.bind(this)
		});
	},
	
	renderError: function() {
		return (
			<div className="form-step">
				<Alert type="error" title="Error">{this.state.message}</Alert>
				
				<Button onClick={this.props.prevStep}>Back</Button>
			</div>
		);
	},
	
	renderSuccess: function() {
		return (
			<div className="form-step">
				<Alert type="success" title="Account Created">
					You have successfully registered an account. 
					You will not be able to login until you verify your email.
				</Alert>
				
				<a className="link-lg" href="login">Login</a>
			</div>
		);
	},
	
	render: function() {
		if (this.state.error)
			return this.renderError();
		else
			return this.renderSuccess();
	}
});