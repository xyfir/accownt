var Button = require("../forms/Button");
var Alert = require("../misc/Alert");

module.exports = React.createClass({

	getInitialState: function() {
		return { error: false, message: "", lf: {}, loading: true };
	},
	
	// Load data from existing service (for editing)
	componentDidMount: function() {
		if (!!this.props.loadDataFrom) {
			ajax({
				url: XACC + "api/service/dashboard/" + this.props.loadDataFrom,
				dataType: "json",
				success: function(res) {
					this.setState({lf: res, loading: false});
				}.bind(this)
			});
		}
		else {
			this.setState({loading: false});
		}
	},
	
	fields: [
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
	], 

	validate: function() {
		var info = {};
	
		// Validate service info
		if (!this.refs.name.value.match(/^[\w\d\s-]{3,25}$/))
			this.setState({error: true, message: "Invalid service name"});
		else if (!this.refs.link.value.match(/^[\w\d-&?:\/.=]{1,100}$/))
			this.setState({error: true, message: "Invalid service link"});
		else if (!this.refs.description.value.match(/^[\w\d\s-,:\/.&?!@#$%*()]{3,150}$/))
			this.setState({error: true, message: "Invalid service description"});
		else {
			var error = false;
			
			// Validate all required/optional fields service wants from user
			this.fields.forEach(function(field) {
				// Field is marked as optional and/or required
				if (this.refs["opt-" + field.ref].checked || this.refs["req-" + field.ref].checked) {
					// Make sure 'Used For' description is valid
					if (!this.refs["uf-" + field.ref].value.match(/^[\w\d\s-\/]{3,25}$/)) {
						this.setState({error: true, message: "Invalid 'Used For' description for: " + field.name});
						error = true;
					}
					// Field cannot be required AND optional
					else if (this.refs["opt-" + field.ref].checked && this.refs["req-" + field.ref].checked) {
						this.setState({error: true, message: "Requested user field '" + field.name + "' cannot be both required and optional"});
						error = true;
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
			}.bind(this));
			
			if (!error) {
				// Build data object that can be accepted by API
				var data = {
					name: this.refs.name.value,
					link: this.refs.link.value,
					info: JSON.stringify(info),
					description: this.refs.description.value
				};
		
				this.props.submit(data);
			}
		}
	},

	render: function() {
		if (this.state.error)
			var alert = <Alert type="error" title="Error!">{this.state.message}</Alert>;
		else
			var alert = <div></div>;
	
		var lf = this.state.lf;
		
		// Set usedFor/optional/required if loadDataFrom
		if (typeof lf.info == "string" && lf.info != "") {
			lf.info = JSON.parse(lf.info);
			
			// Loop through required{} and then optional{}
			[0, 1].forEach(function(i) {
				var type = i == 0 ? "required" : "optional";
			
				for (var prop in lf.info[type]) {
					if (lf.info[type].hasOwnProperty(prop)) {
						for (var i = 0; i < this.fields.length; i++) {
							if (this.fields[i].ref == prop) {
								this.fields[i][type] = true;
								this.fields[i].usedFor = lf.info[type][prop];
								break;
							}
						}
					}
				}
			}.bind(this));
		}
	
		if (this.state.loading) {
			return <div></div>;
		}
	
		return (
			<div>
				{alert}
				
				<h3>Service Info</h3>
				<p>Information that users will see when registering or logging in to your service via Xyfir Accounts.</p>
				
				<label>Name</label>
				<input type="text" ref="name" defaultValue={lf.name || ""} />
				
				<label>Description</label>
				<textarea ref="description" defaultValue={lf.description || ""} ></textarea>
				
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
					{
						this.fields.map(function(field) {
							return (
								<tr>
									<td>{field.name}</td>
									<td><input type="text" ref={"uf-" + field.ref} defaultValue={field.usedFor} /></td>
									<td><input type="checkbox" ref={"req-" + field.ref} defaultChecked={field.required} /></td>
									<td><input type="checkbox" ref={"opt-" + field.ref} defaultChecked={field.optional} /></td>
								</tr>
							);
						})
					}
				</table>
			
				<Button type="primary" onClick={this.validate}>{this.props.buttonText}</Button>
			</div>
		);
	}

});