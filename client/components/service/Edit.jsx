import React from "react";

// Components
import Button from "../forms/Button";
import Form from "./CreateOrEditForm";

// Modules
import request from "../../lib/request";

export default class Edit extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = { error: false, message: "" };

		this._updateService = this._updateService.bind(this);
	}

	// Form builds object that can be accepted by API
	_updateService(data) {
		request({
			url: "../api/service/dashboard/" + this.props.id,
			data, method: "PUT",
			success: res => this.setState(res)
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
			
				<Form
					buttonText="Update"
					submit={this._updateService}
					loadDataFrom={this.props.id}
				/>
			</div>
		);
	}

}