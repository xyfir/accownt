import React from "react";

// Components
import Form from "./CreateOrEditForm";

// Modules
import request from "lib/request";

export default class CreateService extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = { error: false, message: "" };

		this._createService = this._createService.bind(this);
	}

	// Form builds object that can be accepted by API
	_createService(data) {
		request({
			url: "../api/dashboard/developer/services",
			data, method: "POST",
			success: (res) => {
				if (res.error)
					swal("Error", res.message, "error");
				else
					swal("Success", res.message, "success");
			}
		});
	}

	render() {
		return (
			<div className="dashboard-body dashboard-create">
				<Form
					buttonText="Create Service"
					submit={this._createService}
				/>
			</div>
		);
	}

}