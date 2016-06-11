import React from "react";

// Modules
import request from "../../lib/request";

export default class View extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			id: 0, name: "", description: "", info: "",
			owner: 0, address: "", service_key: ""
		};

		this.onGenerateKey = this.onGenerateKey.bind(this);
	}
	
	componentWillMount() {
		request({
			url: "../api/service/dashboard/" + this.props.id,
			success: (res) => {
				if (res.info != "")
					res.info = JSON.parse(res.info);
			
				this.setState(res);
			}
		});
	}

	onGenerateKey() {
		request({
			url: "../api/service/dashboard/" + this.props.id + "/key",
			method: "PUT", success: (res) => {
				if (!res.error) {
					this.setState({ service_key: res.key });
				}
			}
		});
	}
	
	render() {
		// Build array that contains dt/dd elements for fieldname(type)/usedfor
		let requestedData = [];
		const s = this.state;

		if (typeof this.state.info == "object") {
			[0, 1].forEach(i => {
				const type = i == 0 ? "required" : "optional";
				
				Object.keys(s.info[type]).forEach(key => {
					requestedData.push(
						<tr>
							<td>{key}</td>
							<td>{s.info[type][key]}</td>
							<td>{type == "required" ? "Yes" : "No"}</td>
						</tr>
					);
				});
			});
		}
	
		return (
			<div>
				<h2>{this.state.name} ({this.state.id})</h2>
				<p>{this.state.description}</p>
				<a href={this.state.address}>{this.state.address}</a>
				
				<hr />
				
				<table className="requested-data">
					<tr>
						<th>Field</th><th>Used For</th><th>Required</th>
					</tr>
				
					{requestedData}
				</table>

				<hr />

				<h3>Service Key</h3>
				<span className="service-key">{this.state.service_key}</span>
				<a onClick={this.onGenerateKey}>Generate New Service Key</a>
			</div>
		);
	}
	
}