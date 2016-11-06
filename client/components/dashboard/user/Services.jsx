import React from "react";

// Components
import Service from "./Service";

// Modules
import request from "lib/request";

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
			url: "../api/dashboard/user/services",
			success: (result) => this.setState(result)
		});
	}
	
	render() {
		return (
			<div className="dashboard-body dashboard-services">
				<section className="services">
					<div className="service-list">{
						this.state.services.map(service => {
							return (
								<Service
									id={service.id}
									update={this._updateServices}
								/>
							);
						})
					}</div>
				</section>
			</div>
		);
	}
	
}