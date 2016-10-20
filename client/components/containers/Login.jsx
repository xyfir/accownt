import React from "react";

// Components
import SmsVerify from "../login/SmsVerifyStep";
import LoginStep from "../login/LoginStep";
import RandCode from "../login/RandomCodeStep";
import Button from "../forms/Button";

// Modules
import request from "../../lib/request";

export default class Login extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = { step: 1 };

		this.onVerify = this.onVerify.bind(this);
		this.onNext = this.onNext.bind(this);
		this._login = this._login.bind(this);
	}
	
	onNext(data) {
		if (data.loggedIn) {
			this._login();
		}
		else {
			// Extra security steps required
			this.setState({security: data.security});
			this.setState({auth: data.auth});
			this.setState({uid: data.uid});
			this.setState({step: 2});
		}
	}
	
	onVerify(e) {
		e.preventDefault();

		let data = {
			phone: this.state.security.phone,
			auth: this.state.auth,
			uid: this.state.uid
		};

		data.smsCode = data.phone ? document.querySelector("#smsCode").value : 0;
		data.codeNum = this.state.security.code ? this.state.security.codeNumber : 0;
		data.code = this.state.security.code ? document.querySelector("#code").value : 0;
	
		request({
			url: "../api/login/verify",
			method: "POST", data,
			success: result => {
				if (result.error)
					this.setState({step: 1});
				else
					this._login(result.redirect);
			}
		});
	}

	_login(redirect) {
		if (redirect != "")
			location.href = redirect;
		else
			location.hash = "/dashboard/account";
	}
	
	render() {
		if (this.state.step == 1) {
			return <LoginStep next={this.onNext} />;
		}
		else {
			return (
				<div className="form-step">
					<section className="form-step-body">
						<form onSubmit={this.onVerify}>
							{this.state.security.phone ? (
								<SmsVerify />
							) : (
								<div />
							)}
							
							{this.state.security.code ? (
								<RandCode codeNum={
									this.state.security.codeNumber + 1
								} />
							) : (
								<div />
							)}

							<Button>Login</Button>
						</form>
					</section>
				</div>
			);
		}
	}
	
}