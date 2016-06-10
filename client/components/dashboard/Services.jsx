import React from "react";

// Modules
import request from "../../lib/request";

export default class Services extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = { services: [] };

		this._updateServices = this._updateServices.bind(this);
	}
	
	componentWillMount() {
		this._updateServices();
	}

	_updateServices() {
		request({
			url: "../api/dashboard/services",
			success: (result) => this.setState(result)
		});
	}
	
	render() {
		return (
			<div className="dashboard-body col-sm-12 col-md-8">
				<h2>Services</h2>
				<hr />
			
				<div className="service-list">{
					this.state.services.map(service => {
						services.push(
							<Service id={service.id} update={this.updateServices} />
						);
					})
				}</div>
			</div>
		);
	}
	
}