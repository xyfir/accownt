import React from "react";

// Components
import Button from "../forms/Button";

// Modules
import request from "../../lib/request";

export default class List extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = { services: [] };
	}
	
	componentWillMount() {
		request({
			url: "../api/service/dashboard",
			success: (res) => this.setState(res)
		});
	}
	
	render() {
		return (
			<div className="service-list">{
				this.state.services.map(service => {
					return (
						<div className="service-list-view">
							<h2>
								<a href={"#/service/dashboard/" + service.id}>
									{service.name}
								</a>
							</h2>
							
							<Button
								type="secondary"
								onClick={() => {
									location.hash = "/service/dashboard/" + service.id + "/edit";
								}}
							><span className="icon-edit" />Edit</Button>
							<Button
								type="danger"
								onClick={() => {
									location.hash = "/service/dashboard/" + service.id + "/delete";
								}}
							><span className="icon-delete" />Delete</Button>
						</div>
					);
				})
			}</div>
		);
	}
	
}