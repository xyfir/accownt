var Button = require("../forms/Button.jsx");

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
	
	render: function() {
		var classn = this.state.error ? "input-error" : "";
	
		return (
			<div className="form-step">
				<div className="form-step-header">
					<h2>Login</h2>
					<hr />
				</div>
			
				<div className="form-step-body">
					<p className="input-error">{this.state.message}</p>
					<input type="email" placeholder="Enter your email" ref="email" className={classn} />
					<input type="password" ref="password" placeholder="Password" onKeyDown={this.keyDown} className={classn} />
				</div>
				
				<Button onClick={this.login}>Login</Button>
			</div>
		);
	}
});