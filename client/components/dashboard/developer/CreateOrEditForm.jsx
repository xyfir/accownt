import React from "react";

// Components
import Button from "components/forms/Button";

// Modules
import request from "lib/request";

export default class CreateOrEditForm extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = { lf: {}, loading: true };

		this.fields = [
			{ name: "F. Name", ref: "fname", usedFor: "", optional: false, required: false },
			{ name: "L. Name", ref: "lname", usedFor: "", optional: false, required: false },
			{ name: "Address", ref: "address", usedFor: "", optional: false, required: false },
			{ name: "ZIP Code", ref: "zip", usedFor: "", optional: false, required: false },
			{ name: "Country", ref: "country", usedFor: "", optional: false, required: false },
			{ name: "Region", ref: "region", usedFor: "", optional: false, required: false },
			{ name: "Email", ref: "email", usedFor: "", optional: false, required: false },
			{ name: "Phone #", ref: "phone", usedFor: "", optional: false, required: false },
			{ name: "Gender", ref: "gender", usedFor: "", optional: false, required: false },
			{ name: "Birthdate", ref: "birthdate", usedFor: "", optional: false, required: false }
		];

		this.onValidate = this.onValidate.bind(this);
	}
	
	// Load data from existing service (for editing)
	componentDidMount() {
		if (!!this.props.loadDataFrom) {
			request({
				url: "../api/service/dashboard/" + this.props.loadDataFrom,
				success: (res) => this.setState({lf: res, loading: false})
			});
		}
		else {
			this.setState({loading: false});
		}
	}

	onValidate() {
		let info = {};
	
		// Validate service info
		if (!this.refs.name.value.match(/^[\w\d\s-]{3,25}$/))
			swal("Error", "Invalid service name", "error");
		else if (!this.refs.link.value.match(/^[\w\d-&?:\/.=]{1,100}$/))
			swal("Error", "Invalid service link", "error");
		else if (!this.refs.description.value.match(/^[\w\d\s-,:\/.&?!@#$%*()]{3,150}$/))
			swal("Error", "Invalid service description", "error");
		else {
			let error = false;
			
			// Validate all required/optional fields service wants from user
			this.fields.forEach(field => {
				// Field is marked as optional and/or required
				if (
					this.refs["opt-" + field.ref].checked
					|| this.refs["req-" + field.ref].checked
				) {
					// Make sure 'Used For' description is valid
					if (!this.refs["uf-" + field.ref].value.match(/^[\w\d\s-\/]{3,25}$/)) {
						swal(
							"Error",
							"Invalid 'Used For' description for: " + field.name,
							"error"
						); error = true;
					}
					// Field cannot be required AND optional
					else if (
						this.refs["opt-" + field.ref].checked
						&& this.refs["req-" + field.ref].checked
					) {
						swal(
							"Error",
							"Requested user field '" + field.name
								+ "' cannot be both required and optional",
							"error"
						); error = true;
					}
					// Add field to info object
					else {
						info[field.ref] = {
							required: this.refs["req-" + field.ref].checked,
							optional: this.refs["opt-" + field.ref].checked,
							value: this.refs["uf-" + field.ref].value 
						};
					}
				}
			});
			
			if (!error) {
				// Build data object that can be accepted by API
				this.props.submit({
					name: this.refs.name.value,
					link: this.refs.link.value,
					info: JSON.stringify(info),
					description: this.refs.description.value
				});
			}
		}
	}

	render() {
		let lf = this.state.lf;
		
		// Set usedFor/optional/required if loadDataFrom
		if (typeof lf.info == "string" && lf.info != "") {
			lf.info = JSON.parse(lf.info);
			
			// Loop through required{} and then optional{}
			[0, 1].forEach(t => {
				const type = t == 0 ? "required" : "optional";
			
				Object.keys(lf.info[type]).forEach(prop => {
					for (let i = 0; i < this.fields.length; i++) {
						if (this.fields[i].ref == prop) {
							this.fields[i][type] = true;
							this.fields[i].usedFor = lf.info[type][prop];
							break;
						}
					}
				});
			});
		}
	
		if (this.state.loading) return <div />;
	
		return (
			<div>
				<h3>Service Info</h3>
				<p>
					Information that users will see when registering or logging in to your service via Xyfir Accounts.
				</p>
				
				<label>Name</label>
				<input type="text" ref="name" defaultValue={lf.name || ""} />
				
				<label>Description</label>
				<textarea ref="description" defaultValue={lf.description || ""} />
				
				<label>Website</label>
				<input type="text" ref="link" defaultValue={lf.address || ""} />
				
				<hr />
				
				<h3>Requested Information</h3>
				<p>
					This is the information your services wants or needs from a user's account.
					<br />
					'Used For' should shortly summarize <em>why</em> your service wants/needs that field from the user.
				</p>
				
				<table className="requested-info">
					<tr>
						<th>Field</th><th>Used For</th><th>Required</th><th>Optional</th>
					</tr>
					{this.fields.map(field => {
						return (
							<tr>
								<td>{field.name}</td>
								<td>
									<input
										type="text"
										ref={"uf-" + field.ref}
										defaultValue={field.usedFor}
									/>
								</td>
								<td>
									<input
										type="checkbox"
										ref={"req-" + field.ref}
										defaultChecked={field.required}
									/>
								</td>
								<td>
									<input
										type="checkbox"
										ref={"opt-" + field.ref}
										defaultChecked={field.optional}
									/>
								</td>
							</tr>
						);
					})}
				</table>
			
				<Button type="primary" onClick={this.onValidate}>
					{this.props.buttonText}
				</Button>
			</div>
		);
	}

}