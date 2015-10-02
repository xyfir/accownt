var Button = require("../forms/Button.jsx");
var Alert = require("../misc/Alert.jsx");

module.exports = React.createClass({

	getInitialState: function() {
		return {error: false, message: ""};
	},

	login: function() {
		var email = React.findDOMNode(this.refs.email).value;
		var password = React.findDOMNode(this.refs.password).value;
		
		ajax({
			url: 'api/login',
			method: 'POST',
			dataType: 'json',
			data: {
				email: email,
				password: password
			},
			success: function(result) {
			
				if (result.error)
					this.setState(result);
				else
					this.props.next(result);
				
			}.bind(this)
		});
	},
	
	keyDown: function(e) {
		if (e.keyCode == 13)
			this.login();
	},
	
	passwordless: function() {
		if (React.findDOMNode(this.refs.email).value == "")
			return;
	
		ajax({
			url: 'api/login/passwordless/' + React.findDOMNode(this.refs.email).value,
			dataType: 'json',
			success: function(result) {
				this.setState(result);
			}.bind(this)
		});
	},
	
	render: function() {
		var classn = this.state.error ? "input-error" : "";
		
		var userAlert;
		if (this.state.error)
			userAlert = <Alert type="error" title="Error!">{this.state.message}</Alert>;
		else if (this.state.message)
			userAlert = <Alert type="success" title="Success!">{this.state.message}</Alert>;
	
		return (
			<div className="form-step">
				<div className="form-step-header">
					<h2>Login</h2>
					<hr />
				</div>
			
				<div className="form-step-body">
					{userAlert}
					<input type="email" placeholder="Enter your email" ref="email" className={classn} />
					<input type="password" ref="password" placeholder="Password" onKeyDown={this.keyDown} className={classn} />
					<a href="register">Create Account</a> | 
					<a href="recover">Account Recovery</a> | 
					<a href="#PasswordlessLogin" onClick={this.passwordless}>Passwordless Login</a> 
				</div>
				
				<Button onClick={this.login}>Login</Button>
			</div>
		);
	}
});