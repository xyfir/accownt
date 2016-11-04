import React from "react";

// Components
import Button from "components/forms/Button";
import Form from "./CreateOrEditForm";

// Modules
import request from "lib/request";

export default class Edit extends React.Component {
	
	constructor(props) {
		super(props);

		this._updateService = this._updateService.bind(this);
	}

	// Form builds object that can be accepted by API
	_updateService(data) {
		request({
			url: "../api/dashboard/developer/services/" + this.props.id,
			data, method: "PUT",
			success: res => {
				if (res.error)
					swal("Error", result.message, "error");
				else
					swal("Success", result.message, "success");
			}
		});
	}

	// Form handles input validation errors/notifications
	// Here we handle error/response from API
	render() {
		return (
			<div className="edit-service">
				<Form
					buttonText="Update"
					submit={this._updateService}
					loadDataFrom={this.props.id}
				/>
			</div>
		);
	}

}