var Button = require("../forms/Button.jsx");
var Alert = require("../misc/Alert.jsx");

module.exports = React.createClass({
	
	getInitialState: function() {
		return {error: false, message: "", email: "", recovered: false};
	},
	
	componentWillMount: function() {
		ajax({
			url: 'api/dashboard/account',
			dataType: 'json',
			success: function(result) {
				// Grab and set user's email
				this.setState(result);
			}.bind(this)
		});
	},
	
	updatePassword: function() {
		var curPass = React.findDOMNode(this.refs.cpassword).value + '';
		var newPass = React.findDOMNode(this.refs.npassword).value;
		var conPass = React.findDOMNode(this.refs.rpassword).value;
		
		if (newPass != conPass) {
			this.setState({error: true, message: "Passwords do not match."});
		}
		else if (newPass.length < 12) {
			this.setState({error: true, message: "Password needs to be at least 12 characters long."});
		}
		else {
			ajax({
				url: 'api/dashboard/account',
				method: 'PUT',
				dataType: 'json',
				data: {
					currentPassword: curPass,
					newPassword: newPass
				},
				success: function(result) {
					this.setState(result);
				}.bind(this)
			});
		}
	},
	
	render: function() {
		var userAlert;
		
		if (this.state.error) {
			userAlert = <Alert type="error" title="Error!">{this.state.message}</Alert>;
		}
		else if (this.state.message) {
			userAlert = <Alert type="success" title="Success!">{this.state.message}</Alert>;
		}
		
		return (
			<div className="dashboard-body col-sm-12 col-md-8">
				{userAlert}
				
				<h3>{this.state.email}</h3>
				
				<input type={this.state.recovered ? "hidden" : "password" } ref="cpassword" placeholder="Current Password" />
				<input type="password" ref="npassword" placeholder="New Password" />
				<input type="password" ref="rpassword" placeholder="Confirm" />
				
				<Button onClick={this.updatePassword}>Update Password</Button>
			</div>
		);
	}
	
});