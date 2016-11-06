import React from "react";

// Modules
import request from "lib/request";

export default class View extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			id: 0, name: "", description: "", info: "",
			owner: 0, address: "", keys: []
		};

		this.onGenerateKey = this.onGenerateKey.bind(this);
	}
	
	componentWillMount() {
		request({
			url: "../api/dashboard/developer/services/" + this.props.id,
			success: (res) => {
				if (res.info != "")
					res.info = JSON.parse(res.info);
			
				this.setState(res);
			}
		});
	}

	onGenerateKey() {
		request({
			url: "../api/dashboard/developer/services/" + this.props.id + "/key",
			method: "POST", success: (res) => {
				if (!res.error) {
					this.setState({
						keys: this.state.keys.concat([res.key])
					});
				}
			}
		});
	}

	onDeleteKey(key) {
		request({
			url: "../api/dashboard/developer/services/" + this.props.id + "/key",
			method: "DELETE", data: {key}, success: (res) => {
				if (!res.error) {
					this.setState({
						keys: this.state.keys.filter(k => k != key)
					});
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
			<div className="service-view">
				<section className="main">
					<h2>{this.state.name} ({this.state.id})</h2>
					<p>{this.state.description}</p>
					<a href={this.state.address}>{this.state.address}</a>
				</section>
				
				<section className="requested">
					<table className="requested-data">
						<tr>
							<th>Field</th><th>Used For</th><th>Required</th>
						</tr>
					
						{requestedData}
					</table>
				</section>

				<section className="service-keys">
					<label>Service Keys</label>
					<ol>{this.state.keys.map(k => {
						return (
							<li>
								<input
									type="text"
									value={k}
									onClick={(e) => e.target.select()}
									className="service-key"
								/>
								<a
									title="Delete Service Key"
									onClick={() => this.onDeleteKey(k)}
									className="icon-delete"
								/>
							</li>
						);
					})}</ol>
					<a onClick={this.onGenerateKey}>
						Generate New Service Key
					</a>
				</section>
			</div>
		);
	}
	
}