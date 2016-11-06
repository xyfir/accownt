import React from "react";

// Components
import Button from "components/forms/Button";

// Modules
import request from "lib/request";

export default class List extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = { services: [] };
	}
	
	componentWillMount() {
		request({
			url: "../api/dashboard/developer/services",
			success: (res) => this.setState(res)
		});
	}
	
	render() {
		return (
			<section className="service-list">{
				this.state.services.map(service => {
					return (
						<div className="service-list-view">
							<h2>
								<a href={"#/dashboard/developer/" + service.id}>
									{service.name}
								</a>
							</h2>
							
							<Button
								type="secondary"
								onClick={() => {
									location.hash = "/dashboard/developer/"
										+ service.id + "/edit";
								}}
							><span className="icon-edit" />Edit</Button>
							<Button
								type="danger"
								onClick={() => {
									location.hash = "/dashboard/developer/"
										+ service.id + "/delete";
								}}
							><span className="icon-delete" />Delete</Button>
						</div>
					);
				})
			}</section>
		);
	}
	
}