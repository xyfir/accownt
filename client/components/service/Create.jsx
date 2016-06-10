import React from "react";

// Components
import Alert from "../misc/Alert";
import Form from "./CreateOrEditForm";

// Modules
import request from "../../lib/request";

export default class Create extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = { error: false, message: "" };

		this._createService = this._createService.bind(this);
	}

	// Form builds object that can be accepted by API
	_createService(data) {
		request({
			url: "../api/service/dashboard",
			data, method: "POST",
			success: (res) => this.setState(res)
		});
	}

	// Form handles input validation errors/notifications
	// Here we handle error/response from API
	render() {
		let alert;
		if (this.state.error)
			alert = <Alert type="error" title="Error!">{this.state.message}</Alert>;
		else if (this.state.message != "")
			alert = <Alert type="success" title="Success!">{this.state.message}</Alert>;
	
		return (
			<div>
				{alert}
			
				<Form buttonText="Create Service" submit={this._createService} />
			</div>
		);
	}

}