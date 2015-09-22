var SmsVerify = require('./login/SmsVerifyStep.jsx');
var LoginStep = require('./login/LoginStep.jsx');
var RandCode = require('./login/RandomCodeStep.jsx');
var Button = require('./forms/Button.jsx');

var Login = React.createClass({
	
	getInitialState: function() {
		return {
			step: 1
		}
	},
	
	next: function(data) {
		if (data.loggedIn) {
			this.login();
		}
		else {
			// Extra security steps required
			this.setState({security: data.security});
			this.setState({uid: data.uid});
			this.setState({step: 2});
		}
	},
	
	login: function() {
		// Redirect user
		var redirect = document.cookie.replace(/(?:(?:^|.*;\s*)login_redirect\s*\=\s*([^;]*).*$)|^.*$/, "$1");
		window.location.href = redirect ? redirect : 'dashboard';
	},
	
	verify: function() {
		var data = {
			phone: this.state.security.phone,
			uid: this.state.uid
		};
		data.smsCode = data.phone ? $("#smsCode").value : 0;
		data.code = this.state.security.code ? $("#code").value : 0;
		data.codeNum = this.state.security.code ? this.state.security.codeNumber : 0;
	
		ajax({
			url: 'api/login/verify',
			method: 'POST',
			data: data,
			dataType: 'json',
			success: function(result) {
				if (result.error)
					this.setState({step: 1});
				else
					this.login();
			}.bind(this)
		});
	},
	
	render: function() {
		
		if (this.state.step == 1) {
			return <LoginStep next={this.next} />;
		}
		else {
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
				<div className='form-step'>
					<div className='form-step-body'>
						{sms}
						{steps > 1 ? <hr /> : ''}
						{code}
					</div>
					<Button onClick={this.verify}>Login</Button>
				</div>
			);
		}
	}
	
});

React.render(<Login />, $("#content"));