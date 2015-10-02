var Button = require("../forms/Button.jsx");
var Alert = require("../misc/Alert.jsx");

module.exports = React.createClass({
	
	getInitialState: function() {
		return {
			error: false,
			message: "",
			phone: "",
			whitelist: "",
			codes: "",
			passwordless: 0,
			verifyingSms: false
		};
	},
	
	componentWillMount: function() {
		ajax({
			url: 'api/dashboard/security',
			dataType: 'json',
			success: function(result) {
				// Grab and set security data 
				this.setState(result);
			}.bind(this)
		});
	},
	
	updatePhone: function() {
		if (this.state.verifyingSms) {
			ajax({
				url: 'api/dashboard/security/phone/verify',
				method: 'PUT',
				dataType: 'json',
				data: {
					phone: React.findDOMNode(this.refs.phone).value,
					code: React.findDOMNode(this.refs.smsCode).value
				},
				success: function(result) {
					this.setState(result);
					this.setState({verifyingSms: false});
				}.bind(this)
			});
		}
		else {
			var phone = React.findDOMNode(this.refs.phone).value;
			phone = phone ? phone : 0;
			
			ajax({
				url: 'api/dashboard/security/phone',
				method: 'PUT',
				dataType: 'json',
				data: {
					phone: phone
				},
				success: function(result) {
					return;
				}.bind(this)
			});
			
			if (phone != 0)
				this.setState({verifyingSms: true});
		}
	},
	
	generateCodes: function() {
		ajax({
			url: 'api/dashboard/security/codes',
			method: 'PUT',
			dataType: 'json',
			data: {
				type: React.findDOMNode(this.refs.codeType).value,
				count: React.findDOMNode(this.refs.codeCount).value
			},
			success: function(result) {
				this.setState(result);
			}.bind(this)
		});
	},
	
	changeWhitelist: function() {
		this.setState({whitelist: this.refs.whitelist.replace("\n", ",")});
	},
	
	updateWhitelist: function() {
		ajax({
			url: 'api/dashboard/security/whitelist',
			method: 'PUT',
			dataType: 'json',
			data: {
				whitelist: React.findDOMNode(this.refs.whitelist).value.replace("\n", ",")
			},
			success: function(result) {
				this.setState(result);
			}.bind(this)
		});
	},
	
	updatePasswordless: function() {
		ajax({
			url: 'api/dashboard/security/passwordless',
			method: 'PUT',
			dataType: 'json',
			data: {
				passwordless: React.findDOMNode(this.refs.passwordless).value
			},
			success: function(result) {
				this.setState(result);
			}.bind(this)
		});
	},
	
	render: function() {
		var userAlert;
		
		if (this.state.error)
			userAlert = <Alert type="error" title="Error!">{this.state.message}</Alert>;
		else if (this.state.message)
			userAlert = <Alert type="success" title="Success!">{this.state.message}</Alert>;
		
		// Create list of codes
		var codes = "";
		if (this.state.codes) {
			codes = [];
			this.state.codes.split(',').forEach(function(code) {
				codes.push(<li>{code}</li>);
			});
		}
		
		return (
			<div className="dashboard-body col-sm-12 col-md-8">
				{userAlert}
				
				<div>
					<h2>Two Factor Authentication</h2>
					<p>Upon login and account recovery we will send a code to your phone via SMS.</p>
					
					<input type="tel" ref="phone" placeholder={this.state.phone > 0 ? this.state.phone : "Phone #"} />
					
					{this.state.verifyingSms ? <input type="text" ref="smsCode" placeholder="Code" /> : ""}
					
					<Button onClick={this.updatePhone}>{this.state.verifyingSms ? "Verify Code" : "Update Phone"}</Button>
				</div>
				
				<hr />
				
				<div>
					<h2>Security Codes</h2>
					<p>A numbered list of 5-20 randomly generated words and/or numbers. On login and account recovery a specific code must be entered.</p>
					
					<ol>
						{codes}
					</ol>
					
					<label>Code Type</label>
					<select ref="codeType">
						<option value="1">Numbers</option>
						<option value="2">Words</option>
						<option value="3">Both</option>
					</select>
					
					<label>How Many?</label>
					<input type="number" ref="codeCount" placeholder="10" />
					
					<Button onClick={this.generateCodes}>Generate Codes</Button>
				</div>
				
				<hr />
				
				<div>
					<h2>IP Whitelist</h2>
					<p>
						Only allow logins from a list of whitelisted IP addresses.
						<br />
						<small>Each address should be separated by a new line.</small>
					</p>
					
					<textarea value={this.state.whitelist.replace(",", "\n")} onChange={this.changeWhitelist} ref="whitelist" />
					
					<Button onClick={this.updateWhitelist}>Update Whitelist</Button>
				</div>
				
				<hr />
				
				<div>
					<h2>Passwordless Login</h2>
					<p>Login with a link sent to your email or phone.</p>
					
					<select ref="passwordless">
						<option value="0">Disabled</option>
						<option value="1">Receive via SMS</option>
						<option value="2">Receive via Email</option>
						<option value="3">Receive via Both</option>
					</select>
					
					<Button onClick={this.updatePasswordless}>Update</Button>
				</div>
			</div>
		);
	}
	
});