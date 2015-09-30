var Button = require('../forms/Button.jsx');
var Alert = require('../misc/Alert.jsx');

module.exports = React.createClass({
	
	getInitialState: function() {
		return {
			view: 'list',
			profiles: [],
			error: false,
			service: {},
			message: ""
		};
	},
	
	update: function() {
		ajax({
			url: 'api/dashboard/services/' + this.props.id,
			dataType: 'json',
			success: function(result) {
				this.setState({service: result.service});
			}.bind(this)
		});
		
		ajax({
			url: 'api/dashboard/profiles',
			dataType: 'json',
			success: function(result) {
				this.setState({profiles: result.profiles});
			}.bind(this)
		});
	},
	
	componentWillMount: function() {
		this.update();
	},
	
	toggleView: function() {
		if (this.state.view == 'list')
			this.setState({view: 'full'});
		else
			this.setState({view: 'list'});
	},
	
	unlink: function() {
		ajax({
			url: 'api/dashboard/services/' + this.props.id,
			method: 'DELETE',
			dataType: 'json',
			success: function(result) {
				if (!result.error)
					this.props.update();
			}.bind(this)
		});
	},
	
	updateService: function() {
		if (React.findDOMNode(this.refs.profile).value != 0) {
			var data = {
				profile: React.findDOMNode(this.refs.profile).value,
				required: React.findDOMNode(this.refs.profile_allow_required).value,
				optional: React.findDOMNode(this.refs.profile_allow_optional).value
			};
		}
		else {
			var data = {
				email: React.findDOMNode(this.refs.email).value,
				fname: React.findDOMNode(this.refs.fname).value,
				lname: React.findDOMNode(this.refs.lname).value,
				gender: React.findDOMNode(this.refs.gender).value,
				phone: React.findDOMNode(this.refs.phone).value,
				birthdate: React.findDOMNode(this.refs.birthdate).value,
				address: React.findDOMNode(this.refs.address).value,
				zip: React.findDOMNode(this.refs.zip).value,
				region: React.findDOMNode(this.refs.region).value,
				country: React.findDOMNode(this.refs.country).value
			};
		}
		
		ajax({
			url: 'api/dashboard/services/' + this.props.id,
			method: 'PUT',
			dataType: 'json',
			data: data,
			success: function(result) {
				this.setState(result);
			}.bind(this)
		});
	},
	
	render: function() {
		if (this.state.view == 'list') {
			return (
				<div className="service-list-view">
					<h2>{this.state.service.name}</h2>
					<Button type="secondary" onClick={this.toggleView}>Edit</Button>
					<Button type="danger" onClick={this.unlink}>Unlink</Button>
				</div>
			);
		}
		else {
			var s = this.state.service;
			
			// Build arrays for definition list containing
			// <required_field><field_description>
			var requiredInfo = [];
			for (var key in s.info.requested.required) {
				if (!s.info.requested.required.hasOwnProperty(key))
					continue;
				
				requiredInfo.push(<dl><dt>{key}</dt><dd>{s.info.requested.required[key]}</dd></dl>);
			}
			var optionalInfo = [];
			for (var key in s.info.requested.optional) {
				if (!s.info.requested.optional.hasOwnProperty(key))
					continue;
				
				requiredInfo.push(<dl><dt>{key}</dt><dd>{s.info.requested.optional[key]}</dd></dl>);
			}
			
			// Build array of user's profiles to select
			var profiles = [];
			this.state.profiles.forEach(function(profile) {
				profiles.push(<option value={profile.profile_id}>{profile.name}</option>);
			});
			
			// Create blank form object
			var form = {
				email: "", fname: "", lname: "", phone: "", birthdate: "", address: "",
				zip: "", region: "", country: "", gender: 0
			};
			
			// If user gave service custom data
			// merge provided data while leaving unprovided fields blank
			if (!s.info.provided.profile)
				Object.assign(form, s.info.provided);
				
			// Build alert
			var userAlert;
			if (this.state.error)
				userAlert = <Alert type="error" title="Error!">{this.state.message}</Alert>;
			else if (this.state.message)
				userAlert = <Alert type="success" title="Success!">{this.state.message}</Alert>;
		
			return (
				<div className="service-form-view">
					<h2>{s.name}</h2>
					<p>{s.description}</p>
					<a className="link-lg" onClick={this.toggleView}>Hide Form</a>
					<hr />
				
					<div className="service-info service-info-required">
						<h4>required information:</h4>
						{requiredInfo}
					</div>
					<div className="service-info service-info-optional">
						<h4>optional information:</h4>
						{optionalInfo}
					</div>
					
					<Button onClick={this.updateService}>Update Service</Button>
					
					<hr />
					
					<h2>Load Data From Profile</h2>
					<p>Choose a profile and {s.name} will automatically access information you allow from the profile.</p>
					<select ref="profile" className="profile-selector">
						<option value="0">-</option>
						{profiles}
					</select>
					<input type="checkbox" ref="profile_allow_required" 
						defaultValue={s.info.provided.profile ? "checked" : ""} />Allow Access to Required Data
					<input type="checkbox" ref="profile_allow_optional" 
						defaultValue={s.info.provided.profile && s.info.provided.profile.optional ? "checked" : ""} />Allow Access to Optional Data
					
					<h3>~ or ~</h3>
					
					<h2>Set Custom Data</h2>
					<p>Set data that only this service will be able to access.</p>
				
					<input type="email" placeholder="Email" ref="email" defaultValue={form.email} /> 
					
					<br />
					
					<input type="text" placeholder="First Name" ref="fname" defaultValue={form.fname} />
					<input type="text" placeholder="Last Name" ref="lname" defaultValue={form.lname} />
					<select ref="gender" defaultValue={form.gender}>
						<option value="0">-</option>
						<option value="1">Male</option>
						<option value="2">Female</option>
						<option value="3">Other</option>
					</select>
					<input type="tel" placeholder="Phone Number" ref="phone" defaultValue={form.phone} />
					<input type="text" placeholder="Birthdate (2020-07-31)" ref="birthdate" defaultValue={form.birthdate} />
					
					<br />
					
					<input type="text" placeholder="Address" ref="address" defaultValue={form.address} />
					<input type="number" placeholder="Zip" ref="zip" defaultValue={form.zip} />
					<input type="text" placeholder="Region/State/Province" ref="region" defaultValue={form.region} />
					<input type="text" placeholder="Country (US/CA/UK/etc)" ref="country" defaultValue={form.country} />
				</div>
			);
		}
	}
	
});