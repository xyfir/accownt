var SmsVerify = require('./login/SmsVerifyStep.jsx');
var RandCode = require('./login/RandomCodeStep.jsx');
var Button = require('./forms/Button.jsx');
var Alert = require('./misc/Alert.jsx');

var AccountRecovery = React.createClass({
	
	getInitialState: function() {
		return {
			error: false,
			message: "",
			email: "",
			auth: "",
			uid: 0
		};
	},
	
	next: function() {
		ajax({
			url: 'api/recover',
			method: 'POST',
			dataType: 'json',
			data: {email: React.findDOMNode(this.refs.email).value},
			success: function(result) {
				if (result.error)
					this.setState(result);
				else
					this.setState(result); // {error:false, message:email sent} || {error:false,security:{},...}
			}.bind(this)
		});
	},
	
	verify: function() {
		var data = {
			phone: this.state.security.phone,
			email: this.state.email,
			auth: this.state.auth,
			uid: this.state.uid,
			code: this.state.security.code ? $("#code").value : 0,
			codeNum: this.state.security.code ? this.state.security.codeNumber : 0,
			smsCode: this.state.security.phone ? $("#smsCode").value : 0
		};
	
		ajax({
			url: 'api/recover/verify',
			method: 'POST',
			dataType: 'json',
			data: data,
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
		
		if (this.state.security) {
			// Load security steps
			var sms, code, steps = 0;
		
			if (this.state.security.phone) {
				sms = <SmsVerify />;
				steps++;
			}
			if (this.state.security.code) {
				code = <RandCode codeNum={this.state.security.codeNumber + 1} />;
				steps++;
			}
			
			return (
				<div className="form-step">
					<div className="form-step-header">
						<h2>Security</h2>
						<p>
							Your account has extra security measures enabled. 
							You must enter the correct information before receiving an account recovery email. 
						</p>
						<hr />
					</div>
				
					<div className="form-step-body">
						{userAlert}
						{sms}
						{steps > 1 ? <hr /> : ''}
						{code}
					</div>
					
					<Button onClick={this.verify}>Recover Account</Button>
				</div>
			);
		}
		else {
			return (
				<div className="form-step">
					<div className="form-step-header">
						<h2>Account Recovery</h2>
						<p>Enter the email you use to login with. Emails only linked to a profile will not work.</p>
						<hr />
					</div>
				
					<div className="form-step-body">
						{userAlert}
						<input type="email" placeholder="Enter your email" ref="email" />
					</div>
					
					<Button onClick={this.next}>Next</Button>
				</div>
			);
		}
	}
	
});

React.render(<AccountRecovery />, $("#content"));